import React, { useState } from "react";
import { Timeout } from "../../functions/functions";
import { FaPlus } from "react-icons/fa";
import SuccessMsg from "../Messages/SuccessMsg";
import { hideMsg } from "../../functions/functions";
import { useDispatch } from "react-redux";
import { AddRoleApi } from "../../redux/roles/roleApiCalls";

const AddNewGroup = () => {
  const [modal, setModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);
  const [error, setError] = useState([]);
  const toggle = () => {
    setModal(!modal);
  };
  const dispatch = useDispatch();

  const handleAddNewGroup = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(AddRoleApi({groupName: groupName.trim()}))
      if(response === true)  {
        setGroupName("");
        setModal(!modal);
        setTimeout(() => {
          setShowSuccessMsg(false);
        }, Timeout);
        setShowSuccessMsg(true);
      } else {
        setError(response);
      }
    } catch { }
  };

  return (
    <>
      {showSuccessMsg && (
        <SuccessMsg
          modal={showSuccessMsg}
          toggle={() => setShowSuccessMsg(!showSuccessMsg)}
        />
      )}
      <div>
        <button className="p-2 rounded bg-blue-600 text-white" onClick={toggle}>
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
                    <form
                      className="mt-2 sm:ml-4 sm:text-left"
                      onSubmit={handleAddNewGroup}
                    >
                      {error?.map((err, index) => (
                        <p
                          className="bg-red-400 text-white p-2 rounded mb-1"
                          key={index}
                          onClick={(e) => hideMsg(e, error, setError)}
                        >
                          {err}
                        </p>
                      ))}
                      <div className="mb-4">
                        <label
                          htmlFor="name"
                          className="block text-gray-700 font-bold mb-2"
                        >
                          Nom
                        </label>
                        <input
                          type="text"
                          id="name"
                          placeholder="Nom "
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          value={groupName}
                          onChange={(e) => setGroupName(e.target.value)}
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
    </>
  );
};

export default AddNewGroup;
