const SupplierModel = require("../models/SupplierModel");

const getSuppliers = async (req, res) => {
    try {
        const { search } = req.query
        let suppliers
        if(search) {
            suppliers = await SupplierModel.find({ 
                name:  {$regex: new RegExp("^" + search, "i")}
            }).sort({createdAt: -1});
        } else {
            suppliers = await SupplierModel.find().sort({createdAt: -1});
        }
        res.status(200).json({success: suppliers})
    } catch(err) {
        res.status(500).json({err});
    }
}

const insertSupplier = async (req, res) => {
    try {
        const {name,balance, historyPayment } = req.body;

        const supplier_data = await SupplierModel.find({ name });
        const formErrors = []

        if(supplier_data.length > 0) {
            formErrors.push("Le fournisseur existe deja");
        }
        if(name.length === 0){
            formErrors.push("Le nom du fournisseur est obligatoire.");
        }
        if(formErrors.length === 0) {
            const insertedData = await SupplierModel.create({ name, balance });
            if(historyPayment[0].payment > 0) {
                insertedData.historyPayment = historyPayment;
                insertedData.save()
            }
            res.status(200).json({success: insertedData});
        } else {
            res.status(300).json({formErrors});
        }
    } catch(err) {
        res.status(500).json({err})
    }
}

const updateSupplier = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;
        
        const supplier_data = await SupplierModel.find({ _id: id });
        const checkExist = await SupplierModel.find({ _id: {$ne: id},  name: name });
        const formErrors = []
        
        if(checkExist.length > 0) {
            formErrors.push("Le fournisseur existe deja");
        }
        if(name.length === 0){
            name = supplier_data.name
        }

        if(formErrors.length === 0) {
            const updatedData = await SupplierModel.updateOne({ _id: id }, { $set: {name} }, { new: true });
            res.status(200).json({success: updatedData});
        } else {
            res.status(300).json({formErrors});
        }
    } catch(err) {
        res.status(500).json({err: err.message})
    }
}

const deleteSupplier = async (req, res) => {
    try {
        const id = req.params.id;
        const formErrors = []
        // Start check if he has buys
         
        // End check if he has buys 
        if(formErrors.length === 0) {
            const deletedData = await SupplierModel.deleteOne({ _id: id });
            res.status(200).json({success: deletedData});
        } else {
            res.status(300).json({formErrors});
        }
    } catch(err) {
        res.status(500).json({err})
    }
}

const insertSupplierPayment = async (req, res) => {
    try {
        const { id } = req.params
        const { payment, date } = req.body
        const supplierData = await SupplierModel.findById(id);
    
        const formErrors = []

        if(payment.length === 0) {
            formErrors.push("Donner le montant")
        }

        if(isNaN(payment)  && payment.length > 0) {
            formErrors.push("Le montant doit etre numeric")
        }
        
        if(formErrors.length === 0) {
            if(payment > 0) {
                const prevBalance  = supplierData.balance;
                const newBalance   = parseFloat(prevBalance) + parseFloat(payment)
                supplierData.historyPayment.push({payment});

                await SupplierModel.updateOne({ _id: id}, {$set: { balance: newBalance, createdAt: date, updatedAt: date }})
                supplierData.save();        
            }
            res.status(200).json({success: supplierData.historyPayment})
        } else {
            res.status(300).json({formErrors})
        }

    } catch(err){
        console.log(err.message)
        res.status(500).json({err})
    }    
}

const updateSupplierPayment = async (req, res) => {
    try {
        const { id, paymentId } = req.params
        const { payment } = req.body
        const supplierData = await SupplierModel.findById(id);
    
        const formErrors = []

        if(isNaN(payment)) {
            formErrors.push("Le montant doit etre numeric")
        }

        if(formErrors.length === 0) {
            const findIndex = supplierData.historyPayment.findIndex(payment => payment._id.equals(paymentId))
            const prevBalance  = supplierData.balance;
            const prevPayment  = supplierData.historyPayment[findIndex].payment
            const newBalance   = parseFloat(prevBalance) - parseFloat(prevPayment) + parseFloat(payment)

            supplierData.historyPayment[findIndex] = {
                _id: supplierData.historyPayment[findIndex]._id,
                purchaseId: supplierData.historyPayment[findIndex].purchaseId,
                payment,
                createdAt: supplierData.historyPayment[findIndex].createdAt,
                updateAt: new Date(),
            }

            await SupplierModel.updateOne({ _id: id}, {$set: { balance: newBalance }})
            supplierData.save();
            res.status(200).json({success: supplierData})
        } else {
            res.status(300).json({formErrors})
        }

    } catch(err){
        res.status(500).json({err})
    }    
}

const deleteSupplierPayment = async (req, res) => {
    try {
        const { id,  paymentId } = req.params;
        const supplier  = await SupplierModel.findById(id);
        const prevBalance  = supplier.balance
        const checkPayment = supplier.historyPayment.find(p => p._id.equals(paymentId))
        
        if(checkPayment) {
            const prevPayment  = checkPayment.payment;
            const newBalance   = prevBalance - prevPayment;

            await SupplierModel.updateOne({_id: id}, {$set: {balance: newBalance}}, { new: true });

            supplier.historyPayment = supplier.historyPayment.filter(p => !p._id.equals(paymentId))
            
            supplier.save();
            res.status(200).json({success: supplier})
        }else {
            const formErrors = []
            formErrors.push("Le paiement n'existe pas")
            res.status(500).json({formErrors})
        }

    } catch(err) {
        res.status(500).json({err})
    }
}

module.exports = { 
    getSuppliers, 
    insertSupplier,
    updateSupplier,
    deleteSupplier,
    
    insertSupplierPayment,
    updateSupplierPayment,
    deleteSupplierPayment 
}
