import React, { useState } from "react";

const HandlePaymentInput = ({ payment, paymId }) => {
  const [amount, setAmount] = useState(payment);
  
  return (
    <input
      type="number"
      id={`paymId${paymId}`}
      value={amount}
      className="focus:outline-none"
      onChange={(e) => setAmount(e.target.value)}
    />
  );
};

export default HandlePaymentInput;
