import { Routes, Route } from "react-router-dom";
import Users from "../pages/Users";
import ProtectedRoutes from "./ProtectedRoutes";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Groups from "../pages/Groups";
import NotFound from "../pages/NotFound";
import Products from "../pages/Products";
import Suppliers from "../pages/Suppliers";
import Clients from "../pages/Clients";
import Purchases from "../pages/Purchases";
import Sales from "../pages/Sales";
import Categories from "../pages/Categories";
import Consumption from "../pages/Consumption";

const MyRoutes = () => {
  return (<Routes>
    <Route element={<ProtectedRoutes />}>
      <Route exact path="/" element={<Dashboard />}/>
      <Route path="/users" element={<Users />}/>
      <Route path="/groups" element={<Groups />}/>
      <Route path="/category" element={<Categories />}/>
      <Route path="/products" element={<Products />}/>
      <Route path="/suppliers" element={<Suppliers />}/>
      <Route path="/clients" element={<Clients />}/>
      <Route path="/purchases" element={<Purchases />}/>
      <Route path="/sales" element={<Sales />}/>
      <Route path="/consumption" element={<Consumption />}/>
      <Route path="/login" element={<Login />}/>
      <Route path="/logout" element={<Login />}/>
      <Route path="*" element={<NotFound />}/>
    </Route>
  </Routes>)
}

export default MyRoutes;