import React from "react";

const Example = ({ modal, toggle, cartData }) => {
  return (
    <div>
      {modal && (
        <>
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div
              className="fixed inset-0 w-full h-full bg-black opacity-40"
              onClick={toggle}
            ></div>
            <div className="flex items-start min-h-screen px-4 py-8">
              <div className="relative w-full max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg">
                <div className="mt-3">
                  {/* Start Modal Body */}
                  <h3 className="font-bold text-2xl text-center" onClick={() => window.print()}>Print</h3>
                  <div className="w-full flex flex-col overflow-x-auto mt-2">
                    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8 invoice">
                      <div className="inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="overflow-hidden">
                          <table className="table-auto min-w-full text-left text-sm font-light text-center border">
                            <thead className="border-b font-medium">
                              <tr>
                                <th className="border-r text-left px-6 py-4">Titre</th>
                                <th className="border-r px-6 py-4">Qté</th>
                                <th className="border-r px-6 py-4">Prix</th>
                                <th className="border-r px-6 py-4">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {cartData.map((item, index) => (
                                <tr key={index} className="border-b">
                                  <td className="text-left whitespace-nowrap px-4 py-2 border-r font-medium">
                                    {item.productId.title}
                                  </td>
                                  <td className="whitespace-nowrap px-4 py-2 border-r font-medium">{item.qtyNeeded}</td>
                                  <td className="whitespace-nowrap px-4 py-2 border-r font-medium">{item.price}</td>
                                  <td className="whitespace-nowrap px-4 py-2 border-r font-medium">{item.price * item.qtyNeeded}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <div className="font-bold text-gray-700 text-end mt-2">
                            Total :{" "}
                            {cartData.reduce(
                              (acc, currVal) =>
                                acc + currVal.price * currVal.qtyNeeded,
                              0
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* End Modal Body */}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Example;
