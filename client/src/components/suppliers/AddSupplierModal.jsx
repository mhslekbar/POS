import React, { useState } from "react";
import { Timeout, hideMsg } from "../../functions/functions";
import { FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  addSupplier,
  getSuppliers,
} from "../../redux/supplier/supplierApiCalls";
import SuccessMsg from "../Messages/SuccessMsg";

const AddSupplierModal = () => {
  const [modal, setModal] = useState(false);
  const [name, setName] = useState("");
  const [balance, setBalance] = useState(0);
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);
  const dispatch = useDispatch();
  const [errors, setErrors] = useState([]);
  const toggle = () => {
    setModal(!modal);
  };

  const { isFetching } = useSelector(state => state.suppliers);

  const handleAddSupplier = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(
        addSupplier({ name: name.trim(), balance, historyPayment: [{ payment: balance }] })
      );
      if (response === true) {
        dispatch(getSuppliers);
        setModal(false);
        setShowSuccessMsg(true);
        setTimeout(() => setShowSuccessMsg(false), Timeout);
        setName("");
        setBalance(0);
      } else {
        setErrors(response);
      }
    } catch (err) {
      setErrors(err.message);
    }
  };

  return (
    <>
      {showSuccessMsg && (
        <SuccessMsg
          modal={showSuccessMsg}
          toggle={() => setShowSuccessMsg(!showSuccessMsg)}
        />
      )}

      <div className="w-full my-2">
        <button className="p-2 rounded bg-blue-600 text-white" onClick={toggle}>
          <FaPlus />
        </button>
        {modal && (
          <>
            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div
                className="fixed inset-0 w-full h-full bg-black opacity-40"
                onClick={toggle}
              ></div>
              <div className="flex items-center min-h-screen px-4 py-8">
                <div className="relative w-full max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg">
                  <div className="mt-3">
                    {/* Start Modal Body */}
                    <form
                      className="mt-2 sm:ml-4 sm:text-left"
                      onSubmit={handleAddSupplier}
                    >
                      {errors.length > 0 &&
                        errors.map((err, index) => (
                          <p
                            className="w-full rounded bg-red-400 text-white p-2"
                            onClick={(e) => hideMsg(e, errors, setErrors)}
                            key={index}
                          >
                            {err}
                          </p>
                        ))}
                      <div className="mb-2">
                        <label
                          htmlFor="name"
                          className="block text-gray-700 font-bold"
                        >
                          Nom
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="shadow px-3 py-2 border rounded w-full focus:outline-none focus:shadow-outline"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Nom"
                        />
                      </div>
                      <div className="mb-2">
                        <label
                          htmlFor="balance"
                          className="block text-gray-700 font-bold"
                        >
                          Balance
                        </label>
                        <input
                          type="text"
                          id="balance"
                          className="shadow px-3 py-2 border rounded w-full focus:outline-none focus:shadow-outline"
                          value={balance}
                          onChange={(e) => setBalance(e.target.value)}
                          placeholder="Balance"
                        />
                      </div>

                      {/* START Modal Footer */}
                      <div className="items-center gap-2 mt-3 sm:flex">
                        <button
                          type="submit"
                          className="w-full mt-2 p-2.5 flex-1 text-white bg-blue-600 rounded-md outline-none ring-offset-2 ring-blue-600 focus:ring-2"
                          disabled={isFetching}
                        >
                          Ajouter
                        </button>
                        <button
                          className="w-full mt-2 p-2.5 flex-1 bg-gray-600 text-white rounded-md outline-none border ring-offset-2 ring-indigo-600 focus:ring-2"
                          onClick={toggle}
                        >
                          Fermer
                        </button>
                      </div>
                      {/* End Modal Footer */}
                    </form>
                    {/* End Modal Body */}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AddSupplierModal;
