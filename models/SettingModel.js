const mongoose = require("mongoose");

const SettingSchema = new mongoose.Schema({
  company: [{
      macAllowed: { type: String },
      companyId: { type: mongoose.Types.ObjectId },
    },
  ],
},{ timestamps: true });

module.exports = mongoose.model("setting", SettingSchema);
