const SettingModel = require("../models/SettingModel")

const getSetting = async (req, res) => {
  try {
    const setting = await SettingModel.findOne().populate("company.companyId");
    res.status(200).json({success: setting})
  } catch(err) {
    res.status(500).json({err: err.message})
  }
}

const addSetting = async (req, res) => {
  try {
    // const { companyName, macAddress } =req.body
    // const setting = await SettingModel.findOne({companyName});
    // const formErrors = []
    // if(setting) {
    //   formErrors.push("le nom existe deja..")
    // }
    // if(formErrors.length === 0) {
      // await SettingModel.create({companyName, macAddress})
      await SettingModel.create(req.body)      
      await getSetting(req, res)
    // }
  } catch(err) {
    res.status(500).json({err: err.message})
  }
}

module.exports = { getSetting, addSetting }