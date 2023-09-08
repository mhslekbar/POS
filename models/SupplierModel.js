const mongoose = require("mongoose");

const SupplierSchema  = new mongoose.Schema({
    name: { type: String, required: true},
    balance: { type: Number, default: 0 },
    historyPayment: [{
        payment: { type: Number },
        purchaseId: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "purchase"
        },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    }]
}, { timestamps: true })

module.exports = mongoose.model("supplier", SupplierSchema);
