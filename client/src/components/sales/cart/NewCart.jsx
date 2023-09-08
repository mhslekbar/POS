import React, { useContext } from 'react'
import { useDispatch } from 'react-redux'
import { clearCartApi } from '../../../redux/cart/cartApiCalls';
import { getSales } from '../../../redux/sales/salesApiCalls';
import { getProducts } from '../../../redux/product/productApiCalls';
import { ShowSalesContext } from '../ShowSales';

const NewCart = () => {
  
  const {     
    setShowInfo,
    setCheckPartiel,
    setCheckTotal,
    setName,
    setClientId, setSelectedOrder } = useContext(ShowSalesContext)

  const dispatch = useDispatch();

  const NewCart = async () => {
    await dispatch(clearCartApi);
    dispatch(getSales);
    dispatch(getProducts(""));

    localStorage.setItem("orderStatus", "Add");
    
    setShowInfo(false);
    setCheckPartiel(false);
    setCheckTotal(true);
    setName("");
    setClientId("");
    setSelectedOrder("")
  }
  return (
    <div>
      <button 
        className="bg-blue-600 text-white p-2 rounded shadow w-full"
        onClick={NewCart}
      >
        Vider la cart
      </button>
    </div>
  )
}

export default NewCart
