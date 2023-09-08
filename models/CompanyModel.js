const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
  name: {type: String},
  logo: {type: String},
  macAddress: {type: String}
}, { timestamps: true });

module.exports = mongoose.model("company", CompanySchema);