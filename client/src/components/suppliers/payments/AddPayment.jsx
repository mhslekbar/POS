import React, { useState } from "react";
import { FaCheck, FaMinus, FaPlus } from "react-icons/fa";
import { Timeout, formattedDate, hideMsg } from "../../../functions/functions";

import { addSupplierPayment } from "../../../redux/supplier/supplierApiCalls";
import { useDispatch } from "react-redux";


const AddPayment = ({ supplierId }) => {
  const [showAdd, setShowAdd] = useState(true);
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(formattedDate(new Date()))
  
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState([]);

  const dispatch = useDispatch()

  const HandleAddPayment = async (e) => {
    e.preventDefault();

    try {
      const res = await dispatch(addSupplierPayment(supplierId, {payment: amount, date} ))
      if (res === true) {
        setSuccess("Ajouter avec succes");
        setErrors([]);
        setTimeout(() => setSuccess(false), Timeout);
        setAmount("")
      } else {
        setErrors(res);        
      }
    } catch { }
  };


  return (
    <div className="w-full p-2 mb-2">
      {showAdd ? (
        <>
          <FaMinus onClick={() => setShowAdd(!showAdd)} />
          <form onSubmit={HandleAddPayment}>
            <input
              type="text"
              id="amountPaym"
              className="mr-3 shadow w-1/3 py-2 px-3 border rounded focus:outline-none focus:shadow-outline"
              placeholder="Montant"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <input
              type="date"
              id="datePaym"
              className="ml-3 shadow w-1/3 py-2 px-3 border rounded focus:outline-none focus:shadow-outline"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <button className="ml-3 text-green">
              <FaCheck style={{ fontSize: "22px" }} />
            </button>
          </form>
          {success && (
            <p className="p-2 bg-green rounded font-medium my-2">
              {success}
            </p>
          )}
          {errors &&
            errors.map((err, index) => (
              <p
                onClick={(e) => hideMsg(e, errors, setErrors)}
                className="p-2 bg-red-400 text-white rounded my-2 font-medium"
                key={index}
              >
                {err}
              </p>
            ))}
        </>
      ) : (
        <FaPlus onClick={() => setShowAdd(!showAdd)} />
      )}

    </div>
  );
};

export default AddPayment;
