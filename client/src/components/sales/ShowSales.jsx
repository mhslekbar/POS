import React, { useEffect, useState, createContext } from 'react'
import CategoryList from './CategoryList'
import OrderList from './OrderList'
import Menu from './Menu'
import { useDispatch } from "react-redux";
import { getSales } from '../../redux/sales/salesApiCalls';
import { getCategories } from '../../redux/categories/categoriesApiCalls';
import { getProducts } from '../../redux/product/productApiCalls';
import ShowCart from './cart/ShowCart';
import SuccessMsg from "../Messages/SuccessMsg";
import { clearCartApi } from '../../redux/cart/cartApiCalls';
import ErrorMsg from "../Messages/ErrorMsg"

export const ShowSalesContext = createContext(null)

const ShowSales = () => {
  const dispatch = useDispatch();
  const [showSuccessMsg, setShowSuccessMsg] = useState(false)
  const [clientDataToEdit, setClientDataToEdit] = useState({});
  const [selectedOrder, setSelectedOrder] = useState("")

  const [showInfo, setShowInfo] = useState(false);
  const [name, setName] = useState("");
  const [checkTotal, setCheckTotal] = useState(true);
  const [checkPartiel, setCheckPartiel] = useState(false);

  const [clientId, setClientId] = useState("");
  const [amountPayed, setAmountPayed] = useState("");

  const [selectedCat, setSelectedCat] = useState("");

  const [errorSales, setErrorSales] = useState(false);
  const [modalErrorSales, setModalErrorSales] = useState(false);
  const [errorPurchases, setErrorPurchases] = useState(false);
  const [modalErrorPurchases, setModalErrorPurchases] = useState(false);
  const [errorConsumptions, setErrorConsumptions] = useState(false);
  const [modalErrorConsumptions, setModalErrorConsumptions] = useState(false);
  
  const [errors, setErrors] = useState([])


  useEffect(() => {
    const fetchSales = async () => {
      const response = await dispatch(getSales())
      if(response === true) {
        if(localStorage.getItem("orderStatus") === "Edit") {
          await dispatch(clearCartApi)
        }
        localStorage.setItem("orderStatus", "Add")
        setModalErrorSales(false)
        setErrorSales("")
      } else {
        setModalErrorSales(true)
        setErrorSales(response)
      }
    }
    fetchSales();

    // START Sales
    const fetchProducts = async () => {
      const response = await dispatch(getProducts("/menuProduct"))
      if(response === true) {
        setModalErrorPurchases(false)
        setErrorPurchases("")
      } else {
        setModalErrorPurchases(true)
        setErrorPurchases(response)
      }
    }
    fetchProducts();
    // END Sales
    
    // START Categories
    const fetchCats = async () => {
      const response = await dispatch(getCategories("/menuCats"))
      if(response === true) {
        setModalErrorConsumptions(false)
        setErrorConsumptions("")
      } else {
        setModalErrorConsumptions(true)
        setErrorConsumptions(response)
      }
    }
    fetchCats();
    // END Categories
  }, [dispatch])



  return (
    <div className='w-full grid grid-cols-3'>
      {errorSales && <ErrorMsg error={errorSales} modal={modalErrorSales} toggle={() => setModalErrorSales(!modalErrorSales)} />}
      {errorPurchases && <ErrorMsg error={errorPurchases} modal={modalErrorPurchases} toggle={() => setModalErrorPurchases(!modalErrorPurchases)} />}
      {errorConsumptions && <ErrorMsg error={errorConsumptions} modal={modalErrorConsumptions} toggle={() => setModalErrorConsumptions(!modalErrorConsumptions)} />}
      <ShowSalesContext.Provider 
        value={{ 
          setShowSuccessMsg,
          clientDataToEdit, 
          setClientDataToEdit,
          selectedOrder, setSelectedOrder,

          showInfo,
          setShowInfo,
          name,
          setName,
          checkTotal,
          setCheckTotal,
          checkPartiel,
          setCheckPartiel,
          clientId,
          setClientId,
          amountPayed,
          setAmountPayed,
          
          selectedCat, setSelectedCat,
          errors, setErrors
          
        }}>
        {showSuccessMsg && <SuccessMsg modal={showSuccessMsg} toggle={() => setShowSuccessMsg(!showSuccessMsg)}/>}
        <div className="col-span-2">
          <OrderList />
          <CategoryList />
          <Menu />
        </div>
        <div className="col-span-1">
          <ShowCart />
        </div>
      </ShowSalesContext.Provider>
    </div>
  )
}

export default ShowSales
