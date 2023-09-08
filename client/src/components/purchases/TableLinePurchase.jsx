import React, { useEffect, useState } from "react";
import { formatDate, removeComma } from "../../functions/functions";

const TableLinePurchase = ({ LinePurchase }) => {
  const [total, setTotal] = useState("");
  
  useEffect(() => {
    setTotal(LinePurchase?.reduce(
      (acc, currVal) => acc + currVal.total_price,
      0
    ))
  }, [LinePurchase])

  return (
    <div className="flex flex-col overflow-x-auto bg-white">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8 invoice">
        <div className="inline-block min-w-full sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="table-auto min-w-full text-left text-sm font-light text-center">
              <thead className="border font-medium ">
                <tr>
                  <th className="px-6 py-4 border-r">Produit</th>
                  <th className="px-6 py-4 border-r">Quantite</th>
                  <th className="px-6 py-4 border-r">Stock</th>
                  <th className="px-6 py-4 border-r">Prix.U</th>
                  <th className="px-6 py-4 border-r">Prix.V</th>
                  <th className="px-6 py-4 border-r" title="Prix.Unitaire * Quantite">Total</th>
                  <th className="px-6 py-4 border-r">Date d'exp.</th>
                </tr>
              </thead>
              <tbody>
                {LinePurchase?.map((purchase, index) => {
                  return (
                    <tr className="border border-b" key={index}>
                      <td className="whitespace-nowrap px-4 py-2 border-r font-medium text-left">
                        {purchase.productId?.title}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 border-r font-medium">
                        {purchase.mainQty}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 border-r font-medium">
                        {purchase.qty}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 border-r font-medium">
                        {removeComma(purchase.buy_price)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 border-r font-medium">
                        {removeComma(purchase.sell_price)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 border-r font-medium">
                        {removeComma(purchase.total_price)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 border-r font-medium">
                        {formatDate(purchase.expiration_date)}
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <td className="font-bold" colSpan={4}></td>
                  <td className="font-bold">Total: </td>
                  <td className="font-bold">{total}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableLinePurchase;
