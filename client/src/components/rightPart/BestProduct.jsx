import React from "react";

const BestProduct = ({ item }) => {
  const { productId, price, qty } = item;
  return (
    <div className="w-full py-2 px-2 items-center justify-between flex bg-white rounded text-[#000]">
      {/* Start icon + text */}
      <div className="flex items-center justify-center space-x-4 w-full">
        <div className="bg-[#DBEEF4] rounded-full p-2">
          {/* <span>{icon}</span> */}
        </div>
        <div className="w-full space-y-1">
          <h1 className="font-bold">{productId.title}</h1>
          <p className="text-sm ">{productId.desc}</p>
        </div>
      </div>
      {/* End icon + text */}

      {/* Start price + percent */}
      <div className="w-full items-end justify-end flex flex-col ">
        <h1 className="font-bold"> {price} MRU</h1>
        <p
          className={`${qty > 10 ? "text-[#0be881]" : "text-yellow-500"}`}
        >
          qté:{qty}
        </p>
      </div>
      {/* End price + percent */}
    </div>
  );
};

export default BestProduct;
