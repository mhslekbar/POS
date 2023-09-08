import { get, post, put, remove } from "../../requestMethods";
import { 
  getSupplierStart,
  getSupplierSuccess,
  getSupplierFailure,
  addSupplierStart,
  addSupplierSuccess,
  addSupplierFailure,
  editSupplierStart,
  editSupplierSuccess,
  editSupplierFailure,
  deleteSupplierStart,
  deleteSupplierSuccess,
  deleteSupplierFailure,
  
  getSupplierPaymentStart,
  getSupplierPaymentSuccess,
  getSupplierPaymentFailure,
  
  addSupplierPaymentStart,
  addSupplierPaymentSuccess,
  addSupplierPaymentFailure,
  
  editSupplierPaymentStart,
  editSupplierPaymentSuccess,
  editSupplierPaymentFailure,

  deleteSupplierPaymentStart,
  deleteSupplierPaymentSuccess,
  deleteSupplierPaymentFailure,
  
} from "./supplierRedux"

export const getSuppliers = (search = null) => async (dispatch) => {
  try {
    dispatch(getSupplierStart())
    let res
    if(search) {
      res = await get(`/supplier${search}`);
    } else {
      res = await get("/supplier");
    }
    if(res.data.success) {
      dispatch(getSupplierSuccess(res.data.success))
      return true
    }
  } catch (err) {
    const errData = err.response.data
    const formErrors = errData.formErrors ? errData.formErrors : [errData];
    if(errData && err.response.status === 300) {
      dispatch(getSupplierFailure(formErrors))
      return formErrors
    } else {
      dispatch(getSupplierFailure(errData.err))
      return [errData.err]
    }
  }
}

export const addSupplier = (supplier) => async (dispatch) => {
  try {
    dispatch(addSupplierStart())
    const res = await post("/supplier", supplier)
    if(res.data.success) {
      dispatch(addSupplierSuccess(res.data.success))
      return true
    } 
  } catch (err) {
    const errData = err.response.data
    const formErrors = errData.formErrors ? errData.formErrors : [errData];
    if (errData && err.response.status === 300) {
      dispatch(addSupplierFailure(formErrors));
      return formErrors;
    } else {
      dispatch(addSupplierFailure(errData.err));
      return [errData.err];
    }
  }
}

export const editSupplier = (id, supplier) => async (dispatch) => {
  try {
    dispatch(editSupplierStart())
    const res  = await put(`/supplier/${id}`, supplier);

    if(res.data.success) {
      dispatch(editSupplierSuccess(res.data.success))
      return true
    }
  }catch (err) {
    const errData = err.response.data
    const formErrors = errData.formErrors ? errData.formErrors : [errData];
    if(errData && err.response.status === 300) {
      dispatch(editSupplierFailure(formErrors))
      return formErrors;
    } else {
      dispatch(editSupplierFailure(errData.err))
      return [errData.err];
    }
  }
}

export const deleteSupplier = (id) => async (dispatch) => {
  try {
    dispatch(deleteSupplierStart());
    const res = await remove(`/supplier/${id}`);
    if(res.data.success) {
      dispatch(deleteSupplierSuccess(res.data.success))
      return true
    }
  } catch(err) {
    const errData = err.response.data
    const formErrors = errData.formErrors ? errData.formErrors : [errData];
    if(errData && err.response.status === 300) {
      dispatch(deleteSupplierFailure(formErrors))
      return formErrors;
    } else {
      dispatch(deleteSupplierFailure(errData.err))
      return [errData.err]
    }
  }
}

export const getSuppliersPayment = (id) => async (dispatch) => {
  try {
    dispatch(getSupplierPaymentStart())
    const res = await get(`/supplier/${id}/payment`);
    if(res.data.success) {
      dispatch(getSupplierPaymentSuccess(res.data.success))
    }
  } catch (err) {
    dispatch(getSupplierPaymentFailure(err?.response?.data))
  }
}

export const addSupplierPayment = (id, supplier) => async (dispatch) => {
  try {
    dispatch(addSupplierPaymentStart())
    const res = await post(`/supplier/${id}/payment`, supplier)
    const dataPaym = res.data.success
    if(dataPaym) {
      dispatch(addSupplierPaymentSuccess({id, payment: dataPaym}))
      return true
    }
  } catch(err) {
    const errData = err.response.data
    const formErrors = errData.formErrors ? errData.formErrors : [errData];
    if(errData && err.response.status === 300) {
      dispatch(addSupplierPaymentFailure(formErrors))
      return formErrors;
    } else {
      dispatch(addSupplierPaymentFailure(errData.err))
      return [errData.err]
    }
  } 
}

export const editSupplierPayment = (id, paymentId, payment) => async (dispatch) => {
  try {
    dispatch(editSupplierPaymentStart())
    const res = await put(`/supplier/${id}/payment/${paymentId}`, payment)
    const dataPaym = await res.data.success
    if(dataPaym) {
      dispatch(editSupplierPaymentSuccess({id, paymentId, payment: dataPaym}))
      return true
    }
  } catch(err) {
    const errData = err.response.data
    const formErrors = errData.formErrors ? errData.formErrors : [errData];
    if(err.response && err.response.status === 300) {
      dispatch(editSupplierPaymentFailure(formErrors))
      return formErrors;
    } else {
      dispatch(editSupplierPaymentFailure(errData.err))
      return [errData.err]
    }
  } 
}

export const deleteSupplierPayment = (supplierId, paymentId) => async (dispatch) => {
  try {
    dispatch(deleteSupplierPaymentStart())
    const response = await remove(`/supplier/${supplierId}/payment/${paymentId}`);
    const deleteData = response.data.success
    if(deleteData) {
      dispatch(deleteSupplierPaymentSuccess({deleteData, supplierId, paymentId}))
      return true;
    }
  } catch(err) {
    const errData = err.response.data
    const formErrors = errData.formErrors ? errData.formErrors : [errData];
    if(errData && err.response.status === 300) {
      dispatch(deleteSupplierPaymentFailure(formErrors))
      return formErrors
    } else {
      dispatch(deleteSupplierPaymentFailure(errData.err))
      return [errData.err]
    }
  }
}

export const clearSupplierApi = (dispatch) => {
  dispatch(getSupplierSuccess([]))
}

