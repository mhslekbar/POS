import React, { useContext } from "react";
import { DashBoadContext } from '../../pages/Dashboard';

const Benefice = () => {
  const { sumSales, sumLineDetails } = useContext(DashBoadContext);

  return (
    <div className="bg-[#BFFA00] pt-6 items-center justify-center flex flex-col w-full">
      <span className="items-center justify-center flex flex-col pb-2">
        <h2>Achats vendus</h2>
        <b className="text-black font-bold text-xl 2xl:text-3xl">
          {sumLineDetails}
        </b>
      </span>
      <div className="bg-black w-full items-center justify-center flex flex-col text-white w-full py-3">
        <h3>Benefices</h3>
        <b className="font-bold text-xl 2xl:text-3xl">
          {sumSales - sumLineDetails}
        </b>
      </div>
    </div>
  );
};

export default Benefice;
