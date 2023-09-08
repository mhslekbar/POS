import React, { createContext,  useState } from 'react'
import LeftPart from "../components/rightPart/RightPart";
import RightPart from "../components/leftPart/LeftPart";
// import { useDispatch } from 'react-redux';
// import { getPurchase } from '../redux/purchases/purchaseApiCalls';
// import { getClients } from '../redux/client/clientApiCalls';
// import { getConsumptionsApi } from '../redux/consumption/consApiCalls';
// import { getRolesApi } from "../redux/roles/roleApiCalls";
// import { getSales } from '../redux/sales/salesApiCalls';
// import { getSuppliers } from '../redux/supplier/supplierApiCalls';
// import { getUsers } from '../redux/user/userApiCalls';
// import { getCategories } from '../redux/categories/categoriesApiCalls';
// import { getProducts } from '../redux/product/productApiCalls';

export const DashBoadContext = createContext(null)

const Dashboard = () => {
  const [sumSales, setSumSales] = useState(0);
  const [sumLineDetails, setSumLineDetails] = useState(0);
  const [sumPurchases, setSumPurchases] = useState(0);
  const [day, setDay] = useState((new Date()).getDate());
  const [month, setMonth] = useState((new Date()).getMonth() + 1);
  const [year, setYear] = useState((new Date()).getFullYear());
  
  // const dispatch = useDispatch()
  
  // useEffect(() => {
  //   const fetchAlowedCollection = async () => {
  //     try {
  //       await dispatch(getCategories)
  //       await dispatch(getClients())
  //       await dispatch(getConsumptionsApi())
  //       await dispatch(getProducts())
  //       await dispatch(getPurchase())
  //       await dispatch(getRolesApi)
  //       await dispatch(getSales())
  //       await dispatch(getSuppliers())
  //       await dispatch(getUsers)
  //     } catch {}
  //   }
  //   fetchAlowedCollection();
  // })


  return (
    <DashBoadContext.Provider value={{
      sumSales, setSumSales,
      sumLineDetails, setSumLineDetails,
      sumPurchases, setSumPurchases,
      day, setDay,
      month, setMonth,
      year, setYear
    }}>

    <div className="grid grid-cols-1 xl:grid-cols-5 w-full col-span-10">
        <RightPart /> 
        <LeftPart />
    </div>
    </DashBoadContext.Provider>

  )
}

export default Dashboard
