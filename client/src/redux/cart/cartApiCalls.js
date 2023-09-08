import  {
  getCartStart,
  getCartSuccess,
  getCartFailure,
  addItemToCartStart,
  addItemToCartSuccess,
  addItemToCartFailure,
  removeItemFromCartSuccess,
  clearCart,
  showOrderOnCart,
  updateCart
} from "./cartRedux";

import { remove } from "../../requestMethods";

export const getCart = (dispatch) => {
  try {
    dispatch(getCartStart())
    const cartData = localStorage.getItem("cart");
    const cart     = cartData ? JSON.parse(cartData) : []
    dispatch(getCartSuccess(cart))
  } catch(err) {
    dispatch(getCartFailure(err.message))
  }
} 

export const addItemToCart = (item) => (dispatch) => {
  try {
    dispatch(addItemToCartStart())
    dispatch(addItemToCartSuccess(item))
  } catch (err) {
    dispatch(addItemToCartFailure(err.message))
  }
}

export const removeItemFromCart = (itemId, saleId, lineSaleId) => async (dispatch) => {
  try {
    if(lineSaleId) {
      const response = await remove(`/sale/${saleId}/LineSale/${lineSaleId}`);
      const resData  = response.data.success
      if(resData) {
        await dispatch(removeItemFromCartSuccess({itemId, TypeEvent: "Edit"}))
        return true
      }
    } else {
      await dispatch(removeItemFromCartSuccess({itemId}))
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

export const clearCartApi = (dispatch) => {
  dispatch(clearCart())
}

export const showOrderOnCartApi = (order)  => (dispatch) => {
  dispatch(showOrderOnCart(order))
}

export const updateCartApi = (data) => async (dispatch) => {
  await dispatch(updateCart(data))
}