import { 
  statusConsumptionStart,
  statusConsumptionSuccess,
  statusConsumptionFailure 
} from "./consRedux";

import { get, post, put, remove } from "../../requestMethods"

export const getConsumptionsApi = (filter = null) => async (dispatch) => {
  try {
    dispatch(statusConsumptionStart())
    let response
    if(filter) {
      response = await get(`/consumption${filter}`);
    } else {
      response = await get(`/consumption`);
    }
    const resData = response.data.success
    if(resData) {
      dispatch(statusConsumptionSuccess(resData))
      return true
    }
  } catch (err) {
    const errData = err.response.data
    if(errData && err.response.status === 300) {
      const formErrors = errData.formErrors ? errData.formErrors : [errData] 
      dispatch(statusConsumptionFailure(formErrors))
      return formErrors
    } else {
      dispatch(statusConsumptionFailure(errData))
      return [errData]
    }
  }
}

export const addConsumptionApi = (data) => async (dispatch) => {
  try {
    dispatch(statusConsumptionStart())
    const response = await post(`/consumption`, data);
    const resData = response.data.success
    if(resData) {
      dispatch(statusConsumptionSuccess(resData))
      return true
    }
  } catch (err) {
    const errData = err.response.data
    if(errData && err.response.status === 300) {
      const formErrors = errData.formErrors ? errData.formErrors : [errData] 
      dispatch(statusConsumptionFailure(formErrors))
      return formErrors
    } else {
      dispatch(statusConsumptionFailure(errData))
      return [errData]
    }
  }
}

export const editConsumptionApi = (consId, data) => async (dispatch) => {
  try {
    dispatch(statusConsumptionStart())
    const response = await put(`/consumption/${consId}`, data);
    const resData = response.data.success
    if(resData) {
      dispatch(statusConsumptionSuccess(resData))
      return true
    }
  } catch (err) {
    const errData = err.response.data
    if(errData && err.response.status === 300) {
      const formErrors = errData.formErrors ? errData.formErrors : [errData] 
      dispatch(statusConsumptionFailure(formErrors))
      return formErrors
    } else {
      dispatch(statusConsumptionFailure(errData))
      return [errData]
    }
  }
}

export const deleteConsumptionApi = (consId, data) => async (dispatch) => {
  try {
    dispatch(statusConsumptionStart())
    const response = await remove(`/consumption/${consId}`);
    const resData = response.data.success
    if(resData) {
      dispatch(statusConsumptionSuccess(resData))
      return true
    }
  } catch (err) {
    const errData = err.response.data
    if(errData && err.response.status === 300) {
      const formErrors = errData.formErrors ? errData.formErrors : [errData] 
      dispatch(statusConsumptionFailure(formErrors))
      return formErrors
    } else {
      dispatch(statusConsumptionFailure(errData))
      return [errData]
    }
  }
}

export const clearConsumptionsApi = (dispatch) => {
  dispatch(statusConsumptionSuccess([]))
}