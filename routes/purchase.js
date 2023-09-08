const router = require("express").Router();
const {
  getPurchases,
  insertPurchase,
  updatePurchase,
  supplyPurchase,
  deletePurchases,
  deleteLinePurchase,
} = require("../controllers/PurchaseController");
const { authorizedPermission } = require("../middlewares/authorizedPermission");


router.get("/", authorizedPermission("SHOW_PURCHASES"), getPurchases);
router.post("/", authorizedPermission("ADD_PURCHASE"), insertPurchase);
router.put("/:id", authorizedPermission("EDIT_PURCHASE"), updatePurchase);
router.put(
  "/:id/supply",
  authorizedPermission("SUPPLY_PURCHASE"),
  supplyPurchase
);
router.delete(
  "/:purchaseId/LinePurchase/:idLinePurchase",
  authorizedPermission("DELETE_LINE_PURCHASE"),
  deleteLinePurchase
);
router.delete("/:id", authorizedPermission("DELETE_PURCHASE"), deletePurchases);

module.exports = router;
