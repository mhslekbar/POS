const router = require("express").Router()
const { getGroups, insertGroup, updateGroup, deleteGroup } = require("../controllers/GroupController")
const { authorizedPermission } = require("../middlewares/authorizedPermission");


router.get('/', authorizedPermission("SHOW_ROLES"), getGroups);
router.post('/',authorizedPermission("ADD_ROLE"), insertGroup);
router.put('/:id', authorizedPermission("EDIT_ROLE"),updateGroup);
router.delete('/:id',authorizedPermission("DELETE_ROLE"), deleteGroup);

module.exports = router;