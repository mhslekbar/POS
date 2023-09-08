const router = require("express").Router();
const { getCategories, addCategory, updateCategory, deleteCategory } = require("../controllers/CategoryController")
const { authorizedPermission } = require("../middlewares/authorizedPermission");

router.get("/", authorizedPermission("SHOW_CATEGORIES"), getCategories);
router.get("/menuCats", authorizedPermission("SHOW_MENU_CATS"), getCategories);
router.post("/", authorizedPermission("ADD_CATEGORY"), addCategory);
router.put("/:catId", authorizedPermission("EDIT_CATEGORY"), updateCategory);
router.delete("/:catId", authorizedPermission("DELETE_CATEGORY"), deleteCategory);

module.exports = router