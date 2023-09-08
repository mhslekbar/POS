const router = require("express").Router()
const { getCompany, addCompany } = require("../controllers/CompanyController");

router.get("/", getCompany)
router.post("/", addCompany)

module.exports = router