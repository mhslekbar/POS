import React, { useState } from "react";
import HandlePaymentInput from "../../suppliers/payments/HandlePaymentInput";
import { formatDate, hideMsg, Timeout } from "../../../functions/functions";
import AddPayment from "./AddPayment";
import { CiCircleRemove } from 'react-icons/ci';
import { FaSave } from 'react-icons/fa';
import { useDispatch } from "react-redux";
import { deleteClientPayment, editClientPayment } from "../../../redux/client/clientApiCalls";

const ShowPaymentClients = ({ modal, toggle, client }) => {
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState(false);
  const dispatch = useDispatch();

  const handleUpdatePayment = async (paymentId) => {
    const payment = document.getElementById(`paymId${paymentId}`).value
    try {
      const response = await dispatch(editClientPayment(client._id, payment, paymentId))
      if(response === true) {
        setSuccess("Modifier avec succes");
        setTimeout(() => setSuccess(false), Timeout)
      }else {
        setErrors(response);
      }
    } catch {}
  }

  const handleDeletePayment = async (paymentId) => {
    try {
      const response = await dispatch(deleteClientPayment(client._id, paymentId))
      if(response === true) {
        setSuccess("Supprimer avec succes");
        setTimeout(() => setSuccess(false), Timeout)
      }else {
        setErrors(response);
      }
    } catch {}
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
                  <AddPayment clientId={client._id} setSuccess={setSuccess} setErrors={setErrors} />

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
                      {client.historyPayment.map((paym) => (
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

export default ShowPaymentClients;
