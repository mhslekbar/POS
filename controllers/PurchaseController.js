const PurchaseModel = require("../models/PurchaseModel");
const ProductModel  = require("../models/ProductModel");
const SupplierModel = require("../models/SupplierModel");
const {getLatestDayOfMonth} = require("../functions/functions")

const getPurchases = async (req, res) => {
    try {
        const { numPurchase, productId, filterDay, day, month, year } = req.query
        let purchases, queryFound = false
        if(numPurchase) {
            purchases = await PurchaseModel.find({ numPurchase }).populate("LinePurchase.productId").sort({createdAt: -1})
            queryFound = true
        }
        if(productId) {
            purchases = await PurchaseModel
                .find({ "LinePurchase.productId":productId })
                .populate("LinePurchase.productId")
                .sort({createdAt: -1})
            queryFound = true
        }

        if(filterDay && !queryFound) {
            let queryFilter = ""
            if(day && month && year) {
              queryFilter = {
                $expr: {
                  $and: [
                    {$eq: [{ $year: "$createdAt" }, year]},
                    {$eq: [{ $month: "$createdAt" }, month]},
                    {$eq: [{ $dayOfMonth: "$createdAt" }, day]},
                  ]
                }
              }
              queryFound = true 
            } else {
              if(year) {
                queryFound = true
              }
              let monthStart = month
              let monthEnd = month
              if(month === "") {
                monthStart = 1
                monthEnd = 12 
              }
              let dayStart = day
              let dayEnd = day
              if(day === "") {
                dayStart = 1
                dayEnd = getLatestDayOfMonth(year, monthEnd)
              }
      
              let startDate = new Date(year + "-" + monthStart + "-" + dayStart)
              let endDate = new Date(year + "-" + monthEnd + "-" + dayEnd)
              endDate.setHours("23", "59")
              queryFilter = { createdAt: { $gte: startDate, $lte: endDate }}
      
            }
      
            if(queryFound) {
                purchases = await PurchaseModel
              .find(queryFilter)
              .populate("LinePurchase.productId")
              .sort({createdAt: -1})
            }
          }

        if(!queryFound) {
            purchases = await PurchaseModel.find().populate("LinePurchase.productId").sort({createdAt: -1})
        }
        res.status(200).json({success: purchases});         

    } catch (err) {
        res.status(500).json({err: err.message}); 
    }

}

const insertPurchase = async (req, res) => {
    try {
        const Purchase = await PurchaseModel.findOne().sort({createdAt: -1})

        const lastNumPurchase = Purchase?.numPurchase || 0
        const newNumPurchase  = parseInt(lastNumPurchase) + 1;

        const { LinePurchase, supplier } = req.body

        const newPurchase = new PurchaseModel({numPurchase: newNumPurchase, supplier });
        newPurchase.LinePurchase = LinePurchase
        let savedPurchase = await newPurchase.save();

        LinePurchase?.map(async line => {
            const productData = await ProductModel.findOne({ _id: line.productId })
            const prevQty = productData.qty
            const newQty = parseFloat(prevQty) + parseFloat(line.mainQty) 
            productData.qty = newQty
            productData.price = line.sell_price
            await productData.save();
        })

        const totalFact = LinePurchase.reduce((acc, currVal) => acc + currVal.total_price, 0);

        if(supplier.amountPayed < totalFact) {
            const supplierData = await SupplierModel.findById(supplier.supplierId)
            const prevBalance  = supplierData.balance
            const reste = totalFact - supplier.amountPayed
            const newBalance = Number(prevBalance) - Number(reste)
            let purchaseId = await PurchaseModel.findOne({numPurchase: newNumPurchase});
                purchaseId = purchaseId._id;

            supplierData.balance = newBalance;

            // if(supplier.amountPayed > 0) {
                supplierData.historyPayment.push({ payment: supplier.amountPayed, purchaseId })
            // }
            await supplierData.save();
        }
        await getPurchases(req, res)
    } catch(err) {
        res.status(500).json({err: err.message})
    }
}

