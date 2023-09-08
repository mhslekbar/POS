import React, { useState } from "react";
import { FaCheck, FaMinus, FaPlus } from "react-icons/fa";
import { Timeout, formattedDate } from "../../../functions/functions";
import { useDispatch } from "react-redux";
import { addClientPayment } from "../../../redux/client/clientApiCalls";

const AddPayment = ({ clientId, setSuccess, setErrors }) => {
  const [amount, setAmount] = useState("");
  const [createdAt, setCreatedAt] = useState(formattedDate(new Date()));
  const [showAdd, setShowAdd] = useState(true);
  const disaptch = useDispatch();
  
  const handleShowAdd = () => {
    setShowAdd(!showAdd) 
  }

  const handleAddPayment = async (e) => {
    e.preventDefault();
    try {
      const response = await disaptch(addClientPayment(clientId, {payment: amount, date: createdAt}))
      if(response === true) {
        setSuccess("Ajouter avec succes")
        setTimeout(() => setSuccess(false), Timeout);
      } else {
        setErrors(response)
      }
    }catch {}
  }

  return (
    <div className="w-full p-2 mb-2">
      
      {showAdd ? (
        <>
          <FaMinus onClick={handleShowAdd} />
          <form onSubmit={handleAddPayment}>
            <input
              type="number"
              placeholder="Montant"
              className="shadow border rounded w-1/3 px-3 py-2 focus:outline-none focus:shadow-outline mr-1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <input
              type="date"
              className="shadow border rounded w-1/3 px-3 py-2 focus:outline-none focus:shadow-outline mr-1"
              value={createdAt}
              onChange={(e) => setCreatedAt(e.target.value)}
            />
            <button className="ml-3 text-green">
              <FaCheck style={{ fontSize: "24px"}}/>
            </button>
          </form>
        </>
      ) : <FaPlus onClick={handleShowAdd} />}
    </div>
  );
};

export default AddPayment;
