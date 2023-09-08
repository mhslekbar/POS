import {
  statusProductStart,
  statusProductSuccess,
  statusProductFailure
} from "./productRedux";
import { get, post, put, remove } from "../../requestMethods";

export const getProducts = (search = null) => async (dispatch) => {
  try {
    dispatch(statusProductStart())
    let response
    if(search) {
      response = await get(`/product${search}`);
    } else {
      response = await get(`/product`);
    }
    const resData  = response.data.success
    if(resData) {
      dispatch(statusProductSuccess(resData))
      return true
    }
  } catch(err) {
    const errData = err.response.data
    const formErrors = errData.formErrors ? errData.formErrors : [errData]
    if(errData && err.response?.status === 300) {
      dispatch(statusProductFailure(formErrors))
      return formErrors
    } else {
      dispatch(statusProductFailure(errData.err))
      return [errData.err]
    }
  }
}

export const AddProductApi = (data) => async (dispatch) => {
  try {
    dispatch(statusProductStart())
    const response = await post("/product", data);
    const resData  = response.data.success
    if(resData) {
      dispatch(statusProductSuccess(resData))
      return true
    }
  } catch(err) {
    const errData = err.response.data
    const formErrors = errData.formErrors ? errData.formErrors : [errData]
    if(errData && err.response?.status === 300) {
      dispatch(statusProductFailure(formErrors))
      return formErrors
    } else {
      dispatch(statusProductFailure(errData.err))
      return [errData.err]
    }
  }
}

export const EditProductApi = (productId, data) => async (dispatch) => {
  try {
    dispatch(statusProductStart())
    const response = await put(`/product/${productId}`, data);
    const resData  = response.data.success   
    if(resData) {
      dispatch(statusProductSuccess(resData))
      return true
    }
  } catch(err) {
    const errData = err.response?.data
    const formErrors = errData?.formErrors ? errData.formErrors : [errData]
    if(errData && err.response?.status === 300) {
      dispatch(statusProductFailure(formErrors))
      return formErrors
    } else {
      dispatch(statusProductFailure(errData.err))
      return [errData.err]
    }
  }
}

export const deleteProduct = (productId) => async (dispatch) => {
  try {
    dispatch(statusProductStart())
    const response = await remove(`/product/${productId}`);
    const resData  = response.data.success
    if(resData) {
      dispatch(statusProductSuccess(resData))
      return true
    }
  } catch(err) {
    const errData = err.response.data
    const formErrors = errData.formErrors ? errData.formErrors : [errData]
    if(errData && err.response?.status === 300) {
      dispatch(statusProductFailure(formErrors))
      return formErrors
    } else {
      dispatch(statusProductFailure(errData.err))
      return [errData.err]
    }
  }
}

export const clearProducts = (dispatch) => {
  dispatch(statusProductSuccess([]))
}