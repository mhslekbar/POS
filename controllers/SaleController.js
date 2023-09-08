const SaleModel = require("../models/SaleModel");
const ProductModel = require("../models/ProductModel");
const PurchaseModel = require("../models/PurchaseModel");
const ClientModel   = require("../models/ClientModel");
const {getLatestDayOfMonth} = require("../functions/functions")

const getSales = async (req, res) => {
  try {
    let { numSale, productId, filterDay, day, month, year } = req.query
    
    let sales, queryFound = false
    if(numSale && !queryFound) {
      sales = await SaleModel
      .find({numSale})
      .populate("LineSale.productId")
      .populate("client.clientId")
      .sort({createdAt: -1})
      queryFound = true
    }
    if(productId && !queryFound) {
      sales = await SaleModel
      .find({"LineSale.productId": productId})
      .populate("LineSale.productId")
      .populate("client.clientId")
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
        sales = await SaleModel
        .find(queryFilter)
        .populate("LineSale.productId")
        .populate("client.clientId")
        .sort({createdAt: -1})
      }
    }

    if(!queryFound) {
      sales = await SaleModel
      .find()
      .populate("LineSale.productId")
      .populate("client.clientId")
      .sort({createdAt: -1})
    }
    res.status(200).json({success: sales})

  } catch (err) {
    console.log(err)
    res.status(500).json({err: err.message})
  }

};


const createSale = async (req, res) => {
  try {
    const Sale = await SaleModel.findOne().sort({ createdAt: -1 });

    const lastNumSale = Sale?.numSale || 0;
    const newNumSale  = Number(lastNumSale) + 1;

    const { userId, client, LineSale } = req.body
    const formErrors = []
    
    let [ objectProduct ] = []
    let arrayExistingProduct = []

    for (const [index, dataOfBody] of LineSale.entries()) {
      let { productId, price, qty } = dataOfBody

      if (productId.length === 0) {
        formErrors.push(`Le nom du produit est obligatoire`);
      } else {
        [objectProduct] = await ProductModel.find({
          _id: productId,
          qty: { $gte: isNaN(qty) ? 0 : qty},
        });

        if (!objectProduct) {
          formErrors.push(`La quantité du produit n'existe pas`);
        } else {
          arrayExistingProduct.push({objectProduct, qty})
        }
      }

      if (price === "" || price === 0) {
        formErrors.push(`Le prix du produit est obligatoire`);
      }
      if (isNaN(price)) {
        formErrors.push(`Le prix du produit doit etre numerique`);
      }

      if (isNaN(qty)) {
        formErrors.push(`La quantité du produit doit etre numerique`);
      }

      if (qty === "" || qty === 0) {
        formErrors.push(`La quantité du produit est obligatoire`);
      }

    }

    if (formErrors.length > 0) {
      return res.status(300).json(formErrors);
    }

    // Create new sale here
    let newSale
    if(client.clientId) {
      newSale = new SaleModel({ numSale: newNumSale, userId, client, LineSale });
    } else {
      newSale = new SaleModel({ numSale: newNumSale, userId, client: {amountPayed: client.amountPayed}, LineSale });
    }

    const PurchasesItem = await PurchaseModel.find()
    
    for(productItem of arrayExistingProduct) {
      // Start Update product Quantity
      const prevQtyProduct = productItem.objectProduct.qty
      let qtyNeeded = productItem.qty
      const newQtyProduct = Number(prevQtyProduct) - Number(qtyNeeded);
      await ProductModel.updateOne({ _id: productItem.objectProduct._id}, {$set : {qty : newQtyProduct }});
      // End Update product Quantity

      for(const purchaseItem of PurchasesItem) {
        let filteredPurchaseItem = []

        filteredPurchaseItem = purchaseItem.LinePurchase.
          filter(purchase => 
          purchase.productId.equals(productItem.objectProduct._id) 
          && purchase.qty > 0);

          let purchaseIndex = 0;
    
          while (qtyNeeded > 0 && purchaseIndex < filteredPurchaseItem.length) {
            let item = filteredPurchaseItem[purchaseIndex];
            
            const qtyToSubtract = Math.min(qtyNeeded, item.qty);
            
            let [filteredLineSale] = newSale.LineSale.filter(ln => ln.productId.equals(productItem.objectProduct._id))
            
            await filteredLineSale.LineDetails.push({
              PurchaseId: purchaseItem._id,
              LinePurchaseId: item._id,
              qty: qtyToSubtract,
              buy_price:item.buy_price
            });
    
            item.qty -= qtyToSubtract;
            item.updatedAt = Date.now();
    
            qtyNeeded -= qtyToSubtract;
            if (item.qty <= 0) {
              purchaseIndex++;
            }
            
            await PurchaseModel.updateOne(
              { "LinePurchase._id": item._id },
              { $set: { "LinePurchase.$.qty": item.qty, "LinePurchase.$.updatedAt": item.updatedAt } },
              { new: true }
            );
    
          }
      }
    }

    const { clientId, amountPayed } = client 
    const total = LineSale.reduce((acc, currVal) => acc + (currVal.qty * currVal.price), 0)
    if(clientId) {
      const clientData = await ClientModel.findOne({_id: clientId});
      const prevDette  = clientData.dette
      const reste      = total - amountPayed
      const newDette   = Number(prevDette) + Number(reste)
      clientData.dette = Number(newDette)
      clientData.historyPayment.push({payment: amountPayed, saleId: newSale._id})
      await clientData.save()
    }

    await newSale.save();

    await getSales(req, res)
    // res.status(200).json({success: newSale});

  } catch (err) {
    console.log("err: ", err)
    res.status(500).json({err: err.message});
  }
};

