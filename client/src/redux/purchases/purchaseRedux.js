import { createSlice } from "@reduxjs/toolkit"

const purchaseSlice = createSlice({
  name: "purchase",
  initialState: {
    isFetching: false,
    purchases: [],
    error: []
  },
  reducers: {
    getPurchaseStart: (state)=> {
      state.isFetching = true
      state.error = []
    },
    getPurchaseSuccess: (state, action)=> {
      state.isFetching = false
      state.purchases = action.payload
      state.error = []
    },
    getPurchaseFailure: (state, action)=> {
      state.isFetching = false
      state.error = action.payload
    },
    addPurchaseStart: (state) => {
      state.isFetching = true;
      state.error = [];
    },
    addPurchaseSuccess: (state, action) => {
      state.isFetching = false;
      state.purchases = action.payload
      state.error = [];
    },
    addPurchaseFailure: (state, action) => {
      state.isFetching = false;
      state.error = action.payload;
    },
    deletePurchaseStart: (state) => {
      state.isFetching = true;
      state.error = [];
    },
    deletePurchaseSuccess: (state, action) => {
      state.isFetching = false;
      const id = action.payload
      state.purchases = state.purchases.filter(p => p._id !== id)
      state.error = [];
    },
    deletePurchaseFailure: (state, action) => {
      state.isFetching = false;
      state.error = action.payload;
    },
    deleteProductFromPurchaseStart: (state) => {
      state.isFetching = true
      state.error = []
    },
    deleteProductFromPurchaseSuccess: (state, action) => {
      state.isFetching = false
      state.purchases = action.payload
      state.error = []
    },
    deleteProductFromPurchaseFailure: (state, action) => {
      state.isFetching = false
      state.error = action.payload
    },
    supplyPurchaseStart: (state) => {
      state.isFetching = true
      state.error = []
    },
    supplyPurchaseSuccess: (state, action) => {
      state.isFetching = false
      state.purchases = action.payload
      state.error = []
    },
    supplyPurchaseFailure: (state) => {
      state.isFetching = false
      state.error = []
    },
    updatePurchaseStart: (state) => {
      state.isFetching = true
      state.error = []
    },
    updatePurchaseSuccess: (state, action) => {
      state.isFetching = false
      state.purchases = action.payload
      state.error = []
    },
    updatePurchaseFailure: (state, action) => {
      state.isFetching = false
      state.error = action.payload
    }
  }
})

export const { 
  getPurchaseStart,
  getPurchaseSuccess,
  getPurchaseFailure,
  addPurchaseStart,
  addPurchaseSuccess,
  addPurchaseFailure,
  deletePurchaseStart,
  deletePurchaseSuccess,
  deletePurchaseFailure,
  deleteProductFromPurchaseStart,
  deleteProductFromPurchaseSuccess,
  deleteProductFromPurchaseFailure,
  supplyPurchaseStart,
  supplyPurchaseSuccess,
  supplyPurchaseFailure,
  updatePurchaseStart,
  updatePurchaseSuccess,
  updatePurchaseFailure
 } = purchaseSlice.actions 
export default purchaseSlice.reducer 
