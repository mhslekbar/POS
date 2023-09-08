const mongoose = require("mongoose");

const RefreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("refreshToken", RefreshTokenSchema)