const appendSale = async (req, res) => {
  try {
    const { id } = req.params
    const { LineSale } = req.body
    
    let formErrors = []
    
    let { productId, price, qtyNeeded } = LineSale;
    const qtyNeededOld  = qtyNeeded // quantity before reduce of qty 
    let objectProduct = {}
    
    if(productId.length === 0) {
      formErrors.push(`le produit est obligatoire`)
    } else {
      objectProduct = await ProductModel
        .findOne({ 
          _id: productId, 
          qty: { $gte: isNaN(qtyNeeded) ? 0 : qtyNeeded} 
        })
      if(!objectProduct) {
        formErrors.push(`la quantite du produit n'est pas valable`)
      } 
    }

    if (price === "" || price === 0) {
      formErrors.push(`Le prix du produit est obligatoire`);
    }
    if (isNaN(price)) {
      formErrors.push(`Le prix du produit doit etre numerique`);
    }

    if (isNaN(qtyNeeded)) {
      formErrors.push(`La quantité du produit doit etre numerique`);
    }

    if (qtyNeeded === "" || qtyNeeded === 0) {
      formErrors.push(`La quantité du produit est obligatoire`);
    }
    if (formErrors.length > 0) {
      return res.status(300).json({formErrors});
    }

    // Append LineSale in sale

    let newSale = await SaleModel.findOne({ _id: id });
    const findIndexSale = newSale.LineSale.findIndex(ln => ln.productId.equals(productId))
    if(findIndexSale === -1) {
      const prevLineSale = newSale.LineSale
      prevLineSale.push({productId, price, qty: qtyNeeded})
        
      const { clientId } = newSale.client
      if(clientId) {
        const clientData = await ClientModel.findOne({_id: clientId});
        const prevDette  = clientData.dette
        const amountOfNewLineSale = Number(price) * Number(qtyNeededOld)
        const newDette   = Number(prevDette) + Number(amountOfNewLineSale)
        clientData.dette = Number(newDette)
        await clientData.save()
      }

    } else {
      // if is already exist 
      const priceOfPrevLine =  newSale.LineSale[findIndexSale].price
      const qtyOfPrevLine   =  newSale.LineSale[findIndexSale].qty

      const PrevQtyProduct  = objectProduct.qty
      const currentQty = Number(PrevQtyProduct) + Number(qtyOfPrevLine)
        objectProduct.qty = currentQty
        objectProduct.save()

      const total = priceOfPrevLine * qtyOfPrevLine;
      const { clientId } = newSale.client
      if(clientId) {
        const clientData = await ClientModel.findOne({_id: clientId});
        const prevDette  = clientData.dette
        const amountOfNewLineSale = Number(price) * Number(qtyNeededOld)
        const newDette   = Number(prevDette) - Number(total) + Number(amountOfNewLineSale)
        clientData.dette = Number(newDette)
        await clientData.save()
      }
      newSale.LineSale[findIndexSale] = { productId, price, qty: qtyNeeded } 
    }

    const PurchasesItem = await PurchaseModel.find()
    // Start Update product Quantity
    const prevQtyProduct = objectProduct.qty
    const newQtyProduct = Number(prevQtyProduct) - Number(qtyNeeded);

    await ProductModel.updateOne({ _id: objectProduct._id}, {$set : {qty : newQtyProduct }});
    // End Update product Quantity

    for(const purchaseItem of PurchasesItem) {
      let filteredPurchaseItem = []

      filteredPurchaseItem = purchaseItem.LinePurchase.
        filter(purchase => purchase.productId.equals(objectProduct._id) && purchase.qty > 0);

        let purchaseIndex = 0;
  
        while (qtyNeeded > 0 && purchaseIndex < filteredPurchaseItem.length) {
          let item = filteredPurchaseItem[purchaseIndex];
          
          const qtyToSubtract = Math.min(qtyNeeded, item.qty);

          let [filteredLineSale] = newSale.LineSale.filter(ln => ln.productId.equals(objectProduct._id))

          await filteredLineSale.LineDetails.push({
            PurchaseId: purchaseItem._id,
            LinePurchaseId: item._id,
            qty: qtyToSubtract,
            buy_price: item.buy_price
          });

          item.qty -= qtyToSubtract;
          item.updatedAt = Date.now();

          qtyNeeded -= qtyToSubtract;
          if (item.qty <= 0) {
            purchaseIndex++;
          }
          
          await PurchaseModel.updateOne(
            { "LinePurchase._id": item._id },
            { $set: { "LinePurchase.$.qty": item.qty, "LinePurchase.$.updatedAt": item.updatedAt } },
            { new: true }
          );
  
        }
    }


    await newSale.save();

    // res.status(200).json({success: newSale})

    await getSales(req, res)

  }catch (err) {
    res.status(500).json({err: err.message});
  }
}

