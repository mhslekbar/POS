import {
  getPurchaseStart,
  getPurchaseSuccess,
  getPurchaseFailure,
  addPurchaseStart,
  addPurchaseSuccess,
  addPurchaseFailure,
  deletePurchaseStart,
  deletePurchaseSuccess,
  deletePurchaseFailure,
  deleteProductFromPurchaseStart,
  deleteProductFromPurchaseSuccess,
  deleteProductFromPurchaseFailure,
  supplyPurchaseStart,
  supplyPurchaseSuccess,
  supplyPurchaseFailure,
  updatePurchaseStart,
  updatePurchaseSuccess,
  updatePurchaseFailure
} from "./purchaseRedux";
import { get, post, put, remove } from "../../requestMethods";

export const getPurchase = (search = null) => async (dispatch) => {
  try {
    dispatch(getPurchaseStart())
    let response
    if(search) {
      response = await get(`/purchase${search}`);
    } else {
      response = await get("/purchase");
    }
    const resData = response.data.success
    if(resData) {
      dispatch(getPurchaseSuccess(resData))
      return true
    } 
  }catch (err) {
    const errData = err.response.data
    const formErrors = errData.formErrors ? errData.formErrors : [errData]
    if(err.response && err.response.status === 300) {
      dispatch(getPurchaseFailure(formErrors))
      return formErrors
    } else {
      dispatch(getPurchaseFailure(errData.err))
      return [errData.err]
    }
  }
}

export const addPurchase = (purchase) => async (dispatch) => {
  try {
    dispatch(addPurchaseStart())
    const response = await post("/purchase", purchase)
    const resData = response.data.success
    if(resData) {
      dispatch(addPurchaseSuccess(resData))
      return true
    }
  }catch (err) {
    const errData = err.response.data
    const formErrors = errData.formErrors ? errData.formErrors : [errData]
    if(errData && err.response.status === 300) {
      dispatch(addPurchaseFailure(formErrors))
      return formErrors
    } else {
      dispatch(addPurchaseFailure(errData.err))
      return [errData.err]
    }
  }
}

export const deletePurchase = (purchaseId) => async (dispatch) => {
  try {
    dispatch(deletePurchaseStart()) 
    const response = await remove(`/purchase/${purchaseId}`)
    const resData = response.data.success
    if(resData) {
      dispatch(deletePurchaseSuccess(purchaseId))
      return true
    }
  } catch (err) {
    const errData = err.response.data
    const formErrors = errData.formErrors ? errData.formErrors : [errData]
    if(errData && err.response.status === 300) {
      dispatch(deletePurchaseFailure(formErrors))
      return formErrors
    } else {
      dispatch(deletePurchaseFailure(errData.err))
      return [errData.err]
    }
  }
} 

export const deleteProductFromPurchase = (purchaseId, idLinePurchase) => async (dispatch) => {
  try {
    dispatch(deleteProductFromPurchaseStart())
    const response = await remove(`/purchase/${purchaseId}/LinePurchase/${idLinePurchase}`)
    const resData = await response.data.success
    if(resData) {
      dispatch(deleteProductFromPurchaseSuccess(resData))
      return true
    }
  } catch(err) {
    const errData = err.response.data
    const formErrors = errData.formErrors ? errData.formErrors : [errData]
    if(errData && err.response.status === 300) {
      dispatch(deleteProductFromPurchaseFailure(formErrors))
      return formErrors
    } else {
      dispatch(deleteProductFromPurchaseFailure(errData.err))
      return [errData.err]
    }
  }
}

export const supplyPurchase = (purchaseId, data) => async (dispatch) => {
  try {
    dispatch(supplyPurchaseStart())
    const response = await put(`/purchase/${purchaseId}/supply`, data);
    const resData = await response.data.success
    if(resData) {
      dispatch(supplyPurchaseSuccess(resData))
      return true
    }
  } catch (err) {
    const errData = err.response.data
    const formErrors = errData.formErrors ? errData.formErrors : [errData]
    if(errData && err.response.status === 300) {
      dispatch(supplyPurchaseFailure(formErrors))
      return formErrors
    } else {
      dispatch(supplyPurchaseFailure(errData.err))
      return [errData.err]
    }
  }
}

export const updatePurchase = (purchaseId, data) => async (dispatch) => {
  try {
    dispatch(updatePurchaseStart())
    const response = await put(`/purchase/${purchaseId}`, data)
    const resData = response.data.success
    if(resData) {
      dispatch(updatePurchaseSuccess(resData))
      return true
    }
  } catch (err) {
      const errData = err.response.data
      const formErrors = errData.formErrors ? errData.formErrors : [errData]
      if(errData && err.response.status === 300) {
        dispatch(updatePurchaseFailure(formErrors))
        return formErrors
      } else {
        dispatch(updatePurchaseFailure(errData.err))
        return [errData.err]
      }
  }
}

export const clearPurchase = (dispatch) => {
  dispatch(getPurchaseSuccess([]))
}

