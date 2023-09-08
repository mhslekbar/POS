import { 
  loginFailure, 
  loginStart, 
  loginSuccess, 
  logoutSuccess, 
  refreshLogin
} from "./loginRedux";
import { publicRequest, post } from "../../requestMethods";
import { persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { store } from "../store";


export const login = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    const res = await publicRequest.post("/auth/login", user);
    if(res.data.formErrors) {
      await dispatch(loginFailure(res.data.formErrors));
    }else {
      await dispatch(loginSuccess(res.data.success));
    }
  } catch (err) {
    dispatch(loginFailure(err.message));
  }
};

export const logout = (token) => async (dispatch) => {
  try {
    await post("/auth/logout", {token})
    dispatch(logoutSuccess())
    persistStore(store, null, () => {
      storage.removeItem('persist:root');
    }).purge()
  } catch (err) {
    console.log("err logout: ", err)
  }
};

export const refreshLoginApi = (userData) => async (dispatch) => {
  await dispatch(refreshLogin(userData))

}