const editSale = async (req, res) => {
  try {
    const { id } = req.params
    const { clientId, amountPayed } = req.body
    const saleInfo   = await SaleModel.findOne({_id: id}) 

    
    const totalFacture = saleInfo.LineSale.reduce((acc, currVal) => acc + (currVal.price * currVal.qty), 0)
    
    const clientIdPrevClient    = saleInfo.client.clientId


      if(clientIdPrevClient) {
        // Start Handle Prev Client
        const prevClientInfo = await ClientModel.findOne({_id: clientIdPrevClient})
        const amountPayedPrevClient = saleInfo.client.amountPayed
        
        const prevDettePrevClient = prevClientInfo.dette
        const newDettePrevClient  = Number(prevDettePrevClient) + Number(amountPayedPrevClient) - Number(totalFacture)
        prevClientInfo.dette = newDettePrevClient
        prevClientInfo.historyPayment = prevClientInfo.historyPayment.filter(hPaym => !hPaym.saleId.equals(id))
        await prevClientInfo.save()
        // END Handle Prev Client
      }
  
      // Start Handle New Client
      if(clientId) {
        const clientInfo = await ClientModel.findOne({_id: clientId});
        const reste = Number(totalFacture) - Number(amountPayed)
        const prevDette = clientInfo.dette
        const newDette  = Number(prevDette) + Number(reste)
        clientInfo.dette = newDette
        clientInfo.historyPayment.push({payment: amountPayed, saleId: id});
        await clientInfo.save();
        saleInfo.client  = { clientId, amountPayed }
      } else {
        saleInfo.client  = { amountPayed }
      }
      // END Handle New Client

    await saleInfo.save()

    await getSales(req, res)

  } catch (err) {
    console.log(err)
    res.status(500).json({err: err.message});
  }
}

