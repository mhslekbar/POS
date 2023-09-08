import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EditUserApi } from "../../redux/user/userApiCalls";
import { Timeout } from "../../functions/functions";
import { hideMsg } from "../../functions/functions";

import { getRolesApi } from "../../redux/roles/roleApiCalls";

const EditUserModal = ({ modal, toggle, userData, setShowSuccessMsg }) => {
  const [username, setUsername] = useState(userData.username);
  const [phone, setPhone] = useState(userData.phone);
  const [error, setError] = useState([]);
  let [selectedRoles, setSelectedRoles] = useState(userData.groups);
  const { roles } = useSelector(state => state.roles)
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchRoles = async () => {
      await dispatch(getRolesApi)
    };
    fetchRoles();
  }, [dispatch]);

  const handleSelectedRole = (e) => {
    const id = e.target.value;
    if (!e.target.checked) {
      setSelectedRoles(selectedRoles.filter((grp) => grp._id !== id));
    } else {
      const grp = roles.find((grp) => grp._id === id);
      setSelectedRoles([...selectedRoles, grp]);
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();

    let arrGroup = document.getElementsByClassName("group_id");
    let groups_id = [];
    for (let arrG of arrGroup) {
      if (arrG.checked) {
        groups_id.push(arrG.value);
      }
    }

    try {
      const response = await dispatch(EditUserApi(userData._id, {
        username: username.trim(),
        phone: phone.trim(),
        groups: groups_id,
      }))
      if (response === true) {
        setUsername("");
        setPhone("");
        toggle();

        setShowSuccessMsg(true);
        setTimeout(() => {
          setShowSuccessMsg(false);
        }, Timeout);
        setError([]);
      } else {
        setError(response);
      }
    } catch {}
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
            <div className="flex items-start min-h-screen px-4 py-8">
              <div className="relative w-full max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg">
                <div className="mt-3">
                  {/* Start Modal Body */}
                  <form
                    className="mt-2 sm:ml-4 sm:text-left"
                    onSubmit={handleEditUser}
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
                        htmlFor="name"
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
                          checked={selectedRoles.some(
                            (obj) => obj._id === role._id
                          )}
                          onChange={handleSelectedRole}
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
                        className="w-full mt-2 p-2.5 flex-1 text-white bg-green-600 rounded-md outline-none ring-offset-2 ring-green-600 focus:ring-2"
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

export default EditUserModal;
