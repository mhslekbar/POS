import { createSlice } from "@reduxjs/toolkit";

const supplierSlice = createSlice({
  name: "supplier",
  initialState: {
    suppliers: [],
    isFetching: false,
    error: []  
  },
  reducers: {
    getSupplierStart: (state) => {
      state.isFetching = true
      state.error = []
    },
    getSupplierSuccess: (state, action) => {
      state.isFetching = false
      state.suppliers = action.payload
      state.error = []
    },
    getSupplierFailure: (state, action) => {
      state.isFetching = false
      state.error = action.payload
    },
    addSupplierStart: (state) => {
      state.isFetching = true;
      state.error = [];
    },
    addSupplierSuccess: (state, action) => {
      state.isFetching = false;
      state.suppliers.unshift(action.payload)
      state.error = [];
    },
    addSupplierFailure: (state, action) => {
      state.isFetching = false;
      state.error.push(action.payload);
    },
    editSupplierStart: (state) => {
      state.isFetching = true;
      state.error = []
    },
    editSupplierSuccess: (state, action) => {
      state.isFetching = false;
      state.suppliers = [...state.suppliers, action.payload]
      state.error = []
    },
    editSupplierFailure: (state, action) => {
      state.isFetching = false;
      state.error.push(action.payload)
    },
    deleteSupplierStart: (state) => {
      state.isFetching = true;
      state.error = [];
    },
    deleteSupplierSuccess: (state, action) => {
      state.isFetching = false;
      const indexToRemove = state.suppliers.indexOf(action.payload)
      indexToRemove >= 0 && state.suppliers.splice(indexToRemove, 1)
      state.error = [];
    },
    deleteSupplierFailure: (state, action) => {
      state.isFetching = false;
      state.error.push(action.payload);
    },

    // START Supplier Payment

    getSupplierPaymentStart: (state) => {
      state.isFetching = true;
      state.error = []
    },
    getSupplierPaymentSuccess: (state, action) => {
      state.isFetching = false;
      state.suppliers.historyPayment.push(action.payload);
      state.error = []
    },
    getSupplierPaymentFailure: (state, action) => {
      state.isFetching = false;
      state.error.push(action.payload)
    },

    addSupplierPaymentStart: (state) => {
      state.isFetching = true;
      state.error = []
    },
    addSupplierPaymentSuccess: (state, action) => {
      state.isFetching = false;
      const index = state.suppliers.findIndex(supp => supp._id === action.payload.id)
      const dataPaym = action.payload.payment
      const prevBalance = state.suppliers[index > -1 ? index : 0].balance
      const newBalance = Number(prevBalance) + Number(dataPaym[dataPaym.length - 1].payment)
      state.suppliers[index > -1 ? index : 0].balance = Number(newBalance)
      state.suppliers[index > -1 ? index : 0].historyPayment.push(dataPaym[dataPaym.length - 1])

      state.error = []
    },
    addSupplierPaymentFailure: (state, action) => {
      state.isFetching = false;
      state.error.push(action.payload)
    },

    editSupplierPaymentStart: (state) => {
      state.isFetching = true;
      state.error = []
    },
    editSupplierPaymentSuccess: (state, action) => {
      state.isFetching = false;
      const index = state.suppliers.findIndex(supp => supp._id === action.payload.id)
      const dataPaym = action.payload.payment
      const paymentId = action.payload.paymentId
      
      const supplierInfo = state.suppliers[index]

      const indexPaym = supplierInfo.historyPayment.findIndex(paym => paym._id === paymentId)
      
      const prevBalance = supplierInfo.balance
      // console.log("s : ", dataPaym.historyPayment[indexPaym])
      const newPayment = dataPaym.historyPayment[indexPaym].payment;

      const prevPaym = supplierInfo.historyPayment[indexPaym].payment

      const newBalance = Number(prevBalance) - Number(prevPaym) + Number(newPayment)

      supplierInfo.balance = Number(newBalance)
      supplierInfo.historyPayment[indexPaym].payment = dataPaym.historyPayment[indexPaym].payment
      supplierInfo.historyPayment[indexPaym].updatedAt = new Date()

      state.error = []
    },
    editSupplierPaymentFailure: (state, action) => {
      state.isFetching = false;
      state.error.push(action.payload)
    },

    deleteSupplierPaymentStart: (state) => {
      state.isFetching = true
      state.error = []
    },
    deleteSupplierPaymentSuccess: (state, action) => {
      state.isFetching = false
      const supplierId = action.payload.supplierId
      const paymentId  = action.payload.paymentId 
      const index = state.suppliers.findIndex(supp => supp._id === supplierId)
    
      const supplierInfo = state.suppliers[index]
    
      const indexPayment = supplierInfo.historyPayment.findIndex(paym => paym._id === paymentId)
      const prevPayment  = supplierInfo.historyPayment[indexPayment].payment
      const prevBalance = supplierInfo.balance
      const newBalance = Number(prevBalance) - Number(prevPayment);
      supplierInfo.balance = newBalance
      supplierInfo.historyPayment = supplierInfo.historyPayment.filter(paym => paym._id !== paymentId)

      state.error = []
    },
    deleteSupplierPaymentFailure: (state, action) => {
      state.isFetching = false
      state.error = action.payload
    },

    // END Supplier Payment
  }
})

export const { 
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
  
} = supplierSlice.actions

export default supplierSlice.reducer;
