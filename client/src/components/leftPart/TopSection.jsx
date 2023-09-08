import React from "react";
import SalesStats from "./SalesStats";
import PurchasesStats from "./PurchasesStats";
// import Benefice from "./Benefice";
import FilterByDate from "./FilterByDate";
import Benef from "./Benef";

const TopSection = () => {
  return (
    <>
      <FilterByDate />
      <div className="md:flex items-center justify-center w-full lg:space-y-0 space-y-4 lg:space-x-4 px-12 bg-[#cdc6f0] ml-4 rounded p-6">
        <SalesStats />
        <PurchasesStats />
        <Benef/>
        {/* <Benefice /> */}
      </div>
    </>
  );
};

export default TopSection;
