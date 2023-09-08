import React, { useContext, useEffect, useState } from "react";
import { CiCircleRemove } from "react-icons/ci";
import { Timeout, formatDate, hideMsg } from "../../functions/functions";
import { useDispatch } from "react-redux";
import { deleteProductFromPurchase } from "../../redux/purchases/purchaseApiCalls";
import { showPurchasesContext } from "./ShowPurchases";

const PurchasesTable = ({ purchasesObj, typeEvent, numPurchase }) => {
  const { selectedPurchase } = useContext(showPurchasesContext)
  const [LinePurchaseData, setLinePurchaseData] = useState([])
  const dispatch = useDispatch();
  const [errors, setErrors] = useState([])
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if(typeEvent !== "Edit") {
      setLinePurchaseData(purchasesObj.LinePurchasesData)
    }
  }, [purchasesObj, typeEvent])

  useEffect(() => {
    if(typeEvent === "Edit") {
      setLinePurchaseData(selectedPurchase.LinePurchase)
    }
  }, [typeEvent, selectedPurchase])

  const removeProduct = async (idLinePurchase, title) => {
    const purchaseId = selectedPurchase._id
    purchasesObj.setLinePurchasesData(purchasesObj.LinePurchasesData.filter(p => p.productId.title !== title))
    if(typeEvent === "Edit") {
      const response = await dispatch(deleteProductFromPurchase(purchaseId, idLinePurchase))
      if(response === true) {
        setSuccess("Supprimer avec success")
        setTimeout(() => setSuccess(""), Timeout);
      }else {
        setErrors(response)
      }
    }
  }
  return (
    <>
      {errors.map((err,index) => (
        <p 
          key={index}
          className="p-2 bg-red-400 text-white rounded mb-2"
          onClick={(e) => hideMsg(e, errors, setErrors)}
        >{err}</p>
      ))}
      {success && <p className="p-2 bg-green text-white rounded mb-2">{success}</p>}
      {LinePurchaseData?.length > 0 && (
        <div className="flex flex-col border">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table className="min-w-full text-left text-sm font-light  text-center">
                  <thead className="border-b font-medium ">
                    <tr>
                      <th className="px-2 py-1 border-r">Produit</th>
                      <th className="px-2 py-1 border-r">Quantite</th>
                      <th className="px-2 py-1 border-r">Prix.U</th>
                      <th className="px-2 py-1 border-r">Prix.V</th>
                      <th className="px-2 py-1 border-r">Total</th>
                      <th className="px-2 py-1 border-r">Date d'exp.</th>
                      <th className="px-2 py-1">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {LinePurchaseData?.map((purchase, index) => (
                      <tr className="border-b" key={index}>
                        <td className="whitespace-nowrap px-4 py-2 border-r font-medium text-left">
                          {purchase.productId?.title}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 border-r font-medium">
                          {purchase.mainQty}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 border-r font-medium">
                          {purchase.buy_price}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 border-r font-medium">
                          {purchase.sell_price}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 border-r font-medium">
                          {purchase.total_price}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 border-r font-medium">
                          {purchase.expiration_date && formatDate(purchase.expiration_date)}
                        </td>
                        <td className="flex items-align justify-center">
                          <CiCircleRemove className="text-red" style={{ fontSize: "22px"}} onClick={() => removeProduct(purchase._id, purchase.productId.title)}/>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PurchasesTable;
