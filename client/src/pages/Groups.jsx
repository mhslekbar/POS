import React from "react";
import ShowGroups from "../components/groups/ShowGroups"
const Groups = () => {
  return (
    <div className="flex flex-col items-center jusitfy-center w-full col-span-9 mx-12">
      <h1 className="text-4xl my-2 uppercase">Roles</h1>
      <ShowGroups />
    </div>
  );
};

export default Groups;
