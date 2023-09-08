import { get, post, put, remove } from "../../requestMethods";
import { statusRoleStart, statusRoleSuccess, statusRoleFailure } from "./roleRedux"

export const getRolesApi = async (dispatch) => {
  try {
    dispatch(statusRoleStart())
    const response = await get(`/group?timestamp=${Date.now()}`)
    const resData  = response.data.success
    // console.log("resData role : ", resData)
    if(resData) {
      dispatch(statusRoleSuccess(resData))
      return true
    }
  } catch (err) {
    // console.log("err role : ", err)
    const errData = err.response.data
    if(errData && err.response.status === 300) {
      const formErrors = errData.formErrors ? errData.formErrors : [errData]
      dispatch(statusRoleFailure(formErrors))
      return formErrors
    } else {
      dispatch(statusRoleFailure(errData))
      return [errData]
    }
  }
}

export const AddRoleApi = (role) => async (dispatch) => {
  try {
    dispatch(statusRoleStart())
    const response = await post("/group", role)
    const resData  = response.data.success
    if(resData) {
      dispatch(statusRoleSuccess(resData))
      return true
    }
  } catch (err) {
    const errData = err.response.data
    if(errData && err.response.status === 300) {
      const formErrors = errData.formErrors ? errData.formErrors : [errData]
      dispatch(statusRoleFailure(formErrors))
      return formErrors
    } else {
      dispatch(statusRoleFailure(errData))
      return [errData]
    }
  }
}

export const EditRoleApi = (roleId, role) => async (dispatch) => {
  try {
    dispatch(statusRoleStart())
    const response = await put(`/group/${roleId}`, role)
    const resData  = response.data.success
    if(resData) {
      dispatch(statusRoleSuccess(resData))
      return true
    }
  } catch (err) {
    const errData = err.response.data
    if(errData && err.response.status === 300) {
      const formErrors = errData.formErrors ? errData.formErrors : [errData]
      dispatch(statusRoleFailure(formErrors))
      return formErrors
    } else {
      dispatch(statusRoleFailure(errData))
      return [errData]
    }
  }
}

export const DeleteRoleApi = (roleId) => async (dispatch) => {
  try {
    dispatch(statusRoleStart())
    const response = await remove(`/group/${roleId}`)
    const resData  = response.data.success
    if(resData) {
      dispatch(statusRoleSuccess(resData))
      return true
    }
  } catch (err) {
    const errData = err.response.data
    if(errData && err.response.status === 300) {
      const formErrors = errData.formErrors ? errData.formErrors : [errData]
      dispatch(statusRoleFailure(formErrors))
      return formErrors
    } else {
      dispatch(statusRoleFailure(errData))
      return [errData]
    }
  }
}

export const clearRolesApi = (dispatch) => {
  dispatch(statusRoleSuccess([]))
}