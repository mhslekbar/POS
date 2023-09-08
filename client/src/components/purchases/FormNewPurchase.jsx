import React, { useState } from "react";
import { formattedDate, hideMsg } from "../../functions/functions"
import { useDispatch } from "react-redux";
import { supplyPurchase } from "../../redux/purchases/purchaseApiCalls";

const FormNewPurchase = ({ modal, toggle, product, purchasesObj, typeEvent, purchaseId }) => {
  const [showDateExpir, setShowDateExpir] = useState(false);
  const [qty, setQty] = useState("");
  const [buy_price, setBuyPrice] = useState("");
  const [sell_price, setSellPrice] = useState("");
  const currentDate = new Date()
  currentDate.setMonth(currentDate.getMonth() + 6)
  const [dateExpir, setDateExpir] = useState(formattedDate(currentDate));
  const [errors, setErrors] = useState([]);
  const dispatch = useDispatch();

  const handleAppendPurchase = (e) => {
    let formErrors = []
    if(e.key === "Enter" || e.target.type === "button") {
      e.preventDefault()
      if(qty.length === 0) {
        formErrors.push("Donner la quantite") 
      }
      if(qty <= 0) {
        formErrors.push("La quantite doit etre superieur a 0") 
      }
      if(buy_price.length === 0) {
        formErrors.push("Donner le prix d'achat") 
      }
      if(sell_price.length === 0) {
        formErrors.push("Donner le prix de vente") 
      }

      if(formErrors.length === 0) {
        toggle();
        let expiration_date = dateExpir
        if(!showDateExpir) {
          expiration_date = ""
        }
        if(purchasesObj.LinePurchasesData?.findIndex(p => p.productId.title === product.title) === -1 || purchasesObj.LinePurchasesData.length === 0) {
          purchasesObj.setLinePurchasesData([...purchasesObj.LinePurchasesData, 
            {productId: {title: product.title, id: product._id}, mainQty:qty,  qty, buy_price, sell_price, expiration_date, total_price: buy_price * qty}
          ])
          if(typeEvent === "Edit") {
            dispatch(supplyPurchase(purchaseId,
              {productId: product._id, mainQty:qty,  qty, buy_price, sell_price, expiration_date, total_price: buy_price * qty}
            ))
          }
        }

        setQty("")
        setBuyPrice("")
        setSellPrice("")
        setDateExpir(formattedDate(currentDate))
      } else {
        setErrors(formErrors)
      }

    }
  }

  return (
    <div>
      {modal && (
        <>
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div
              className="fixed inset-0 w-full h-full bg-black opacity-40"
              onClick={toggle}
            ></div>
            <div className="flex items-start min-h-screen px-4 py-8">
              <div className="relative w-full max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg">
                <div className="mt-3">
                  {/* Start Modal Body */}
                    <h3 className="font-bold text-center text-gray-700 text-2xl my-2">{product.title}</h3>
                    {errors.map((err,index) => (
                      <p 
                        key={index}
                        className="p-2 bg-red-400 text-white rounded mb-2"
                        onClick={(e) => hideMsg(e, errors, setErrors)}
                      >{err}</p>
                    ))}
                    <div className="mb-2">
                      <input
                        type="number"
                        className="shadow w-full border rounded focus:outline-none focus:shadow-outline px-3 py-2"
                        placeholder="Quantity.."
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                        onKeyDown={handleAppendPurchase}
                      />
                    </div>
                    <div className="mb-2">
                      <div className="flex justify-between font-bold text-gray-700">
                        <label className="px-1" htmlFor="price_buy" style={{ width: "48%" }} >Prix unitaire</label>
                        <label className="px-1" htmlFor="price_sell" style={{ width: "48%" }}>Prix de vente</label>
                      </div>
                      <div className="flex justify-between">
                        <input
                          id="price_buy"
                          type="number"
                          className="shadow border rounded focus:outline-none focus:shadow-outline px-3 py-2"
                          placeholder="Prix unitaire.."
                          style={{ width: "48%" }}
                          onKeyDown={handleAppendPurchase}
                          value={buy_price}
                          onChange={(e) => setBuyPrice(e.target.value)}
                        />
                        <input
                          id="price_sell"
                          type="number"
                          className="shadow border rounded focus:outline-none focus:shadow-outline px-3 py-2"
                          placeholder="Prix de vente.."
                          style={{ width: "48%" }}
                          onKeyDown={handleAppendPurchase}
                          value={sell_price}
                          onChange={(e) => setSellPrice(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="mb-2">
                      <input
                        type="checkbox"
                        id="dateExpir"
                        checked={showDateExpir}
                        onChange={() => setShowDateExpir(!showDateExpir)}
                        onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
                      />{" "}
                      <label
                        htmlFor="dateExpir"
                        className="text-gray-700 font-bold"
                      >
                        Date d'expiration
                      </label>
                      {showDateExpir && (
                        <input
                          type="date"
                          className="shadow w-full border rounded focus:outline-none focus:shadow-outline px-3 py-2"
                          onKeyDown={handleAppendPurchase}
                          value={dateExpir}
                          onChange={(e) => setDateExpir(e.target.value)}
                        />
                      )}
                    </div>

                    {/* START Modal Footer */}
                    <div className="items-center gap-2 mt-3 sm:flex">
                      <button
                        type="button"
                        className="w-full mt-2 p-2.5 flex-1 text-white bg-blue-600 rounded-md outline-none ring-offset-2 ring-blue-600 focus:ring-2"
                        onClick={handleAppendPurchase}
                      >
                        Ajouter
                      </button>
                    </div>
                    {/* End Modal Footer */}
                  {/* End Modal Body */}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FormNewPurchase;
