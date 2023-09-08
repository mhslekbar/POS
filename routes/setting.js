const router = require("express").Router()
const { getSetting, addSetting } = require("../controllers/SettingController");

router.get("/", getSetting)
router.post("/", addSetting)

module.exports = router