import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addConsumptionApi } from "../../redux/consumption/consApiCalls";
import { Timeout, hideMsg } from "../../functions/functions";

const AddNewConsumption = ({ setShowSuccessMsg }) => {
  const [modal, setModal] = useState(false);
  const [note, setNote] = useState("");
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState([]);
  const dispatch = useDispatch();

  const toggle = () => {
    setModal(!modal);
  };

  const handleSubmitConsumption = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(addConsumptionApi({ note, amount }));
      if (response === true) {
        toggle();
        setShowSuccessMsg(true);
        setTimeout(() => setShowSuccessMsg(false), Timeout);
        setNote("");
        setAmount("");
        setErrors([]);
      } else {
        setErrors(response);
      }
    } catch {}
  };

  return (
    <div>
      <button className="p-2 rounded bg-blue-600 text-white mb-2" onClick={toggle}>
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
                    onSubmit={handleSubmitConsumption}
                  >
                    {errors.length > 0 &&
                      errors.map((err, index) => (
                        <p
                          className="bg-red-400 text-white w-full p-2 rounded"
                          onClick={(e) => hideMsg(e, errors, setErrors)}
                          key={index}
                        >
                          {err}
                        </p>
                      ))}
                    <div className="mb-2">
                      <label className="font-bold text-gray-700" htmlFor="note">
                        Note
                      </label>
                      <input
                        type="text"
                        className="w-full shadow px-3 py-2 border rounded focus:outline-none focus:outline-shadow"
                        placeholder="Donner une note"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="font-bold text-gray-700" htmlFor="note">
                        Montant
                      </label>
                      <input
                        type="number"
                        className="w-full shadow px-3 py-2 border rounded focus:outline-none focus:outline-shadow"
                        placeholder="Donner le montant"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                      />
                    </div>

                    {/* START Modal Footer */}
                    <div className="items-center gap-2 mt-3 sm:flex">
                      <button
                        type="submit"
                        className="w-full mt-2 p-2.5 flex-1 text-white bg-blue-600 rounded-md outline-none ring-offset-2 ring-blue-600 focus:ring-2"
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
  );
};

export default AddNewConsumption;
