const router = require("express").Router();
const { getPermissions, getPermissionsByTable, insertPermission, updatePermission, deletePermission } = require("../controllers/PermissionController")

router.get("/", getPermissions);
router.get("/ByTable", getPermissionsByTable);
router.post("/", insertPermission);
router.put("/:roleId", updatePermission);
router.delete("/:roleId", deletePermission);

module.exports = router;
