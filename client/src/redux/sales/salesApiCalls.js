import { 
  getSaleStart,
  getSaleSuccess,
  getSaleFailure,
  createNewSale,
  removeSale,
  appendSale
} from "./salesRedux";

import { get, post, put, remove } from "../../requestMethods";

export const getSales = (search = null) => async (dispatch) => {
  try {
    dispatch(getSaleStart())
    let response
    if(search) {
      response = await get(`/sale${search}`)
    }else {
      response = await get(`/sale`)
    }
    const resData  = response.data.success
    if(resData) {
      await dispatch(getSaleSuccess(resData))
      return true;
    }
  } catch (err) {
    const errData = err.response.data
    if(errData && err.response.status === 300) {
      await dispatch(getSaleFailure(errData))
      return [errData]
    } else {
      dispatch(getSaleFailure(errData.err))
      return [errData.err]
    }
  }
}

export const createSaleApi = (newSale) => async (dispatch) => {
  try {
    const response = await post(`/sale`, newSale)
    const resData  = response.data.success
    if(resData) {
      await dispatch(createNewSale(resData))
      return true
    }
  } catch (err) {
    const errData = err.response.data
    if(errData && err.response.status === 300) {
      return errData?.formErrors ? errData.formErrors : [errData]
    } else {
      return [errData.err]
    }
  }
}

export const removeSaleApi = (saleId) => async (dispatch) => {
  try {
    const response = await remove(`/sale/${saleId}`);
    const resData  = response.data.success
    if(resData) {
      await dispatch(removeSale(saleId))
      return true
    }
  } catch(err) {
    const errData = err.response.data
    if(errData && err.response.status === 300) {
      return errData?.formErrors ? errData.formErrors : [errData]
    } else {
      return [errData?.err]
    }
  }
}

export const appendSaleApi = (saleId, LineSale) => async (dispatch) => {
  try {
    const response = await put(`/sale/${saleId}/append`, {LineSale});
    const resData  = response.data.success
    if(resData) {
      dispatch(appendSale(resData))
      return {res: true, resData, saleId}
    }
  } catch(err) {
    const errData = err.response.data
    if(errData && err.response.status === 300) {
      return errData?.formErrors ? errData.formErrors : [errData]
    } else {
      return [errData.err]
    }
  }
}

export const editSaleApi = (saleId, data) => async (dispatch) => {
  try {
    const response = await put(`/sale/${saleId}`, data)
    const resData = response.data.success
    if(resData) {
      dispatch(appendSale(resData))
      return true
    }
  }catch (err) {
    const errData = err.response.data
    if(errData && err.response.status === 300) {
      return errData?.formErrors ? errData.formErrors : [errData]
    } else {
      return [errData.err]
    }
  }
}

export const clearSales = (dispatch) => {
  dispatch(getSaleSuccess([]))
}