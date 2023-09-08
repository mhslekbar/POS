/***
      if(month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) {
        finMois = 31
      } else if(month === 4 || month === 6 || month === 9 || month === 11) {
        finMois = 30
      } else if(month === 2) {
        finMois = 28
      }
      month = (new Date()).getMonth() + 1

      year = (new Date()).getFullYear()

 * 
 */

const HandleAddPayment = async (e) => {
  e.preventDefault();
  const payment = document.querySelector("#amountPaym").value;
  const date = document.querySelector("#datePaym").value;
  try {
    const res = await privateRequest.post(
      `/supplier/${supplier._id}/payment`,
      { payment, date }
    );
    const dataPayment = res.data.success
    if (dataPayment) {
      setSuccess("Ajouter avec succes");
      setErrors([]);
      document.querySelector("#amountPaym").value = "";
      setTimeout(() => setSuccess(false), Timeout);

      dispatch(getSuppliersPayment(supplier._id))

      const updatedPayments = [
        ...payments,
        dataPayment[dataPayment.length - 1],
      ];
      setPayments(updatedPayments);
    }
  } catch (err) {
    setErrors(err?.response?.data?.formErrors);
  }
};





{/* <div className="flex flex-col border">
<div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
  <div className="inline-block min-w-full sm:px-6 lg:px-8">
    <div className="overflow-hidden">
      <table className="min-w-full text-left text-sm font-light  text-center">
        <thead className="border-b font-medium bg-blue-600 text-white">
          <tr>
            <th className="px-6 py-4">Facture No</th>
            <th className="px-6 py-4">Total</th>
            <th className="px-6 py-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {purchases.slice(0,10).map((purchase, index) => {
            const total = purchase.LinePurchase.reduce(
              (acc, currVal) => acc + currVal.total_price,
              0
            );
            return (
              <tr className="border-b" key={index}>
                <td className="whitespace-nowrap px-4 py-2 border-r font-medium">
                  {purchase._id}
                </td>
                <td className="whitespace-nowrap px-4 py-2 border-r font-medium">
                  {total}
                </td>
                <td className="flex items-center justify-center gap-1">
                  <FaEdit
                    className="text-green"
                    style={{ fontSize: "22px" }}
                  />
                  <CiCircleRemove
                    className="text-red"
                    style={{ fontSize: "22px" }}
                    onClick={() => setDeletePurchase(purchase)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
</div>
</div> */}









      // <div className="mx-9">
      //   {purchases.slice(0, 10).map((purchase, index) => {
      //     return (
      //       <div
      //         className="grid gap-2"
      //         style={{
      //           gridTemplateColumns: "fit-content(100%) 1fr fit-content(100%)",
      //         }}
      //         key={index}
      //       >
      //         <span
      //           className={`block text-gray-700 w-fit h-fit
      //           ${
      //             selectedPurchase?._id === purchase._id
      //               ? "border-r border-r-4 pr-2 border-r-blue-600"
      //               : ""
      //           }`}
      //           onClick={() => handleSelectedPurchase(purchase)}
      //         >
      //           {purchase._id}
      //         </span>
      //         {selectedPurchase?._id === purchase._id && (
      //           <>
      //             <TableLinePurchase
      //               LinePurchase={purchase.LinePurchase}
      //               total={total}
      //             />
      //             <div>
      //               <FaEdit
      //                 className="text-green"
      //                 style={{ fontSize: "22px" }}
      //               />
      //               <CiCircleRemove
      //                 className="text-red"
      //                 style={{ fontSize: "22px" }}
      //                 onClick={() => setDeletePurchase(purchase)}
      //               />
      //             </div>
      //           </>
      //         )}
      //       </div>



















//  <div className="flex flex-col border">
//         <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
//           <div className="inline-block min-w-full sm:px-6 lg:px-8">
//             <div className="overflow-hidden">
//               <table className="min-w-full text-left text-sm font-light">
//                 <thead className="border-b font-medium bg-blue-600 text-white">
//                   <tr>
//                     <th className="px-6 py-4">#</th>
//                     <th className="px-6 py-4">Titre</th>
//                     <th className="px-6 py-4">Desc</th>
//                     <th className="px-6 py-4">Categorie</th>
//                     <th className="px-6 py-4">Prix</th>
//                     <th className="px-6 py-4">Quantity</th>
//                     <th className="px-6 py-4">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {products.map((product, index) => (
//                     <tr className="border-b" key={index}>
//                       <td className="whitespace-nowrap px-4 py-2 border-r font-medium">
//                         {index + 1}
//                       </td>
//                       <td className="whitespace-nowrap px-4 py-2 border-r font-medium">
//                         {product.title}
//                       </td>
//                       <td className="whitespace-nowrap px-4 py-2 border-r font-medium">
//                         {product.desc}
//                       </td>
//                       <td className="whitespace-nowrap px-4 py-2 border-r font-medium">
//                         {product?.catId?.name}
//                       </td>
//                       <td className="whitespace-nowrap px-4 py-2 border-r font-medium">
//                         {product.price}
//                       </td>
//                       <td className="whitespace-nowrap px-4 py-2 border-r font-medium">
//                         {product.qty}
//                       </td>
//                       <td className="flex items-center justify-center">
//                         <FaEdit
//                           className="text-green me-2"
//                           style={{ fontSize: "24px" }}
//                           onClick={() => toggleEditProduct(product._id)}
//                         />
//                         {selectedProduct && selectedProduct === product._id && (
//                           <EditProductModal
//                             modal={showEditModal}
//                             toggle={() => setShowEditModal(!showEditModal)}
//                             productData={product}
//                             setShowSuccessMsg={setShowSuccessMsg}
//                           />
//                         )}
//                         <CiCircleRemove
//                           className="text-red"
//                           style={{ fontSize: "24px" }}
//                           onClick={() => toggleDeleteProduct(product._id)}
//                         />
//                         {selectedProduct && selectedProduct === product._id && (
//                           <DeleteProductModal
//                             modal={showDeleteModal}
//                             toggle={() => setShowDeleteModal(!showDeleteModal)}
//                             productData={product}
//                             setShowSuccessMsg={setShowSuccessMsg}
//                           />
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div> 







      // import Select from 'react-select';
// useEffect(() => {
//   const fetchProduct = async () => {
//     const res =  await privateRequest.get(`/product`)
//     const resData = res.data.success
//     setListProduct(resData.map(({_id, title}) => ({label: title, value: _id})))
//   }
//   fetchProduct();
// }, [])