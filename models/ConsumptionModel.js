const mongoose = require("mongoose")

const ConsumptionSchema = new mongoose.Schema({
  note: { type: String },
  amount: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model("consumption", ConsumptionSchema)
