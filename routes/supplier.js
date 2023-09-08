const router = require("express").Router();
const { 
        getSuppliers, 
        insertSupplier,
        updateSupplier,
        deleteSupplier,

        insertSupplierPayment,
        updateSupplierPayment,
        deleteSupplierPayment 
    } = require("../controllers/SupplierController")

    const { authorizedPermission } = require("../middlewares/authorizedPermission");


router.get("/", authorizedPermission("SHOW_SUPPLIERS"), getSuppliers)
router.post("/", authorizedPermission("ADD_SUPPLIER"), insertSupplier)
router.put("/:id", authorizedPermission("EDIT_SUPPLIER"), updateSupplier)
router.delete("/:id", authorizedPermission("DELETE_SUPPLIER"), deleteSupplier)

router.post("/:id/payment/", authorizedPermission("ADD_SUPPLIER_AMOUNT"), insertSupplierPayment)
router.put("/:id/payment/:paymentId", authorizedPermission("EDIT_SUPPLIER_AMOUNT"), updateSupplierPayment)
router.delete("/:id/payment/:paymentId", authorizedPermission("DELETE_SUPPLIER_AMOUNT"), deleteSupplierPayment)

module.exports = router;
