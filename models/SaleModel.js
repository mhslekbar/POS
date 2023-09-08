const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    client: {
        clientId: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "client",
            default: null,
            required: false 
        },
        amountPayed: {
            type: Number,
            required: true
        }
    },
    numSale: { type: String, required: true },
    LineSale: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
        price: { type: Number, required: true },
        qty: { type: Number, required: true },
        LineDetails: [{
            PurchaseId: { type: mongoose.Schema.Types.ObjectId, ref: "purchase" },
            LinePurchaseId: { type: mongoose.Schema.Types.ObjectId, ref: "purchase.LinePurchase" },
            qty: { type: Number, required: true },
            buy_price: { type: Number, required: true },
            createdAt: { type: Date, default: Date.now },
            updatedAt: { type: Date, default: Date.now },            
        }],
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    }]
}, { timestamps: true });

module.exports = mongoose.model("sale", saleSchema)