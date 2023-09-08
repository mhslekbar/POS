import React from "react";
import {
  SearchOutline,
  ChipOutline,
  UserCircleOutline,
  InboxOutline,
  BellOutline,
} from "heroicons-react";
import { useSelector } from "react-redux";

const Header = () => {
  const { userData } = useSelector(state => state.login)
  return (
    // bg-[#F0F5F5]
    <div className="bg-blue-600 text-white w-full py-6 items-center justify-between flex px-12">
      {/* START Search */}
      <div className="w-full lg:flex space-x-4 items-center justify-start py-4 hidden">
        <ChipOutline className="w-6 h-6" />
        {/* text-gray-900 */}
        <h1 onClick={() => window.location.reload()} className="text-xl font-medium text-white">{userData.username}</h1>
      </div>
      {/* END Search */}
      {/* START Logo */}
      <div className="items-center w-full justify-center flex space-x-4">
        <p className="bg-white text-blue-600 font-bold p-2 rounded w-full text-center text-2xl hover:bg-blue-600 hover:text-white hover:border-white hover:border-2">ATLAS - SOFTWARE</p>
        <SearchOutline className="w-4 h-4 hidden" />
        <input
          type="text"
          placeholder="search..."
          className="bg-transparent outline-none text-white hidden"
        />
      </div>
      {/* END Logo */}

      {/* START icons */}
      <div className="items-center justify-end space-x-6 flex w-full">
        <BellOutline className="header-icon" />
        <InboxOutline className="header-icon" />
        <UserCircleOutline className="header-icon" />
      </div>
      {/* END icons */}
    </div>
  );
};

export default Header;
