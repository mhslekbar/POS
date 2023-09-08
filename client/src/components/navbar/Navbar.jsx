import React, { useEffect, useState } from "react";
import { navLinks } from "./NavLinks";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../redux/login/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import { UserData } from "../../requestMethods";
import { clearUsers } from "../../redux/user/userApiCalls";
import { clearSupplierApi } from "../../redux/supplier/supplierApiCalls"
import { clearSales } from "../../redux/sales/salesApiCalls"
import { clearPurchase } from "../../redux/purchases/purchaseApiCalls"
import { clearRolesApi } from "../../redux/roles/roleApiCalls";
import { clearProducts } from "../../redux/product/productApiCalls";
import { clearConsumptionsApi } from "../../redux/consumption/consApiCalls";
import { clearClients } from "../../redux/client/clientApiCalls";
import { clearCategoryApi } from "../../redux/categories/categoriesApiCalls";
import { 
  // clearPermissions, 
  getPermissionsApi } from "../../redux/permissions/permissionApiCalls";

const Navbar = () => {
  const { permissions } = useSelector(state => state.permissions);
  const [allowedLinks, setAllowedLinks] = useState([])

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await dispatch(logout(UserData()?.accessToken));
      await dispatch(clearUsers)
      await dispatch(clearSupplierApi)
      await dispatch(clearSales)
      await dispatch(clearPurchase)
      await dispatch(clearRolesApi)
      await dispatch(clearProducts)
      await dispatch(clearConsumptionsApi)
      await dispatch(clearClients)
      await dispatch(clearCategoryApi)
      // await dispatch(clearPermissions)
      navigate("/login", { replace: true });
    } catch(err) { 
      console.log("err jsx login : ", err)
    }
  };

  useEffect(() => {
    const fetchPermissions = async () => {
      await dispatch(getPermissionsApi(`?userId=${UserData()?._id}`))
    }
    fetchPermissions()
  }, [dispatch])

  useEffect(() => {
    let arrLinks = []
    for(let link of navLinks) {
      for(let perm of permissions) {
        if(perm.permissionName === link.permission || link.permission === "SHOW_DEFAULT") {
          arrLinks.push(link)
          break;
        }
      }
    }
    setAllowedLinks(arrLinks)
  }, [permissions])

  const location = useLocation()

  return (
    <nav className="col-span-2 border-r border-gray-200 min-h-[90vh] w-[80px] xl:w-[250px] pt-8 px-1 flex flex-col items-start justify-between bg-white">
      <div className="space-y-8 w-full">
        {allowedLinks.map((link, index) => {
          
          return (
            <div key={link.id}>
              {allowedLinks.length - index === 2 && (
                <div className="w-full border-t border-gray-200 mb-2" />
              )}
              <Link
                className={`${ location.pathname === link.to ? "border-gray-900" : "border-transparent"
                } w-full flex items-center justify-start space-x-8 px-5 cursor-pointer group hover:border-gray-900 border-l-4`}
                title={link.title}
                onClick={link.to === "logout" && handleLogout} 
                to={link.to}
              >
                <span>{link.icon}</span>
                <b className="text-gray-600 group-hover:text-black xl:flex hidden">
                  {link.title}
                </b>
              </Link>
            </div>
          )
        })}
      </div>

    </nav>
  );
};

export default Navbar;