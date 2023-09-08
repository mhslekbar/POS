const router = require("express").Router();
const { getSales, createSale, appendSale, editSale, deleteSales, deleteSale } = require("../controllers/SaleController");
const { authorizedPermission } = require("../middlewares/authorizedPermission");


router.get("/", authorizedPermission("SHOW_SALES"), getSales)
router.post("/", authorizedPermission("ADD_SALE"), createSale)
router.put("/:id", authorizedPermission("EDIT_SALE"), editSale);
router.put("/:id/append", authorizedPermission("APPEND_SALE"), appendSale)
router.delete("/:id/LineSale/:lineSaleId", authorizedPermission("DELETE_LINE_SALE"), deleteSale)
router.delete("/:id", authorizedPermission("DELETE_SALE"), deleteSales)

module.exports = router;
