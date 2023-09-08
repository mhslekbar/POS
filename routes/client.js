const router = require("express").Router();
const { 
    getClients,
    insertClient, 
    updateClient, 
    deleteClient, 
    
    insertClientPayment,
    updateClientPayment,
    deletedClientPayment 
} = require("../controllers/ClientController");
const { authorizedPermission } = require("../middlewares/authorizedPermission");


router.get("/", authorizedPermission("SHOW_CLIENTS"), getClients)
router.post("/", authorizedPermission("ADD_CLIENT"), insertClient)
router.put("/:id", authorizedPermission("EDIT_CLIENT"), updateClient)
router.delete("/:id", authorizedPermission("DELETE_CLIENT"), deleteClient)

router.post("/:id/payment", authorizedPermission("ADD_CLIENT_PAYMENT"), insertClientPayment)
router.put("/:id/payment/:paymentId", authorizedPermission("EDIT_CLIENT_PAYMENT"), updateClientPayment)
router.delete("/:id/payment/:paymentId", authorizedPermission("DELETE_CLIENT_PAYMENT"), deletedClientPayment)

module.exports = router