const updatePurchase = async (req, res) => {
    try {
        const { id }  = req.params
        const Purchase = await PurchaseModel.findById(id)
        const { supplierId, amountPayed } = req.body
        const total = Purchase.LinePurchase.reduce((acc, currVal) => currVal.total_price + acc, 0)

        if(!Purchase.supplier.supplierId.equals(supplierId)) {
            // Start With Previous Supplier
            const prevSupplierData = await SupplierModel.findById(Purchase.supplier.supplierId)
            const prevBalancePrevSupplier = prevSupplierData.balance
            const newBalancePrevSupplier  = Number(prevBalancePrevSupplier) + Number(total) - Number(Purchase.supplier.amountPayed)
            prevSupplierData.balance = newBalancePrevSupplier
            prevSupplierData.historyPayment = prevSupplierData.historyPayment.filter(supp =>  !supp.purchaseId?.equals(id))
            prevSupplierData.save();
            // END With Previous Supplier

            // START With New Supplier
            const newSupplierData        = await SupplierModel.findById(supplierId)
            const prevBalanceNewSupplier = newSupplierData.balance
            const newBalanceNewSupplier  = Number(prevBalanceNewSupplier) - Number(total) + Number(amountPayed)
            newSupplierData.balance = newBalanceNewSupplier
            newSupplierData.historyPayment.push({ purchaseId: id, payment: amountPayed })
            newSupplierData.save()
            // END With New Supplier
            Purchase.supplier.supplierId = supplierId
            Purchase.supplier.amountPayed = amountPayed
            await Purchase.save();
        } else {
            const SupplierData = await SupplierModel.findById(supplierId)
            const prevBalance  = SupplierData.balance
            const index = SupplierData.historyPayment.findIndex(sup => sup.purchaseId?.equals(id))
            if(index > -1) {
                const prevAmountPayed = SupplierData.historyPayment[index]?.payment
                const newBalance   = Number(prevBalance) - Number(prevAmountPayed) + Number(amountPayed)
                SupplierData.balance = newBalance
                if(SupplierData.historyPayment[index]) {
                    SupplierData.historyPayment[index].payment = amountPayed
                }
                Purchase.supplier.amountPayed = amountPayed
            }
            await SupplierData.save();
            await Purchase.save();
        }

        await getPurchases(req, res)
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({err: err.message})
    }
}

const supplyPurchase = async (req, res) => {
    try {
        const { id } = req.params;

        const Purchase = await PurchaseModel.findById({_id: id})

        const data = req.body
        const { productId, sell_price, qty, total_price } = req.body

        const productData = await ProductModel.findOne({ _id: productId })
        const prevQty = productData.qty
        const prevLineQty = qty

        const newQty = parseFloat(prevQty) + parseFloat(prevLineQty)  

        productData.qty = newQty
        productData.price = sell_price
        await productData.save();
        Purchase.LinePurchase.push(data);
        await Purchase.save();
        
        const supplier = Purchase.supplier
        const supplierId = supplier.supplierId
        const supplierData = await SupplierModel.findById(supplierId);
        const prevBalance = supplierData.balance
        const newBalance = Number(prevBalance) - Number(total_price)
        supplierData.balance = newBalance
        await  supplierData.save()

        await getPurchases(req, res);
    } catch(err) {
        res.status(500).json({err: err.message})
    }
}

const deletePurchases = async (req, res) => { // supprimer la facture en entier
    try {
        const { id } = req.params;

        const Purchase = await PurchaseModel.findById({_id: id})
        
        const LinePurchase = Purchase.LinePurchase

        LinePurchase.map(async line => {
            const prevQty = (await ProductModel.findOne({ _id: line.productId })).qty
        
            const newQty = parseFloat(prevQty) - parseFloat(line.qty) 

            await ProductModel.updateMany({ _id: line.productId }, { qty: newQty }, { new: true });
        })

        const total = LinePurchase.reduce((acc, currVal) => acc + currVal.total_price, 0)
        
        const supplier = Purchase.supplier
        
        const supplierData = await SupplierModel.findById(supplier.supplierId);

        const findIndex = supplierData?.historyPayment.findIndex(paym => paym.purchaseId?.equals(id))

        if(findIndex > -1) {
            const numPurchase = supplierData.historyPayment[findIndex].numPurchase
            const prevBalance = supplierData.balance
            const newBalance  = prevBalance - supplier.amountPayed + Number(total)
            supplierData.balance = newBalance
            supplierData.historyPayment = supplierData.historyPayment.filter(payment => payment.numPurchase !== numPurchase)
            await supplierData.save()
        }

        await PurchaseModel.deleteOne({ _id: id })        
        res.status(200).json({success: Purchase})

    } catch(err) {
        res.status(500).json({ err: err.message })
    }
}

const deleteLinePurchase = async (req, res) => {
    try {

        const { purchaseId, idLinePurchase } = req.params;
        const Purchase = await PurchaseModel.findOne({ _id: purchaseId })

        const [ LinePurchase ] = Purchase.LinePurchase.filter(line => line._id.equals(idLinePurchase));
        const productId = LinePurchase.productId
        const prevQty = ( await ProductModel.findById(productId)).qty
        const newQty  = prevQty - LinePurchase.qty;
        await ProductModel.updateOne({ _id: productId }, { $set: { qty: newQty }} , { new: true } );
                
        const { supplier } = Purchase

        const supplierData = await SupplierModel.findById(supplier.supplierId);

        const findIndex = supplierData.historyPayment.findIndex(paym => paym.purchaseId?.equals(purchaseId))

        if(findIndex > -1) {
            const prevBalance = supplierData.balance
            const newBalance  = Number(prevBalance) + Number(LinePurchase.total_price)
            supplierData.balance = newBalance
            supplierData.save()
        }
        
        const newLinePurchase = Purchase.LinePurchase.filter(line => !line._id.equals(idLinePurchase))
        Purchase.LinePurchase = newLinePurchase

        await Purchase.save();
        await getPurchases(req, res)
        // res.status(200).json({success: Purchase})
    } catch(err) {
        res.status(500).json({err: err.message})
    }
}

module.exports = { getPurchases, insertPurchase, updatePurchase, supplyPurchase, deleteLinePurchase, deletePurchases }
