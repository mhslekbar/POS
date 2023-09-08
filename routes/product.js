const router = require("express").Router();
const { getProducts, searchProduct, insertProduct, updateProduct, deleteProduct } = require("../controllers/ProductController");
const { authorizedPermission } = require("../middlewares/authorizedPermission");


router.get("/", authorizedPermission("SHOW_PRODUCTS"), getProducts);
router.get("/menuProduct", authorizedPermission("SHOW_MENU_PRODUCTS"), getProducts)
router.get("/search/:search", authorizedPermission("SHOW_PRODUCTS"), searchProduct);
router.post("/", authorizedPermission("ADD_PRODUCT"), insertProduct);
router.put("/:id", authorizedPermission("EDIT_PRODUCT"), updateProduct);
router.delete("/:id", authorizedPermission("DELETE_PRODUCT"), deleteProduct);

module.exports = router;
