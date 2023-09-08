const ProductModel = require("../models/ProductModel")
const PurchaseModel = require("../models/PurchaseModel");

const getProducts = async (req, res) => {
    try {
        const { title, limit, catId, expirDate } = req.query  // title, limit comes from when i add purchase
        let products
        let queryFound = false
        if(title && limit && !queryFound) {
            products = await ProductModel.find({$or: [
                { title: {$regex: "^" + title, $options: "i"} },
                { barcode: title }
            ]}).sort({createdAt: -1}).limit(limit);
            // products = await ProductModel.find({title: {$regex: "^" + title, $options: "i"}}).sort({createdAt: -1}).limit(limit);
            queryFound = true
        } 
        if(title && !queryFound) {
            let checkCatId = catId ? 
            {$and: [
                {$or: [
                    { title: {$regex: "^" + title, $options: "i"} },
                    { barcode: title }
                ]},
                { catId },
            ]}
            : { $or: [{title: {$regex: "^" + title, $options: "i"}}, { barcode: title }] }

            products = await ProductModel.find(checkCatId).sort({createdAt: -1})
            queryFound = true
        } 
        if(catId && !queryFound) {
            products = await ProductModel.find({ catId }).populate("catId").sort({createdAt: -1});
            queryFound = true
        } 
        if(expirDate) {
            let daysUntilExpiration = 7; // number of days until expiration
            switch(expirDate) {
                case "1 week": daysUntilExpiration = 7; break;
                case "1 month": daysUntilExpiration = 30; break;
                case "3 month": daysUntilExpiration = 90; break;
                case "6 month": daysUntilExpiration = 180; break;
                case "1 year": daysUntilExpiration = 365; break;
            }
            const givenDate = new Date(); // get the current date
            givenDate.setDate(givenDate.getDate() + daysUntilExpiration); // add the number of days to the current date
            products = await PurchaseModel.find()
            .populate("LinePurchase.productId")
            .populate({ 
                path: 'LinePurchase.productId',
                populate: { path: 'catId' } 
            })
            .sort({createdAt: -1});
            products = products.map((purchase) => 
                purchase.LinePurchase.map((ln) => ({
                    product: ln.productId,
                    qty: ln.qty,
                    expiration_date: ln.expiration_date
                }))
            )
            let ArrProduct = []
            products.map(purchase => 
                purchase.map(p => ArrProduct.push(p))
            )
            products = ArrProduct.filter(p => p.expiration_date < givenDate && p.qty > 0)
            queryFound = true
        }
        if(!queryFound) { 
            products = await ProductModel.find().populate("catId").sort({createdAt: -1});
        }

        res.status(200).json({success: products});
    } catch(err) {
        console.log(err.message)
        res.status(500).json({err: err.message});
    }
}

const searchProduct = async (req, res) => {
    try {
        const { search } = req.params;
        if(search.length > 0) {
            const products = await ProductModel.find({title: {$regex: new RegExp(search, 'i')}}).sort({createdAt: -1});
            res.status(200).json({success: products});
        }
    } catch(err) {
        res.status(500).json({err: err.message});
    }
}

const insertProduct = async (req, res) => {
    try {
        const { title, desc, catId, barcode } = req.body
        const formErrors = [];
        const checkProduct = await ProductModel.findOne({title});
        // const checkProduct = await ProductModel.find({$or: [{title}, {barcode}]});
        if(checkProduct?.barcode.length > 0 && checkProduct?.barcode !== barcode) {
            formErrors.push("Le nom du produit existe deja ");
        }
        if(title.length === 0) {
            formErrors.push("Le nom du produit est obligatoire");
        }
        if(desc.length === 0) {
            formErrors.push("La description du produit est obligatoire");
        }
        if(catId.length === 0) {
            formErrors.push("La categorie du produit est obligatoire");
        }
        if(formErrors.length === 0) {
            await ProductModel.create({title, desc, catId, barcode});
            await getProducts(req, res)
        } else {
            res.status(300).json({formErrors});
        }
    } catch(err) {
        res.status(500).json({err: err.message});
    }
}

const updateProduct = async (req, res) => {
    try {
        const {id} = req.params;
        let { title, desc, catId, barcode } = req.body
        const checkExistInTitle = await ProductModel.find({ _id: {$ne: id}, title })
        const checkExistInBarcode = await ProductModel.findOne({ _id: {$ne: id}, barcode })
        
        const productData = await ProductModel.findById(id)
        const formErrors = [];

        if(checkExistInTitle.length > 0) {
            formErrors.push("Le title existe deja")
        }
        if(checkExistInBarcode && checkExistInBarcode.barcode.length > 0) {
            formErrors.push("Le barcode existe deja")
        }
        if(title.length === 0) {
            title = productData.title
        }
        if(desc.length === 0) {
            desc = productData.desc
        }
        if(catId.length === 0) {
            catId = productData.catId.catId
        }
        if(formErrors.length === 0) {
            await ProductModel.updateOne({_id: id}, {$set: {title, desc, catId, barcode}}, {new: true});
            await getProducts(req, res)
        } else {
            res.status(300).json({formErrors});
        }
    } catch(err) {
        console.log("err: ", err)
        res.status(500).json({err: err.message});
    }
}

const deleteProduct = async (req, res) => {
    try {
        const {id} = req.params;
        const productData = await ProductModel.findById(id)
        const checkPurchase = await PurchaseModel.findOne({ "LinePurchase.productId": id })         
        const formErrors = [];
        if(checkPurchase) {
            formErrors.push("Vous ne pouvez pas supprimer le produit car il existe dans un bon d'achat");
        } else if(productData.qty > 0) {
            formErrors.push("Le produit existe dans le stock vous ne pouvez pas le supprimer");
        }
        if(formErrors.length === 0) {
            await ProductModel.findByIdAndDelete(id);
            await getProducts(req, res)
        } else {
            res.status(300).json({formErrors});
        }
    } catch(err) {
        res.status(500).json({err: err.message});
    }
}

module.exports = { getProducts, searchProduct, insertProduct, updateProduct, deleteProduct }
