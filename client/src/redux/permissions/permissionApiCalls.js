import { statusPermissionStart, statusPermissionSuccess, statusPermissionFailure } from "./permissionRedux";
import { get } from "../../requestMethods"

export const getPermissionsApi = (filter) => async (dispatch) => {
  try {
    dispatch(statusPermissionStart())
    let response
    if(filter) {
      response = await get(`/permission${filter}`)
    } else {
      response = await get(`/permission`)
    }
    const resData = response.data.success 
    if(resData) {
      dispatch(statusPermissionSuccess(resData))
      return true
    }
  } catch (err) {
    const errData = err.response.data
    if(errData && err.response.status === 300) {
      const formErrors = errData.formErrors ? errData.formErrors : [errData]
      dispatch(statusPermissionFailure(formErrors))
      return formErrors
    } else {
      dispatch(statusPermissionFailure(errData))
      return [errData]
    }
  }
}

export const clearPermissions = (dispatch) => {
  dispatch(statusPermissionSuccess([]))
}