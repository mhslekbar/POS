const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String
    },
    catId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: true
    },
    qty: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0
    },
    barcode: {
        type: String,
        default: ""
    }
}, { timestamps: true });

module.exports = mongoose.model("product", productSchema);
