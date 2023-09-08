import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { AddUserApi } from "../../redux/user/userApiCalls";
import SuccessMsg from "../Messages/SuccessMsg";
import { Timeout } from "../../functions/functions";

import { hideMsg } from "../../functions/functions";
import { getRolesApi } from "../../redux/roles/roleApiCalls";

const AddUserModal = () => {
  const [modal, setModal] = useState(false);
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState([]);
  const toggle = () => setModal(!modal);
  const dispatch = useDispatch();
  const { roles } = useSelector(state => state.roles)

  const [modalShowSuccess, setModalShowSuccess] = useState(false);
  const toggleShowSuccess = () => setModalShowSuccess(!modalShowSuccess);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        await dispatch(getRolesApi)
      } catch { }
    };
    fetchRoles();
  }, [dispatch]);

  const handleAddUser = async (e) => {
    e.preventDefault();

    let arrGroup = document.getElementsByClassName("group_id");
    let groups_id = [];
    for (let arrG of arrGroup) {
      if (arrG.checked) {
        groups_id.push(arrG.value);
      }
    }

    try {
      const response = await dispatch(AddUserApi({
        username: username.trim(),
        phone: phone.trim(),
        groups: groups_id,
        password: 1234,
      }))
      if (response === true) {
        setModal(null);
        setUsername("");
        setPhone("");
        setModal(!modal);
        setTimeout(() => {
          setModalShowSuccess(false);
        }, Timeout);
        setModalShowSuccess(true);
        setError([]);
      } else {
        setError(response);
      }
    } catch {}
  };


  return (
    <>
      {modalShowSuccess && (
        <SuccessMsg modal={modalShowSuccess} toggle={toggleShowSuccess} />
      )}
      <div className="w-full mb-2">
        {/* w-fit-content */}
        <button className="p-2 rounded bg-blue-600 text-white" onClick={toggle}>
          <FaPlus />
        </button>
      </div>
      {modal && (
        <>
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div
              className="fixed inset-0 w-full h-full bg-black opacity-40"
              onClick={toggle}
            ></div>
            <div className="flex items-start min-h-screen px-4 py-8">
              <div className="relative w-full max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg">
                <div className="mt-3">
                  {/* Start Modal Body */}
                  <form
                    className="mt-2 sm:ml-4 sm:text-left"
                    onSubmit={handleAddUser}
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
                    <div className="mb-4">
                      <label
                        htmlFor="name"
                        className="block text-gray-700 font-bold mb-2"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="phone"
                        className="block text-gray-700 font-bold mb-2"
                      >
                        Telephone
                      </label>
                      <input
                        type="text"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <p>Choisir au moins un groupe</p>
                    {roles.map((role) => (
                      <div key={role._id}>
                        <input
                          id={role.groupName}
                          className="group_id rounded text-pink-500"
                          type="checkbox"
                          value={role._id}
                        />
                        <label
                          htmlFor={role.groupName}
                          className="text-gray-700 font-bold mb-2 mx-2"
                        >
                          {role.groupName}
                        </label>
                      </div>
                    ))}

                    {/* START Modal Footer */}
                    <div className="items-center gap-2 mt-3 sm:flex">
                      <button
                        type="submit"
                        className="w-full mt-2 p-2.5 flex-1 text-white bg-blue-600 rounded-md outline-none ring-offset-2 ring-blue-600 focus:ring-2"
                      >
                        Ajouter
                      </button>
                      <button
                        type="reset"
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
    </>
  );
};

export default AddUserModal;
