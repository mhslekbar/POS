import {
  CogOutline,
  LogoutOutline,
  ShoppingCartOutline,
  TemplateOutline,
  UserGroupOutline,
  UserOutline
} from "heroicons-react";

import { AiOutlineShopping } from 'react-icons/ai';
import { BiCategory } from "react-icons/bi";
import { RiUserSettingsLine } from 'react-icons/ri';

export const navLinks = [
  {
    id: 0,
    title: "Dashboard",
    to: "/",
    icon: <TemplateOutline className="nav-icon" />,
    permission: "SHOW_STATS",
  },
  {
    id: 1,
    title: "Categories",
    to: "/category",
    icon: <BiCategory  className="nav-icon" />,
    permission: "SHOW_CATEGORIES",
  },
  {
    id: 2,
    title: "Produits",
    to: "/products",
    icon: <AiOutlineShopping  className="nav-icon" />,
    permission: "SHOW_PRODUCTS",
  },
  {
    id: 3,
    title: "Achats",
    to: "/purchases",
    icon: <ShoppingCartOutline className="nav-icon" />,
    permission: "SHOW_PURCHASES",
  },
  {
    id: 4,
    title: "Orders",
    to: "/sales",
    icon: <img src="/assets/imgs/seller-icon.png" alt="seller-icon" className="nav-icon" />,
    permission: "SHOW_SALES",
  },
  {
    id: 5,
    title: "users",
    to: "/users",
    icon: <UserOutline className="nav-icon" />,
    permission: "SHOW_USERS",
  },
  {
    id: 6,
    title: "roles",
    to: "/groups",
    icon: <RiUserSettingsLine className="nav-icon" />,
    permission: "SHOW_ROLES",
    // icon: <UserGroupOutline className="nav-icon" />,
  },
  {
    id: 7,
    title: "Fournisseurs",
    to: "/suppliers",
    icon: <img src="/assets/imgs/supplier.png" className="nav-icon" alt="supplier-icon" />,
    permission: "SHOW_SUPPLIERS",
    // icon: <UserGroupOutline className="nav-icon" />,
  },
  {
    id: 8,
    title: "Clients",
    to: "/clients",
    icon: <UserGroupOutline className="nav-icon" />,
    permission: "SHOW_CLIENTS",
  },
  {
    id: 9,
    title: "Consommation",
    to: "/consumption",
    icon: <img src="/assets/imgs/consumption.png" alt="consumption-icon" className="nav-icon" />,
    permission: "SHOW_CONSUMPTIONS",
  },
  {
    id: 10,
    title: "Settings",
    to: "/settings",
    icon: <CogOutline className="nav-icon" />,
    permission: "SHOW_DEFAULT",
  },
  {
    id: 11,
    title: "LogOut",
    icon: <LogoutOutline className="nav-icon" />,
    to: "logout",
    permission: "SHOW_DEFAULT",
  },
];
