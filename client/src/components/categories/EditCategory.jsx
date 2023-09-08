import React, { useState } from 'react';
import { editCategory } from '../../redux/categories/categoriesApiCalls';
import { useDispatch } from 'react-redux';
import { Timeout, hideMsg } from "../../functions/functions";

const EditCategory = ({modal, toggle, setShowSuccessMsg, selectedCategory }) => {
  const [name, setName] = useState(selectedCategory?.name)
  const [errors, setErrors] = useState([]);
  const dispatch = useDispatch()

  const handleAddCategory = async (event) => {
    event.preventDefault();
    const response = await dispatch(editCategory(selectedCategory?._id, {name: name.trim()}))
    if(response === true) {
      toggle();
      setName("");
      setShowSuccessMsg(true)
      setTimeout(() => setShowSuccessMsg(false), Timeout)
      setErrors([])
    } else {
      setErrors(response)
    }
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
                    onSubmit={handleAddCategory}
                  >
                    {errors.length > 0 && errors.map((err, index) => <p className='rounded bg-red-400 text-white p-2' key={index} onClick={(e) => hideMsg(e, errors, setErrors)}>{err}</p>)}
                      {/* My Inputs */}
                    <div className='mb-2'>
                      <label htmlFor="category" className='text-gray-700 font-bold'>Nom</label>
                      <input 
                        type="text"
                        id="category"
                        className='w-full border rounded shadow px-3 py-2 focus:outline-none focus:outline-shadow'
                        placeholder="Entrez le nom du category"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    {/* START Modal Footer */}
                    <div className="items-center gap-2 mt-3 sm:flex">
                      <button
                        type="submit"
                        className="w-full mt-2 p-2.5 flex-1 text-white bg-green rounded-md outline-none ring-offset-2 ring-green focus:ring-2"
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

export default EditCategory
