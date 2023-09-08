import React, { useState } from "react";
import { get, remove } from "../../requestMethods";
import { Timeout } from "../../functions/functions";
import { hideMsg } from "../../functions/functions";

const DeleteProductModal = ({
  modal,
  toggle,
  productData,
  setShowSuccessMsg,
}) => {
  const [error, setError] = useState([]);

  const handleDeleteProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await remove(`/product/${productData._id}`);
      if (res.data.success) {
        toggle();
        await get("/product");
        setShowSuccessMsg(true);
        setTimeout(() => setShowSuccessMsg(false), Timeout);
      }
      else {
        setError(res.data.formErrors)
      }
    } catch (err) {
      const formErrors = err.response.data?.formErrors ? err.response.data?.formErrors : err.response?.data;
      setError([formErrors]);
    }
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
                    onSubmit={handleDeleteProduct}
                  >
                    {error?.map((err, index) => (
                      <p
                        className="w-full p-2 rounded bg-red-400 text-white"
                        key={index}
                        onClick={(e) => hideMsg(e, error, setError)}
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
                        supprimer
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

export default DeleteProductModal;
