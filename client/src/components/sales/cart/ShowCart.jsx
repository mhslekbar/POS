import React, { useEffect } from "react";
import CustomerInformation from "./CustomerInformation";
import OrderDetails from "./OrderDetails";
import { useDispatch } from "react-redux";
import { getCart } from "../../../redux/cart/cartApiCalls";
import NewCart from "./NewCart";


const ShowCart = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchCart = async () => {
      await dispatch(getCart);
    };
    fetchCart();
  }, [dispatch]);

  return (
    <div className="shadow p-4 ml-2 bg-white">
      <NewCart />
      <CustomerInformation />
      <OrderDetails />
    </div>
  );
};

export default ShowCart;
