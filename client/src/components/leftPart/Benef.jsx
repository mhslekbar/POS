import React, { useContext } from "react";
import { DashBoadContext } from '../../pages/Dashboard';

const Benef = () => {
  const { sumSales, sumLineDetails } = useContext(DashBoadContext);

  return (
    <div className="space-y-6 w-full items-center justify-center flex flex-col">
      <span className="p-4 bg-white rounded-full  items-center justify-center">
        <img className="w-14" src="/assets/imgs/benefices.png" alt="" />
     </span>
      <span className="items-center justify-center flex flex-col">
        <h2>Benefice</h2>
        <b className="font-bold text-xl">{sumSales - sumLineDetails} MRU</b>
      </span>
    </div>
  );
};

export default Benef;
