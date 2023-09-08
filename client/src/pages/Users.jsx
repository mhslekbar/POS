import React from "react";
import ShowUser from "../components/Users/ShowUser";
import AddUserModal from "../components/Users/AddUserModal";

const Users = () => {
  return (
    <div className="flex flex-col items-center jusitfy-center w-full col-span-9 mx-12">
      <h1 className="text-4xl my-2 uppercase">Utilisateurs</h1>
      <AddUserModal />
      <ShowUser />
    </div>
  );
};

export default Users;