const deleteSales = async (req, res) => {
  try {
    const { id } = req.params;
    const sales = await SaleModel.findOne({_id: id})
    
    const clientId = sales.client.clientId
    if(clientId) {
      const clientData = await ClientModel.findOne({_id: clientId})
      const prevDette = clientData.dette
      const totalFacture =  sales.LineSale.reduce((acc, currVal) => acc + (currVal.price * currVal.qty), 0)  
      const amountPayed = sales.client.amountPayed
      const newDette = Number(prevDette) + Number(amountPayed) -  Number(totalFacture)
      clientData.dette = newDette
      clientData.historyPayment = clientData.historyPayment.filter(hPaym => !hPaym.saleId.equals(id))
      await clientData.save()
    }

    for(let sale of sales.LineSale) {
      const product = await ProductModel.findOne({_id : sale.productId})
      const prevQtyProduct = product.qty;
      const prevQtySale = sale.qty
      const newQtyProduct = Number(prevQtyProduct) + Number(prevQtySale);

      await ProductModel.updateOne({_id: product.id}, {$set: {qty: newQtyProduct}}, {new: true});

      sale.LineDetails.map(async LineDetail => {
        const Purchase = await PurchaseModel.findOne({"LinePurchase._id": LineDetail.LinePurchaseId});
        const [arrLine] = Purchase.LinePurchase.filter(line => line._id.equals(LineDetail.LinePurchaseId))
        const prevPurchaseQty = arrLine.qty
        const prevLineQty = LineDetail.qty;
        const newLineQty = Number(prevPurchaseQty) + Number(prevLineQty)

        await PurchaseModel.updateOne({"LinePurchase._id": LineDetail.LinePurchaseId}, {$set: {"LinePurchase.$.qty": newLineQty}}, {new: true});
      })
    }

    const deletedSale = await SaleModel.deleteOne({_id: id});

    // await getSales(req, res);

    res.status(200).json({success: deletedSale})
  } catch(err) {
    console.log(err)
    res.status(500).json({err});
  }
}

const deleteSale = async (req, res) => {
  try {
    const { id, lineSaleId } = req.params;
    const sales = await SaleModel.findOne({_id: id})
    const findIndex  = sales.LineSale.findIndex(line => line._id.equals(lineSaleId))
    const sale = sales.LineSale[findIndex]

    if(sale) {
      const product = await ProductModel.findOne({_id : sale.productId})
      const prevQtyProduct = product.qty;
      const prevQtySale = sale.qty
      const newQtyProduct = Number(prevQtyProduct) + Number(prevQtySale);
      
      await ProductModel.updateOne({_id: product.id}, {$set: {qty: newQtyProduct}}, {new: true});

      sale.LineDetails.map(async LineDetail => {
        const Purchase = await PurchaseModel.findOne({"LinePurchase._id": LineDetail.LinePurchaseId});
        const [arrLine] = Purchase.LinePurchase.filter(line => line._id.equals(LineDetail.LinePurchaseId))
        const prevPurchaseQty = arrLine.qty
        const prevLineQty = LineDetail.qty;
        const newLineQty = Number(prevPurchaseQty) + Number(prevLineQty)

        await PurchaseModel.updateOne({"LinePurchase._id": LineDetail.LinePurchaseId}, {$set: {"LinePurchase.$.qty": newLineQty}}, {new: true});
      })

    }

    const clientId = sales.client.clientId
    if(clientId) {
      const clientData = await ClientModel.findOne({_id: clientId})
      const prevDette = clientData.dette
      const amountDeleted = Number(sale.price) * Number(sale.qty)
      const newDette = Number(prevDette) - Number(amountDeleted)
      clientData.dette = newDette
      await clientData.save()
    }

    const newLineSale = sales.LineSale.filter(line => !line._id.equals(lineSaleId))

    const deletedSale = await SaleModel.updateOne({_id: id}, { $set: {LineSale: newLineSale}}, { new: true });

    res.status(200).json({success: deletedSale})
    
  } catch(err) {
    res.status(500).json({err});
  }
}

module.exports = { getSales, createSale, appendSale, editSale, deleteSales, deleteSale };
