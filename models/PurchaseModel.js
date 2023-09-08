const mongoose = require("mongoose");

const PurchaseSchema = new mongoose.Schema({
    numPurchase: { type: String, required: true },
    supplier: {
        supplierId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "supplier",
            required: true,
        },
        amountPayed: {
            type: "Number",
            required: true
        }
    },
    LinePurchase: [{
        productId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "product",
            required: true
        },
        buy_price: { type: Number, required: true },
        sell_price: { type: Number, required: true },
        mainQty: { type: Number, required: true },
        qty: { type: Number, required: true },
        total_price: { type: Number, required: true },
        expiration_date: { type: Date },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now } 
    }] 
}, { timestamps: true});

module.exports = mongoose.model("purchase", PurchaseSchema);
