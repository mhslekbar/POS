import { get, post, put, remove } from "../../requestMethods";
import {  
  statusUserStart, 
  statusUsersSuccess, 
  statusUsersFailure 
} from "./userRedux";

export const getUsers = async (dispatch) => {
  dispatch(statusUserStart());
  try {
    const res = await get("/user");
    if(res.data.success) {
      dispatch(statusUsersSuccess(res.data.success));
      return true
    }
  } catch (err){
    const errData = err.response?.data
    if(errData && err.response.status === 300) {
      const formErrors = errData.formErrors ? errData.formErrors : [errData]
      dispatch(statusUsersFailure(formErrors));
      return formErrors
    } else {
      dispatch(statusUsersFailure(errData.err));
      return [errData.err]
    }
  }
}

export const AddUserApi = (data) => async (dispatch) => {
  dispatch(statusUserStart());
  try {
    const res = await post("/user", data);
    if(res.data.success) {
      dispatch(statusUsersSuccess(res.data.success));
      return true
    }
  } catch (err){
    const errData = err.response.data
    if(errData && err.response.status === 300) {
      const formErrors = errData.formErrors ? errData.formErrors : [errData]
      dispatch(statusUsersFailure(formErrors));
      return formErrors
    } else {
      dispatch(statusUsersFailure(errData.err));
      return [errData.err]
    }
  }
}

export const EditUserApi = (userId, data) => async (dispatch) => {
  dispatch(statusUserStart());
  try {
    const res = await put(`/user/${userId}`, data);
    if(res.data.success) {
      dispatch(statusUsersSuccess(res.data.success));
      return true
    }
  } catch (err){
    const errData = err.response.data
    if(errData && err.response.status === 300) {
      const formErrors = errData.formErrors ? errData.formErrors : [errData]
      dispatch(statusUsersFailure(formErrors));
      return formErrors
    } else {
      dispatch(statusUsersFailure(errData.err));
      return [errData.err]
    }
  }
}

export const DeleteUserApi = (userId) => async (dispatch) => {
  dispatch(statusUserStart());
  try {
    const res = await remove(`/user/${userId}`);
    if(res.data.success) {
      dispatch(statusUsersSuccess(res.data.success));
      return true
    }
  } catch (err){
    const errData = err.response.data
    if(errData && err.response.status === 300) {
      const formErrors = errData.formErrors ? errData.formErrors : [errData]
      dispatch(statusUsersFailure(formErrors));
      return formErrors
    } else {
      dispatch(statusUsersFailure(errData.err));
      return [errData.err]
    }
  }
}

export const clearUsers = (dispatch) => {
  dispatch(statusUsersSuccess([]));
}
