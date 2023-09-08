import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Timeout, hideMsg } from "../../functions/functions"
import { useDispatch } from "react-redux";
import { addClients } from "../../redux/client/clientApiCalls";

const AddClientModal = ({ setSuccessMsg }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const dispatch = useDispatch()
  const [modal, setModal] = useState(false);
  const [errors, setErrors] = useState([]);

  const toggle = () => {
    setModal(!modal);
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await dispatch(addClients({name, phone}))
      if(response === true) {
        setSuccessMsg(true);
        setTimeout(() => setSuccessMsg(false), Timeout)
        setName("")
        setPhone("")
        toggle()
      } else {
        setErrors(response)
      }
    } catch {}
  }

  return (
    <div className="w-full">
      <button
        className="p-2 rounded bg-blue-600 text-white my-2"
        onClick={toggle}
      >
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
                  {errors.map((err, indx) => <p className="p-2 border rounded my-1 bg-red-400 text-white" key={indx} onClick={(e) => hideMsg(e, errors, setErrors)}>{err}</p>)}
                  <form className="mt-2 sm:ml-4 sm:text-left" onSubmit={handleSubmit}>
                    <div className="mb-2">
                      <label
                        className="block font-bold text-gray-700"
                        htmlFor="name"
                      >
                        Nom
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="w-full shadow border rounded px-3 py-2 focus:outline-none focus:shadow-outline"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="mb-2">
                      <label
                        className="block font-bold text-gray-700"
                        htmlFor="phone"
                      >
                        Telephone
                      </label>
                      <input
                        type="text"
                        id="phone"
                        className="w-full shadow border rounded px-3 py-2 focus:outline-none focus:shadow-outline"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
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

export default AddClientModal;
