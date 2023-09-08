import { createSlice } from "@reduxjs/toolkit"

const saleSlice = createSlice({
  name: "sale",
  initialState: {
    isFetching: false,
    sales: [],
    error: []
  },
  reducers: {
    getSaleStart: (state) => {
      state.isFetching = true
      state.error = []
    },
    getSaleSuccess: (state, action) => {
      state.isFetching = false
      state.sales = action.payload
      state.error = []
    },
    getSaleFailure: (state, action) => {
      state.isFetching = false
      state.error = action.payload
    },
    createNewSale: (state, action) => {
      state.isFetching = false
      state.sales = action.payload
      state.error = []
    },
    removeSale: (state, action) => {
      state.isFetching = false
      const saleId = action.payload
      state.sales = state.sales.filter(sale => sale._id !== saleId)
      state.error = []
    },
    appendSale: (state, action) => {
      state.isFetching = false
      state.sales = action.payload
      state.error = []
    },
  } 
})

export const { 
  getSaleStart,
  getSaleSuccess,
  getSaleFailure,
  createNewSale,
  removeSale,
  appendSale
} = saleSlice.actions;
  
export default saleSlice.reducer