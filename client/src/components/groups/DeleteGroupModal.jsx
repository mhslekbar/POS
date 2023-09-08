import React, { useState } from 'react';
import { Timeout } from '../../functions/functions';
import { useDispatch } from 'react-redux';
import { DeleteRoleApi } from '../../redux/roles/roleApiCalls';

const DeleteGroupModal = ({modal, toggle, group, setShowSuccessMsg}) => {
  const [error, setError] = useState([]);
  const dispatch = useDispatch();

  const handleDeleteGroup = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(DeleteRoleApi(group._id))
      if(response === true) {
        toggle();
        setShowSuccessMsg(true);
        setTimeout(() => {
          setShowSuccessMsg(false);
        }, Timeout)
      } else {
        setError(response)
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
                    onSubmit={handleDeleteGroup}
                  >
                    {error.map((err, index) => (<p className="p-2 bg-red-400 text-white mb-1" key={index}>{err}</p>))}

                    {/* My Inputs */}
                    <p>Voulez-vous vraiment supprimer ?</p>
                    <div className="mb-4">
                      <input
                        type="hidden"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={group._id}
                      />
                    </div>
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
}

export default DeleteGroupModal