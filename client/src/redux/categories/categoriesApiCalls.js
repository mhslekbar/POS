import {
  statusCategoriesStart,
  statusCategoriesSuccess,
  statusCategoriesFailure
} from "./categoriesRedux";

import { get, post, put, remove } from "../../requestMethods";

export const getCategories = (filter) => async (dispatch) => {
  try {
    dispatch(statusCategoriesStart())
    let response
    if(filter) {
      response = await get(`/category${filter}`);      
    } else {
      response = await get(`/category`);
    }
    const resData  = response.data.success
    if(resData) {
      dispatch(statusCategoriesSuccess(resData))
      return true
    }
  } catch(err) {
    const errData = err.response.data
    if(errData && err.response.status === 300) {
      const formErrors = errData.formErrors ? errData.formErrors : [errData]
      dispatch(statusCategoriesFailure(formErrors))
      return formErrors
    } else {
      dispatch(statusCategoriesFailure(errData.err))
      return [errData.err]
    }
  }
}

export const addCategory = (category) => async (dispatch) => {
  try {
    dispatch(statusCategoriesStart())
    const response = await post(`/category`, category);
    const resData  = response.data.success
    if(resData) {
      dispatch(statusCategoriesSuccess(resData))
      return true
    }
  } catch(err) {
    const errData = err.response.data
    if(errData && err.response.status === 300) {
      const formErrors = errData.formErrors ? errData.formErrors : [errData]
      dispatch(statusCategoriesFailure(formErrors))
      return formErrors
    } else {
      dispatch(statusCategoriesFailure(errData.err))
      return [errData.err]
    }
  }
}

export const editCategory = (catId, category) => async (dispatch) => {
  try {
    dispatch(statusCategoriesStart())
    const response = await put(`/category/${catId}`, category);
    const resData  = response.data.success
    if(resData) {
      dispatch(statusCategoriesSuccess(resData))
      return true
    }
  } catch(err) {
    const errData = err.response.data
    if(errData && err.response.status === 300) {
      const formErrors = errData.formErrors ? errData.formErrors : [errData]
      dispatch(statusCategoriesFailure(formErrors))
      return formErrors
    } else {
      dispatch(statusCategoriesFailure(errData.err))
      return [errData.err]
    }
  }
}

export const deleteCategory = (catId) => async (dispatch) => {
  try {
    dispatch(statusCategoriesStart())
    const response = await remove(`/category/${catId}`);
    const resData  = response.data.success
    if(resData) {
      dispatch(statusCategoriesSuccess(resData))
      return true
    }
  } catch(err) {
    const errData = err.response.data
    if(errData && err.response.status === 300) {
      const formErrors = errData.formErrors ? errData.formErrors : [errData]
      dispatch(statusCategoriesFailure(formErrors))
      return formErrors
    } else {
      dispatch(statusCategoriesFailure(errData.err))
      return [errData.err]
    }
  }
}

export const clearCategoryApi = (dispatch) => {
  dispatch(statusCategoriesSuccess([]))
}