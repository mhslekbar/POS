const router = require("express").Router();
const { getUsers , insertUser, updateUser, deleteUser } = require("../controllers/UserController");
const { authorizedPermission } = require("../middlewares/authorizedPermission");



router.get("/" , authorizedPermission("SHOW_USERS"), getUsers);
router.post("/" , authorizedPermission("ADD_USER"), insertUser);
router.put("/:id" , authorizedPermission("EDIT_USER"), updateUser);
router.delete("/:id" , authorizedPermission("DELETE_USER"), deleteUser);

module.exports = router;
