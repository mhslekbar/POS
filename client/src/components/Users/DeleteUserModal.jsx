import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Timeout } from '../../functions/functions';
import { hideMsg } from "../../functions/functions";
import { DeleteUserApi } from '../../redux/user/userApiCalls';

const DeleteUserModal = ({toggle, modal, userData, setShowSuccessMsg }) => {
  const {_id, username} = userData;
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const handleDeleteUser = async (e) => {
    e.preventDefault(); 
    try {
      const response = await dispatch(DeleteUserApi(_id))
      if(response === true) {
        toggle();
        setShowSuccessMsg(true)
        setTimeout(() => {
          setShowSuccessMsg(false)
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
                    onSubmit={handleDeleteUser}
                  >
                    {error?.length > 0
                      ? error?.map((err, index) => (
                          <p
                            className="p-3 my-2 rounded bg-red-400 text-white msg"
                            key={index}
                            onClick={(e) => hideMsg(e, error, setError)}
                          >
                            {err}
                          </p>
                        ))
                      : ""}
                    <p>Vous etes sur de supprimer <b>{username} ?</b></p>
                    <input type="hidden" placeholder="user id" value={_id}/>
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

export default DeleteUserModal