import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteConsumptionApi } from "../../redux/consumption/consApiCalls";
import { Timeout, hideMsg } from "../../functions/functions";

const DeleteConsumption = ({ modal, toggle, setShowSuccessMsg, selectedCons }) => {
  const [errors, setErrors] = useState([]);
  const dispatch = useDispatch();

  const handleSubmitConsumption = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(deleteConsumptionApi(selectedCons._id));
      if (response === true) {
        toggle();
        setShowSuccessMsg(true);
        setTimeout(() => setShowSuccessMsg(false), Timeout);
        setErrors([]);
      } else {
        setErrors(response);
      }
    } catch {}
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

                    {/* START Modal Footer */}
                    <div className="items-center gap-2 mt-3 sm:flex">
                      <button
                        type="submit"
                        className="w-full mt-2 p-2.5 flex-1 text-white bg-red-600 rounded-md outline-none ring-offset-2 ring-red-600 focus:ring-2"
                      >
                        Supprimer
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

export default DeleteConsumption;
