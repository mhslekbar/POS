const router = require("express").Router();
const { getConsumptions, addConsumption, editConsumption, deleteConsumption } = require("../controllers/ConsumptionController");
const { authorizedPermission } = require("../middlewares/authorizedPermission");


router.get("/", authorizedPermission("SHOW_CONSUMPTIONS"), getConsumptions)
router.post("/", authorizedPermission("ADD_CONSUMPTION"), addConsumption)
router.put("/:id", authorizedPermission("EDIT_CONSUMPTION"), editConsumption)
router.delete("/:id", authorizedPermission("DELETE_CONSUMPTION"), deleteConsumption)

module.exports = router