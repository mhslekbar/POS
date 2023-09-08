import React, { useContext, useState } from "react";
import { FaPrint } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCartApi,
  removeItemFromCart,
} from "../../../redux/cart/cartApiCalls";
import {
  createSaleApi,
  getSales,
  removeSaleApi,
} from "../../../redux/sales/salesApiCalls";
import { Timeout, hideMsg } from "../../../functions/functions";
import { getProducts } from "../../../redux/product/productApiCalls";
import { ShowSalesContext } from "../ShowSales";
import PrintOrder from "./PrintOrder";
import EditSaleData from "./EditSaleData";
import ModalPrintOrder from "./ModalPrintOrder"


const OrderDetails = () => {
  const { cart } = useSelector((state) => state.cart);
  const { userData } = useSelector((state) => state.login);
  const {
    clientId, amountPayed,
    setShowInfo,
    setCheckPartiel,
    setCheckTotal,
    setName,
    setClientId,
    setShowSuccessMsg,
    selectedOrder,
    errors, setErrors
  } = useContext(ShowSalesContext);

  const dispatch = useDispatch();

  const removeItem = async (item) => {
    if (localStorage.getItem("orderStatus") === "Edit") {
      const findIndex = cart.findIndex(
        (ele) => ele.productId === item.productId
      );
      const saleId = selectedOrder._id;
      const LineSaleId = cart[findIndex]._id;

      const response = await dispatch(
        removeItemFromCart(item.productId._id, saleId, LineSaleId)
      );
      if(response === true) {
        await dispatch(getProducts(""));
        await dispatch(getSales);
        setErrors([])
      }else {
        setErrors(response)
      }
    } else {
      await dispatch(removeItemFromCart(item._id));
    }
    setShowInfo(false);
    setCheckPartiel(false);
    setCheckTotal(true);
    setName("");
    setClientId("");
  };

  const handleAddNewOrder = async () => {
    const LineSale = cart.map(({ price, qtyNeeded, _id }) => ({
      price,
      qty: qtyNeeded,
      productId: _id,
    }));
    const data = {
      userId: userData._id,
      client: {
        clientId,
        amountPayed,
      },
      LineSale,
    };
    const response = await dispatch(createSaleApi(data));
    if (response === true) {
      await dispatch(clearCartApi);
      await dispatch(getProducts(""));
      setShowSuccessMsg(true);
      setShowInfo(false);
      setCheckPartiel(false);
      setCheckTotal(true);
      setName("");
      setClientId("");
      setTimeout(() => setShowSuccessMsg(false), Timeout);
      setErrors([])
    } else {
      setErrors(response)
    }
  };

  const handleClearCart = async () => {
    const saleId = selectedOrder._id;

    if (localStorage.getItem("orderStatus") === "Edit") {
      const response = await dispatch(removeSaleApi(saleId));
      if (response === true) {
        setShowSuccessMsg(true);
        setTimeout(() => setShowSuccessMsg(false), Timeout);
        dispatch(getSales);
        dispatch(getProducts(""));
        await dispatch(clearCartApi);
        localStorage.setItem("orderStatus", "Add");

        setShowInfo(false);
        setCheckPartiel(false);
        setCheckTotal(true);
        setName("");
        setClientId("");
        setErrors([])
      }else {
        setErrors(response)
      }
    } else {
      await dispatch(clearCartApi);
      localStorage.setItem("orderStatus", "Add");
    }
  };

  const [showModalPrint, setShowModalPrint] = useState(false)

  return (
    <div>
      {cart?.length > 0 && (
        <>
          {errors.length > 0 && 
            errors.map((err, index) => <p 
              className="mb-2 bg-red-400 text-white p-2 rounded"
              key={index}
              onClick={(e) => hideMsg(e, errors, setErrors)}
            >{err}</p>)}
          <div className="flex justify-between">
            <b className="text-gray-700">Details de l'ordre</b>
            <FaPrint
              className="text-blue-600"
              style={{ fontSize: "22px" }}
              onClick={() => setShowModalPrint(!showModalPrint)}
              // onClick={() => window.print()}
            />
            {showModalPrint && <ModalPrintOrder cartData={cart} modal={showModalPrint} toggle={() => setShowModalPrint(!showModalPrint)} />}
          </div>
          <PrintOrder cartData={cart} removeItem={removeItem} />
          {localStorage.getItem("orderStatus") === "Add" ? (
            <button
              className="bg-blue-600 px-3 py-2 rounded focus:outline-none text-white w-full mt-2"
              onClick={handleAddNewOrder}
            >
              Ajouter
            </button>
          ) : (
            <>
              <EditSaleData />
              <button
                className="bg-red text-white rounded p-2 w-full mt-1"
                onClick={() => handleClearCart()}
              >
                Supprimer
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default OrderDetails;
