import React, { useEffect, useState } from "react";
import { Timeout, formatDate, hideMsg } from "../../../functions/functions";
import { FaSave } from "react-icons/fa";
import { CiCircleRemove } from "react-icons/ci";
import HandlePaymentInput from "./HandlePaymentInput";
import AddPayment from "./AddPayment";
import { useDispatch } from "react-redux";
import { deleteSupplierPayment, editSupplierPayment } from "../../../redux/supplier/supplierApiCalls";

const ShowPayments = ({ modal, toggle, supplier }) => {
  const [payments, setPayments] = useState(supplier.historyPayment);

  const dispatch = useDispatch()

  useEffect(() => {
    setPayments(supplier.historyPayment);
  }, [supplier]);

  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState([]);

  const handleUpdatePayment = async (paymId) => {
    try {
      const amount = document.querySelector(`#paymId${paymId}`).value;

      const response = await dispatch(editSupplierPayment(supplier._id, paymId, {payment: amount}))
      if (response === true) {
        setSuccess("Modifier avec succes");
        setErrors([]);
        setTimeout(() => setSuccess(""), Timeout);
      } else {
        setErrors(response)
      }
    } catch { }
  };

  const handleDeletePayment = async (paymId) => {
    try {
      const response = await dispatch(deleteSupplierPayment(supplier._id, paymId))
      if (response === true) {
        setSuccess("Supprimer avec succes");
        setErrors([]);
        setTimeout(() => setSuccess(false), Timeout);
      } else {
        setErrors(response)
      }
    } catch { }
  };


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
                  <AddPayment supplierId={supplier._id} />

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

                  <table className="min-w-full text-left text-sm font-light">
                    <thead className="border-b font-medium bg-blue-600 text-white">
                      <tr>
                        <th className="px-3 py-2">Montant</th>
                        <th className="px-3 py-2">Date</th>
                        <th className="px-3 py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((paym) => (
                        <tr key={paym._id}>
                          <td className="px-3 py-2">
                            <HandlePaymentInput
                              paymId={paym._id}
                              payment={paym.payment}
                            />
                          </td>
                          <td className="px-3 py-2">
                            {formatDate(paym.updatedAt)}
                          </td>
                          <td className="px-3 py-2 flex justify-center gap-1 ">
                            <FaSave
                              className="text-gray-700 text-lg"
                              onClick={() => handleUpdatePayment(paym._id)}
                            />
                            <CiCircleRemove
                              className="text-red text-lg"
                              onClick={() => handleDeletePayment(paym._id)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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

export default ShowPayments;
