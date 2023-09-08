import React, { useEffect, useState } from "react";
import { getUsers } from "../../redux/user/userApiCalls";
import { useDispatch, useSelector } from "react-redux";
import { CiCircleRemove } from "react-icons/ci";
import { FaEdit } from "react-icons/fa";
import EditUserModal from "./EditUserModal";
import DeleteUserModal from "./DeleteUserModal";
import ErrorMsg from "../Messages/ErrorMsg";
import SuccessMsg from "../Messages/SuccessMsg";

const ShowUser = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.users);

  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(false);

  const [modalError, setModalError] = useState(false);
  const [error, setError] = useState(false);

  const toggleEditUserModal = (user) => {
    setSelectedUser(user);
    setEditModal(!editModal);
  };

  const toggleDeleteUserModal = (user) => {
    setSelectedUser(user);
    setDeleteModal(!deleteModal);
  };


  useEffect(() => {
    const userData = async () => {
      const response = await getUsers(dispatch);
      if(response === true) {
        setError(false)
        setModalError(false)
      } else {
        setError(response)
        setModalError(true)
      }
    };
    userData();
  }, [dispatch]);

  const [showSuccessMsg, setShowSuccessMsg] = useState(false);

  return (
    <div className="w-full">
      {showSuccessMsg && (
        <SuccessMsg
          modal={showSuccessMsg}
          toggle={() => setShowSuccessMsg(!showSuccessMsg)}
        />
      )}
      {error && (
        <ErrorMsg
            error={error}
            modal={modalError}
            toggle={() => setModalError(!modalError)}
          />
      )} 

      <div className="flex flex-col border">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full text-left text-sm font-light">
                <thead className="border-b font-medium bg-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-4">#</th>
                    <th className="px-6 py-4">Nom</th>
                    <th className="px-6 py-4">Telephone</th>
                    <th className="px-6 py-4">Groupes</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {currentUser?.map((user, index) => (
                    <tr className="border-b" key={index}>
                      <td className="whitespace-nowrap px-6 py-4 border-r font-medium">
                        {index + 1}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 border-r font-medium">
                        {user.username}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 border-r font-medium">
                        {user.phone}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 border-r font-medium">
                        {user.groups.map((group) => group.groupName + " ")}
                      </td>
                      <td className="flex items-center justify-center">
                        <FaEdit
                          className="text-green me-2"
                          style={{ fontSize: "24px" }}
                          onClick={() => toggleEditUserModal(user._id)}
                        />
                        {editModal && selectedUser === user._id && (
                          <EditUserModal
                            toggle={() => setEditModal(!editModal)}
                            modal={editModal}
                            userData={user}
                            setShowSuccessMsg={setShowSuccessMsg}
                          />
                        )}
                        <CiCircleRemove
                          className="text-red"
                          style={{ fontSize: "24px" }}
                          onClick={() => toggleDeleteUserModal(user._id)}
                        />
                        {deleteModal && selectedUser === user._id && (
                          <DeleteUserModal
                            toggle={() => setDeleteModal(!deleteModal)}
                            modal={deleteModal}
                            userData={user}
                            setShowSuccessMsg={setShowSuccessMsg}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowUser;
