const CompanyModel = require("../models/CompanyModel");
const SettingModel = require("../models/SettingModel");

const getCompany = async (req, res) => {
  try {
    const company = await CompanyModel.findOne();
    res.status(200).json({success: company})
  } catch(err) {
    res.status(500).json({err: err.message})
  }
}

const addCompany = async (req, res) => {
  try {
    const { name, logo, macAddress } =req.body
    const company = await CompanyModel.findOne({name});
    const formErrors = []
    if(company) {
      formErrors.push("le nom existe deja..")
    }
    if(formErrors.length === 0) {
      const newCompany = await CompanyModel.create({ name, logo, macAddress })
      const setting = await SettingModel.findOne()
      setting.company.push({macAllowed: macAddress, companyId: newCompany._id})
      await setting.save()
      await getCompany(req, res)
    }
  } catch(err) {
    res.status(500).json({err: err.message})
  }
}

module.exports = { getCompany, addCompany }