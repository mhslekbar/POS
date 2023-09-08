const os = require("node:os")

const networkInterfaces = os.networkInterfaces();
const macAddress = networkInterfaces.en1.find((iface) => iface.mac !== '00:00:00:00:00:00').mac;

console.log(macAddress);

// const appendSale = async (req, res) => {
//   try {
//     const { id } = req.params
//     const { LineSale } = req.body

//     let objectProduct = []
//     let arrayExistingProduct = []

//     let formErrors = []

//     for(const [index, dataOfBody] of LineSale.entries()) {
      
//       const { productId, price, qty } = dataOfBody;

//       if(productId.length === 0) {
//         formErrors.push(`le produit ${index + 1} est obligatoire`)
//       } else {
//         objectProduct = await ProductModel
//           .findOne({ 
//             _id: productId, 
//             qty: { $gte: isNaN(qty) ? 0 : qty} 
//           })
//           // console.log(objectProduct)
//         if(!objectProduct) {
//           formErrors.push(`le quantite du produit ${index + 1} n'est pas valable`)
//         } else {
//           arrayExistingProduct.push({objectProduct, qty})
//         }
//       }

//       if (price === "" || price === 0) {
//         formErrors.push(`Le prix du produit ${index + 1} est obligatoire`);
//       }
//       if (isNaN(price)) {
//         formErrors.push(`Le prix du produit ${index + 1} doit etre numerique`);
//       }

//       if (isNaN(qty)) {
//         formErrors.push(`La quantité du produit ${index + 1} doit etre numerique`);
//       }

//       if (qty === "" || qty === 0) {
//         formErrors.push(`La quantité du produit ${index + 1} est obligatoire`);
//       }

//     }

//     if (formErrors.length > 0) {
//       return res.status(400).json({
//         message: "Validation error",
//         errors: formErrors
//       });
//     }

//     // Create new sale here
//     let newSale = await SaleModel.findOne({ _id: id });
//     const prevLineSale = newSale.LineSale
//     let newLineSale  = prevLineSale

//     for(let line of LineSale) {
//       newLineSale.push(line)
//     }

//     const PurchasesItem = await PurchaseModel.find()
    
//     for(productItem of arrayExistingProduct) {
//       // Start Update product Quantity
//       const prevQtyProduct = productItem.objectProduct.qty
//       let qtyNeeded = productItem.qty
//       const newQtyProduct = Number(prevQtyProduct) - Number(qtyNeeded);
//       await ProductModel.updateOne({ _id: productItem.objectProduct._id}, {$set : {qty : newQtyProduct }});
//       // End Update product Quantity

//       for(const purchaseItem of PurchasesItem) {
//         let filteredPurchaseItem = []

//         filteredPurchaseItem = purchaseItem.LinePurchase.
//           filter(purchase => 
//           purchase.productId.equals(productItem.objectProduct._id) 
//           && purchase.qty > 0);

//           let purchaseIndex = 0;
    
//           while (qtyNeeded > 0 && purchaseIndex < filteredPurchaseItem.length) {
//             let item = filteredPurchaseItem[purchaseIndex];
            
//             const qtyToSubtract = Math.min(qtyNeeded, item.qty);

//             let [filteredLineSale] = newSale.LineSale.filter(ln => ln.productId.equals(productItem.objectProduct._id))

//             await filteredLineSale.LineDetails.push({
//               PurchaseId: purchaseItem._id,
//               LinePurchaseId: item._id,
//               qty: qtyToSubtract
//             });
    
//             item.qty -= qtyToSubtract;
//             item.updatedAt = Date.now();
    
//             qtyNeeded -= qtyToSubtract;
//             if (item.qty <= 0) {
//               purchaseIndex++;
//             }
            
//             await PurchaseModel.updateOne(
//               { "LinePurchase._id": item._id },
//               { $set: { "LinePurchase.$.qty": item.qty, "LinePurchase.$.updatedAt": item.updatedAt } },
//               { new: true }
//             );
    
//           }
//       }
//     }

//     await newSale.save();

//     res.status(200).json({success: newSale})
//   }catch (err) {
//     res.status(500).json({"error": err.message});
//   }
// }
