import React, { useState } from "react";
import { Timeout, hideMsg } from "../../functions/functions";
import { deleteClient } from "../../redux/client/clientApiCalls";
import { useDispatch } from "react-redux";

const DeleteClientModal = ({ modal, toggle, clientData, setSuccessMsg }) => {
  const [errors, setErrors] = useState([]);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(deleteClient(clientData._id))
      if(response === true) {
        setSuccessMsg(true);
        setTimeout(() => setSuccessMsg(false), Timeout)
        toggle()
      } else {
        setErrors(response)
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
            <div className="flex items-center min-h-screen px-4 py-8">
              <div className="relative w-full max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg">
                <div className="mt-3">
                  {/* Start Modal Body */}
                  <form className="mt-2 sm:ml-4 sm:text-left" onSubmit={handleSubmit}>
                    {errors.map((err, index) => (
                      <p
                        className="p-2 my-1 bg-red-400 text-white rounded"
                        key={index}
                        onClick={(e) => hideMsg(e, errors, setErrors)}
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

export default DeleteClientModal;
