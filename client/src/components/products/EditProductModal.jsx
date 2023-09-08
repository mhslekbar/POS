import React, { useState } from "react";
import { Timeout } from "../../functions/functions";
import { hideMsg } from "../../functions/functions";
import { EditProductApi } from "../../redux/product/productApiCalls";
import { useDispatch, useSelector } from "react-redux"

const EditProductModal = ({ modal, toggle, productData, setShowSuccessMsg }) => {
  const [title, setTitle] = useState(productData.title)
  const [desc, setDesc] = useState(productData.desc)
  const [barcode, setBarcode] = useState(productData.barcode)
  const [catId, setCatId] = useState(productData?.catId?._id);
  const [error, setError] = useState([]);
  const { categories } = useSelector(state => state.categories)

  const dispatch = useDispatch()

  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(EditProductApi(productData._id, 
        { title: title.trim(), desc: desc.trim(), catId, barcode }))        
      if(response === true) {
          toggle();
          setShowSuccessMsg(true);
          setTimeout(() => setShowSuccessMsg(false), Timeout)
        } else {
          setError(response)
        }
    } catch {}
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission on Enter key
      // Process your barcodeValue here
    }
  };

  return (
    <>
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
                      onSubmit={handleEditProduct}
                    >
                      {error?.length > 0 && error?.map((err, index) => (
                        <p
                          className="bg-red-400 text-white p-2 rounded mb-1"
                          key={index}
                          onClick={(e) => hideMsg(e, error, setError)}
                        >
                          {err}
                        </p>
                      ))}
                      <div className="mb-2">
                        <label
                          htmlFor="title"
                          className="block text-gray-700 font-bold mb-2"
                        >
                          Titre
                        </label>
                        <input
                          type="text"
                          id="title"
                          placeholder="Title"
                          onChange={(e) => setTitle(e.target.value)}
                          onKeyDown={handleKeyDown}
                          value={title}
                          className="shadow border w-full rounded py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                        />
                      </div>
                      <div className="mb-2">
                        <label
                          htmlFor="barcode"
                          className="block text-gray-700 font-bold mb-2"
                        >
                          Barcode
                        </label>
                        <input
                          type="text"
                          id="barcode"
                          placeholder="Barcode"
                          onChange={(e) => setBarcode(e.target.value)}
                          onKeyDown={handleKeyDown}
                          value={barcode}
                          className="shadow border w-full rounded py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                        />
                      </div>
                      <div className="mb-2">
                        <label
                          htmlFor="desc"
                          className="block text-gray-700 font-bold mb-2"
                        >
                          Description
                        </label>
                        <input
                          type="text"
                          id="desc"
                          placeholder="Description"
                          onChange={(e) => setDesc(e.target.value)}
                          onKeyDown={handleKeyDown}
                          value={desc}
                          className="shadow border w-full krounded py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                        />
                      </div>
                      { categories.length > 0 && 
                        <>
                          <label className="block font-bold text-gray-700" htmlFor="categorie">Categorie</label>
                          <select 
                            id="categorie" 
                            className="shadow mb-2 w-full border rounded px-3 py-2 focus:outline-none focus:shadow-outline text-black"
                            value={catId}  
                            onChange={(e) => setCatId(e.target.value)}
                          >
                            <option>Choisir une categorie</option>
                            {categories.map((cat) => 
                              <option value={cat._id} key={cat._id}>{cat.name}</option>
                            )}
                          </select>
                        </>
                      }
                      {/* START Modal Footer */}
                      <div className="items-center gap-2 mt-3 sm:flex">
                        <button
                          type="submit"
                          className="w-full mt-2 p-2.5 flex-1 text-white bg-green rounded-md outline-none ring-offset-2 ring-blue-600 focus:ring-2"
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
    </>
  );
};

export default EditProductModal;

