import { createSlice } from "@reduxjs/toolkit"

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    isFetching: false,
    cart: [],
    error: []
  },
  reducers: {
    getCartStart: (state) => {
      state.isFetching = true
      state.error = []
    },
    getCartSuccess: (state, action) => {
      state.isFetching = false
      state.cart = action.payload
      state.error = []
    },
    getCartFailure: (state, action) => {
      state.isFetching = false
      state.error = action.payload
    },
    addItemToCartStart: (state) => {
      state.isFetching = true
      state.error = []
    },
    addItemToCartSuccess: (state, action) => {
      state.isFetching = false
      const item = action.payload
      const qtyNeeded = action.payload.qtyNeeded
      const index = state.cart.findIndex((cartItem) => cartItem._id === item._id) 
      if(index === -1 && qtyNeeded > 0) {
        state.cart.push(item)
      } else if(qtyNeeded > 0) {
        state.cart[index] = item
      }
      localStorage.setItem("cart", JSON.stringify(state.cart))
      state.error = []
    },
    addItemToCartFailure: (state, action) => {
      state.isFetching = false
      state.error = action.payload
    },
    removeItemFromCartSuccess: (state, action) => {
      state.isFetching = false
      const { itemId, TypeEvent } = action.payload
      if(TypeEvent === "Edit") {
        state.cart = state.cart.filter(cartItem => cartItem.productId._id !== itemId)
      } else {
        state.cart = state.cart.filter(cartItem => cartItem._id !== itemId)
      }
      localStorage.setItem("cart", JSON.stringify(state.cart))
      state.error = []
    }, 
    clearCart: (state) => {
      state.isFetching = false
      state.cart = []
      localStorage.setItem("cart", JSON.stringify([]))
      state.error = []
    },
    showOrderOnCart: (state, action) => {
      state.isFetching = false
      state.cart = action.payload
      localStorage.setItem("cart", JSON.stringify(state.cart))
      state.error = []
    },
    updateCart: (state, action) => {
      state.isFetching = false
      state.cart = action.payload
      localStorage.setItem("cart", JSON.stringify(state.cart))
      state.error = []
    }
  }
})

export const {
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
} = cartSlice.actions;

export default cartSlice.reducer
