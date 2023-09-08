import React, { useState } from 'react';
import { Timeout, hideMsg } from "../../functions/functions";
import { useDispatch } from 'react-redux';
import { editClient } from '../../redux/client/clientApiCalls';

const EditClientModal = ({ modal, toggle, clientData, setSuccessMsg }) => {
  const [name, setName] = useState(clientData.name);
  const [phone, setPhone] = useState(clientData.phone);
  const [errors, setErrors] = useState([]);

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(editClient(clientData._id, {name, phone}))
      if(response === true) {
        toggle();
        setSuccessMsg(true);
        setTimeout(() => setSuccessMsg(false), Timeout)
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
                  <form
                    className="mt-2 sm:ml-4 sm:text-left"
                    onSubmit={handleSubmit}
                  >
                    {errors.map((err, indx) => (<p className="p-2 bg-red-400 text-white rounded my-1" key={indx} onClick={(e) => hideMsg(e, errors, setErrors)}>{err}</p>))}
                    <div className="mb-2">
                      <label className="block font-bold text-gray-700" htmlFor="name">Nom</label>
                      <input type="text"
                        className="px-3 py-2 border shadow rounded w-full focus:outline-none focus:shadow-outline"
                        value={name}
                        id="name"
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="block font-bold text-gray-700" htmlFor="phone">Telephone</label>
                      <input type="text"
                        className="px-3 py-2 border shadow rounded w-full focus:outline-none focus:shadow-outline"
                        value={phone}
                        id="phone"
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    {/* START Modal Footer */}
                    <div className="items-center gap-2 mt-3 sm:flex">
                      <button
                        type="submit"
                        className="w-full mt-2 p-2.5 flex-1 text-white btn-green rounded-md outline-none ring-offset-2 focus:ring-2"
                      >
                        Modifier
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
}

export default EditClientModal
