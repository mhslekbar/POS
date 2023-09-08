import React from "react";
import { IoRemoveCircle } from "react-icons/io5";

const PrintOrder = ({ cartData, removeItem }) => {
  return (
    <div className="w-full flex flex-col overflow-x-auto mt-2">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8 ">
        <div className="inline-block min-w-full sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="table-auto min-w-full text-left text-sm font-light text-center">
              <thead>
                <tr>
                  <th className="text-left">Titre</th>
                  <th>Qté</th>
                  <th>Prix</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {cartData.map((item, index) => (
                  <tr key={index}>
                    <td className="text-left">{item.productId.title}</td>
                    <td>{item.qtyNeeded}</td>
                    <td>{item.price}</td>
                    <td>{item.price * item.qtyNeeded}</td>
                    <td
                      className="flex justify-center items-center text-red print:hidden"
                      onClick={() => removeItem(item)}
                    >
                      <IoRemoveCircle />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="font-bold text-gray-700 text-center mt-2">
              Total :{" "}
              {cartData.reduce(
                (acc, currVal) => acc + currVal.price * currVal.qtyNeeded,
                0
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintOrder;
