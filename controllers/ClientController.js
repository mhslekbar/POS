const ClientModel = require("../models/ClientModel");
const SaleModel   = require("../models/SaleModel");

const getClients = async (req, res) => {
    try {
        const { search } = req.query
        let clients
        if(search) {
            clients = await ClientModel.find({
                $or:[
                    {name:  {$regex: new RegExp("^" + search, "i")}},
                    {phone: {$regex: new RegExp("^" + search, "i")}},
                ]
            }).sort({createdAt: -1}).limit(4);
        } else {
            clients = await ClientModel.find().sort({createdAt: -1});
        }
        res.status(200).json({success: clients})
    } catch(err) {
        res.status(500).json({err: err.message});
    }
}

const insertClient = async (req, res) => {
    try {
        let formErrors = [];
        let { name, phone } = req.body
        const dataOfClient = await ClientModel.findOne({ name, phone });
    
        if(dataOfClient) {
            formErrors.push("Le client existe deja");
        }
        if(name.length === 0) {
            formErrors.push("Le nom du client est obligatoire");
        }
        if(phone.length === 0) {
            formErrors.push("Le telephone du client est obligatoire");
        }

        if(formErrors.length === 0) {
            const client = new ClientModel(req.body)
            const insertedClient = await client.save();
            res.status(200).json({success : insertedClient})
        } else {
            res.status(300).json({formErrors});
        }

    }catch(err) {
        res.status(500).json({err: err.message});
    }
}

const updateClient = async (req, res) => {
    try {
        let formErrors = [];
        const { id } = req.params
        let { name, phone } = req.body
        
        const checkClient = await ClientModel.findOne({_id: {$ne: id},  name, phone });
        const dataOfClient = await ClientModel.findOne({ _id: id });

        if(checkClient) {
            formErrors.push("Le client existe deja");
        }
        if(name.length === 0) {
            name = dataOfClient.name
        }
        if(phone.length === 0) {
            phone = dataOfClient.phone
        }
        
        if(formErrors.length === 0) {
            const updatedClient = await ClientModel.updateOne({ _id: id}, {$set : req.body }, { new: true });
            res.status(200).json({success: updatedClient})
        } else {
            res.status(300).json({formErrors});
        }

    }catch(err) {
        res.status(500).json({err: err.message});
    }
}

const deleteClient = async (req, res) => {
    try {
        let formErrors = [];
        const { id } = req.params
        // START check if client has a sell 
        const sale = await SaleModel.findOne({"client.clientId": id});
        if(sale) {
            formErrors.push("le client ne peut pas etre supprimer il a deja des transactions..")
        }
        // END check if client has a sell 
        if(formErrors.length === 0) {
            const deletedClient = await ClientModel.deleteOne({ _id: id});
            res.status(200).json({success: deletedClient})
        } else {
            res.status(300).json({formErrors});
        }

    }catch(err) {
        res.status(500).json({err: err.message});
    }
}

const insertClientPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { payment, date } = req.body;

        const dataOfClient = await ClientModel.findOne({ _id: id });

        const prevDette = dataOfClient.dette
        const newDette  = parseFloat(prevDette || 0) - parseFloat(payment)

        const formErrors = []

        if(payment.length === 0) {
            formErrors.push("Le paiement est obligatoire")
        }
        if(isNaN(payment)) {
            formErrors.push("Le paiement doit etre numerique")
        }

        if(formErrors.length === 0) {
            await dataOfClient.historyPayment.push({payment, createdAt: date, updatedAt: date})
            await ClientModel.updateOne({ _id: id }, { $set: { dette: newDette } }, { new: true });
            dataOfClient.save()
            res.status(200).json({success: dataOfClient});
        } else {
            res.status(300).json({formErrors});
        }

    }catch(err) {
        res.status(500).json({err: err.message});
    }
}


const updateClientPayment = async (req, res) => {
    try {
        const { id, paymentId } = req.params;
        const { payment } = req.body;
        
        const dataOfClient = await ClientModel.findOne({ _id: id });

        const formErrors = []

        if(payment.length === 0) {
            payment = dataOfClient.dette
        }
        if(isNaN(payment)) {
            formErrors.push("Le paiement doit etre numerique")
        }

        if(formErrors.length === 0) {
            const findIndex = await dataOfClient.historyPayment.findIndex(hPaym => hPaym._id.equals(paymentId))

            const prevPayment = dataOfClient.historyPayment[findIndex].payment

            const saleId = dataOfClient.historyPayment[findIndex]?.saleId
            let newDette
            if(saleId) {
                const saleData = await SaleModel.findOne({_id: saleId})
                saleData.client.amountPayed = payment
                await saleData.save()
                const TotalFacture = saleData.LineSale.reduce((acc, currVal) => acc + (currVal.qty * currVal.price), 0)
                let prevDette = dataOfClient.dette
                prevDette = Number(prevDette) - Number(TotalFacture) + Number(prevPayment)  
                newDette  = parseFloat(prevDette) + Number(TotalFacture) -  Number(payment)
            } else {
                const prevDette = dataOfClient.dette
                newDette  = parseFloat(prevDette) +  parseFloat(prevPayment) - parseFloat(payment)
            }
            
            dataOfClient.historyPayment[findIndex] = {
                _id: dataOfClient.historyPayment[findIndex]._id,
                saleId: dataOfClient.historyPayment[findIndex].saleId,
                createdAt: dataOfClient.historyPayment[findIndex].createdAt,
                payment,
                updatedAt: new Date()
            }
            
            dataOfClient.dette = newDette
            await dataOfClient.save()
            await getClients(req, res)
        } else {
            res.status(300).json({formErrors});
        }

    }catch(err) {
        res.status(500).json({err: err.message});
    }
} 

const deletedClientPayment = async (req, res) => {
    try {
        const { id, paymentId } = req.params;
        const ClientData = await ClientModel.findById(id);

        const prevDette = ClientData.dette

        const findIndex = ClientData.historyPayment.findIndex(data => data._id.equals(paymentId))
        const prevPayment = ClientData.historyPayment[findIndex].payment

        const newDette = parseFloat(prevDette) + parseFloat(prevPayment);
    
        ClientData.dette = newDette
    
        // START delete amount payed 

        const findDette = ClientData.historyPayment.findIndex(data => data._id.equals(paymentId));
        const saleId = ClientData.historyPayment[findDette]?.saleId
        
        if(saleId) {
            const saleData = await SaleModel.findOne({_id: saleId})
            saleData.client.amountPayed = 0
            await saleData.save()
        }

        // END delete amount payed 

        ClientData.historyPayment = ClientData.historyPayment.filter(data => !data._id.equals(paymentId));
        ClientData.save();

        res.json({success: ClientData})
    }catch(err) {
        res.status(500).json({success: err.message});
    }
}

module.exports = { 
    getClients,
    insertClient, 
    updateClient, 
    deleteClient, 

    insertClientPayment,
    updateClientPayment,
    deletedClientPayment 
}
