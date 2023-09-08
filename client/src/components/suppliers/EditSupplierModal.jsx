import React, { useState } from 'react';
import { Timeout, hideMsg } from '../../functions/functions';
import { useDispatch } from "react-redux";
import { editSupplier, getSuppliers } from "../../redux/supplier/supplierApiCalls";

const EditSupplierModal = ({modal, toggle, supplierData, setShowSuccessMsg}) => {
  const [name, setName] = useState(supplierData.name);
  const dispatch = useDispatch();
  const [errors, setErrors] = useState([]);

  const handleEditSupplier = async (e) => {
    e.preventDefault();
    const suppId = supplierData._id
    try {
      const response = await dispatch(editSupplier(suppId, {name: name.trim()}));
      if(response === true) {
        dispatch(getSuppliers);
        toggle();
        setShowSuccessMsg(true);
        setTimeout(() => setShowSuccessMsg(false), Timeout);
        setName("");
      } else {
        setErrors(response)
      }
    } catch { }
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
                    onSubmit={handleEditSupplier}
                  >
                    {errors?.map((err, index) => (<p className="p-2 bg-red-400 text-white rounded mb-2" onClick={(e) => hideMsg(e, errors, setErrors)} key={index}>{err}</p>))}
                    <div className="mb-2">
                      <label htmlFor="name" className='block font-bold text-gray-700'>Nom</label>
                      <input type="text" id="name" className='w-full shadow border px-3 py-2 rounded focus:outline-none focus:shadow-outline' value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    {/* START Modal Footer */}
                    <div className="items-center gap-2 mt-3 sm:flex">
                      <button
                        type="submit"
                        className="w-full mt-2 p-2.5 flex-1 text-white bg-green-600 rounded-md outline-none ring-offset-2 ring-green-600 focus:ring-2"
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

export default EditSupplierModal