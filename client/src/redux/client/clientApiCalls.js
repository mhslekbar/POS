import { 
  getClientStart,
  getClientSuccess,
  getClientFailure,
  addClientStart,
  addClientSuccess,
  addClientFailure,
  editClientStart,
  editClientSuccess,
  editClientFailure,
  deleteClientStart,
  deleteClientSuccess,
  deleteClientFailure,
  addClientPaymentStart,
  addClientPaymentSuccess,
  addClientPaymentFailure,
  editClientPaymentStart,
  editClientPaymentSuccess,
  editClientPaymentFailure,
  deleteClientPaymentStart,
  deleteClientPaymentSuccess,
  deleteClientPaymentFailure
} from "./clientRedux";

import { get, post, put, remove } from "../../requestMethods"


export const getClients = (search = null) => async (dispatch) => {
  try {
    dispatch(getClientStart())
    let res
    if(search) {
      res = await get(`/client${search}`);
    } else {
      res = await get("/client");
    }
    const data = res.data.success
    if(data) {
      dispatch(getClientSuccess(data))
      return true
    }
  } catch (err) {
    const errData = err.response.data
    const formErrors = errData.formErrors ? errData.formErrors : [errData];
    if(err.response && err.response.status === 300) {
      dispatch(getClientFailure(formErrors))
      return formErrors
    } else {
      dispatch(getClientFailure(errData.err))
      return [errData.err]  
    }
  }
}

export const addClients = (client) => async (dispatch) => {
  try {
    dispatch(addClientStart())
    const response = await post("/client", client)
    const dataRes  = await response.data.success
    if(dataRes) {
      dispatch(addClientSuccess(dataRes))
      return true;
    }
  } catch (err) {
    const errData = err.response.data
    const formErrors = errData.formErrors ? errData.formErrors : [errData];
    if(err.response && err.response.status === 300) {
      dispatch(addClientFailure(formErrors))      
      return formErrors
    } else {
      dispatch(addClientFailure(errData.err))      
      return [errData.err]
    }
  }
}

export const editClient = (id, client) => async (dispatch) => {
  try {
    dispatch(editClientStart())
    const response = await put(`/client/${id}`, client);
    const dataRes = response.data.success
    if(dataRes) {
      dispatch(editClientSuccess({clientId: id, client}))
      return true;
    }
  }catch (err) {
    const errData = err.response.data
    const formErrors = errData.formErrors ? errData.formErrors : [errData];
    if(err.response && err.response.status === 300) {
      dispatch(editClientFailure(formErrors))
      return formErrors
    } else {
      dispatch(editClientFailure(errData.err))
      return [errData.err]
    }
  }
}

export const deleteClient = (id) => async (dispatch) => {
  try {
    dispatch(deleteClientStart());
    const response = await remove(`/client/${id}`);
    const dataRes = response.data.success
    if(dataRes) {
      dispatch(deleteClientSuccess({clientId: id}))
      return true;
    }
  } catch(err) {
    const errData = err.response.data
    const formErrors = errData.formErrors ? errData.formErrors : [errData];
    if(err.response && err.response.status === 300) {
      dispatch(deleteClientFailure(formErrors))
      return formErrors
    } else {
      dispatch(deleteClientFailure(errData.err))
      return errData.err
    }
  }
}

export const addClientPayment = (clientId, payment) => async (dispatch) => {
  try {
    dispatch(addClientPaymentStart())
    const response = await post(`/client/${clientId}/payment`, payment);
    const dataRes = response.data.success
    if(dataRes) {
      dispatch(addClientPaymentSuccess({clientId, payment, dataRes}))
      return true;
    }
  } catch(err) {
    const errData = err.response.data
    const formErrors = errData.formErrors ? errData.formErrors : [errData];
    if(err.response && err.response.status === 300) {
      dispatch(addClientPaymentFailure(formErrors));
      return formErrors
    } else {
      dispatch(addClientPaymentFailure(errData.err));
      return [errData.err]
    }
  }
}

export const editClientPayment = (clientId, payment, paymentId) => async (dispatch) => {
  try {
    dispatch(editClientPaymentStart())
    const response = await put(`/client/${clientId}/payment/${paymentId}`, {payment});
    const dataRes = response.data.success
    if(dataRes) {
      dispatch(editClientPaymentSuccess(dataRes));
      return true
    }
  } catch (err) {
    const errData = err.response.data
    const formErrors = errData.formErrors ? errData.formErrors : [errData];
    if(err.response && err.response.status === 300) {
      dispatch(editClientPaymentFailure(formErrors))
      return formErrors
    } else {
      dispatch(editClientPaymentFailure(errData.err))
      return [errData.err]
    }
  }
}

export const deleteClientPayment = (clientId, paymentId) => async (dispatch) => {
  try {
    dispatch(deleteClientPaymentStart())
    const response = await remove(`/client/${clientId}/payment/${paymentId}`);
    const dataRes = response.data.success
    if(dataRes) {
      dispatch(deleteClientPaymentSuccess({clientId, client: dataRes}));
      return true
    }
  } catch (err) {
    const errData = err.response.data
    const formErrors = errData.formErrors ? errData.formErrors : [errData];
    if(err.response && err.response.status === 300) {
      dispatch(deleteClientPaymentFailure(formErrors))
      return formErrors
    } else {
      dispatch(deleteClientPaymentFailure(errData.err))
      return [errData.err]
    }
  }
} 


export const clearClients = (dispatch) => {
  dispatch(getClientSuccess([]))
}