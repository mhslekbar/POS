import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { lenOfFacture } from "../../functions/functions";
import { showOrderOnCartApi } from "../../redux/cart/cartApiCalls";
import { ShowSalesContext } from "./ShowSales";
import SearchOrder from "./SearchOrder";
// #FDFDFE
const OrderList = () => {
  const { sales } = useSelector(state => state.sales)
  const dispatch = useDispatch()

  const { setClientDataToEdit, selectedOrder, setSelectedOrder }  = useContext(ShowSalesContext)

  const handleShowOrder = (order) => {
    const client = order?.client
    setClientDataToEdit(client)
    const data = order.LineSale.map((order) => ({ ...order, qtyNeeded: order.qty, title: order.productName }))
    dispatch(showOrderOnCartApi(data))
    localStorage.setItem("orderStatus", "Edit");  
    setSelectedOrder(order)
  }

  return (
    <div className="w-full mb-4">
      <h1>List des orders</h1>
      <SearchOrder />
      <div className="bg-white rounded p-2 my-2 orders grid grid-flow-col grid-auto-rows:auto gap-2 max-w-full overflow-x-scroll">
        {sales.slice(0,10).map((sale) => {
          // const total = sale.LineSale.reduce((acc, currVal) => acc + (currVal.qty * currVal.price), 0);
          return (
            <section 
              className={`inline-block  text-black px-4 py-2 rounded border ${selectedOrder._id === sale._id ? "border-blue-600" : ""}`}
              key={sale._id}
              onClick={() => handleShowOrder(sale)}
            >
              <span className="block">
                {lenOfFacture(sale.numSale)}
              </span>
              {/* <span>Total: <b>{total}</b></span> */}
            </section>
          )
        })}
      </div>
    </div>
  );
};

export default OrderList;
