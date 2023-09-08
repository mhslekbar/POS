import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    isFetching: false,
    products: [],
    error: []
  },
  reducers: {
    statusProductStart: (state) => {
      state.isFetching = true
      state.error = []
    },
    statusProductSuccess: (state, action) => {
      state.isFetching = false
      state.products = action.payload
      state.error = []
    },
    statusProductFailure: (state, action) => {
      state.isFetching = false
      state.error = action.payload
    }
  }
})

export const { 
  statusProductStart,
  statusProductSuccess,
  statusProductFailure
} = productSlice.actions;
export default productSlice.reducer;
