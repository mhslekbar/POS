const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    dette: { type: Number, default: 0 },
    historyPayment: [{ 
        payment: { type: Number },
        saleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "sale"
        },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    }]
}, { timestamps: true })

module.exports = mongoose.model("client", clientSchema);
