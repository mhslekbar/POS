import React, { useContext } from "react";
import { ShowSalesContext } from "../ShowSales";
import { useDispatch } from "react-redux";
import { editSaleApi } from "../../../redux/sales/salesApiCalls";
import { clearCartApi } from "../../../redux/cart/cartApiCalls";
import { Timeout } from "../../../functions/functions";

const EditSaleData = () => {
  const {
    setShowInfo,
    setCheckPartiel,
    setCheckTotal,
    setName,
    setClientId,
    selectedOrder,
    setSelectedOrder,
    setShowSuccessMsg,
    clientId, amountPayed,
    setErrors
  } = useContext(ShowSalesContext);
  const dispatch = useDispatch();

  const handleEditOrder = async () => {
    try {
      const saleId = selectedOrder._id;
      const response = await dispatch(
        editSaleApi(saleId, { clientId, amountPayed })
      );

      if (response === true) {
        localStorage.setItem("orderStatus", "Add");
        await dispatch(clearCartApi);
        setShowInfo(false);
        setCheckPartiel(false);
        setCheckTotal(true);
        setName("");
        setClientId("");
        setSelectedOrder("");
        setShowSuccessMsg(true);
        setTimeout(() => setShowSuccessMsg(false), Timeout);
        setErrors([])
      } else {
        setErrors(response)
      }
    } catch {}
  };
  return (
    <div>
      <button
        className="bg-green px-3 py-2 rounded focus:outline-none text-white w-full mt-2 text-center"
        onClick={handleEditOrder}
      >
        Edit
      </button>
    </div>
  );
};

export default EditSaleData;
