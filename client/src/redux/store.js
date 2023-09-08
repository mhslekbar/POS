import { configureStore, combineReducers } from "@reduxjs/toolkit";
import loginReducer       from "./login/loginRedux";
import userReducer        from "./user/userRedux";
import supplierReducer    from "./supplier/supplierRedux"
import clientReducer      from "./client/clientRedux"
import purchaseReducer    from "./purchases/purchaseRedux";
import salesReducer       from "./sales/salesRedux";
import categoriesReducer  from "./categories/categoriesRedux";
import productReducer     from "./product/productRedux";
import cartReducer        from "./cart/cartRedux";
import roleReducer        from "./roles/roleRedux";
import consumptionReducer from "./consumption/consRedux";
import permissionSlice        from "./permissions/permissionRedux";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const rootReducer = combineReducers({ 
    login: loginReducer,
    users: userReducer,
    suppliers: supplierReducer,
    clients: clientReducer,
    purchases: purchaseReducer,
    sales :salesReducer,
    categories: categoriesReducer,
    products: productReducer,
    cart: cartReducer,
    roles: roleReducer,
    consumptions: consumptionReducer,
    permissions: permissionSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, 'permissions/statusPermissionSuccess'],
      },
    }),
});

export let persistor = persistStore(store);
