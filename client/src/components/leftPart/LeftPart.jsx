import React from "react";
import CustomChartSales from "./CustomChartSales";
import TopSection from "./TopSection";

const LeftPart = () => {

  return (
    <div className="col-span-3 items-start justify-start flex flex-col w-full pt-12 pb-6 mx-9">
      <TopSection />
      <div className="border-t border-main w-full my-4 ml-4" /> {/* Separator */}
      {/* START CustomChartSales */}
      <div className="w-full items-center justify-center flex flex-col px-6 py-2">
        <CustomChartSales />
        {/* <CustomChartSales /> */}
      </div>
      {/* END CustomChartSales */}
    </div>
  );
};

export default LeftPart;
