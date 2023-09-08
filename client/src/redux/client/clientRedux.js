import { createSlice } from "@reduxjs/toolkit";

const clientSlice = createSlice({
  name: "client",
  initialState: {
    isFetching: false,
    clients: [],
    error: []
  },
  reducers: {
    getClientStart: (state) => {
      state.isFetching = true;
      state.error = [];
    },
    getClientSuccess: (state, action) => {
      state.isFetching = false;
      state.clients = action.payload;
      state.error = [];
    },
    getClientFailure: (state, action) => {
      state.isFetching = false;
      state.error = action.payload;
    },

    addClientStart: (state) => {
      state.isFetching = true;
      state.error = [] 
    },
    addClientSuccess: (state, action) => {
      state.isFetching = false;
      state.clients.unshift(action.payload)  
      state.error = [] 
    },
    addClientFailure: (state, action) => {
      state.isFetching = false;
      state.error = action.payload
    },

    editClientStart: (state) => {
      state.isFetching = true;
      state.error = [];
    },
    editClientSuccess: (state, action) => {
      state.isFetching = false;
      const clientId = action.payload.clientId
      const client = action.payload.client
      const index = state.clients.findIndex(client => client._id === clientId)
      state.clients[index].name = client.name
      state.clients[index].phone = client.phone
      state.error = [];
    },
    editClientFailure: (state, action) => {
      state.isFetching = false;
      state.error = action;
    },

    deleteClientStart: (state) => {
      state.isFetching = true;
      state.error = [];
    },
    deleteClientSuccess: (state, action) => {
      state.isFetching = false;
      const clientId = action.payload.clientId
      state.clients = state.clients.filter(client => client._id !== clientId)
      state.error = [];
    },
    deleteClientFailure: (state, action) => {
      state.isFetching = true;
      state.error = action.payload;
    },

    // START Payment
    addClientPaymentStart: (state) => {
      state.isFetching = true
      state.error = []
    },
    addClientPaymentSuccess: (state, action) => {
      state.isFetching = false;
      const clientId = action.payload.clientId
      const paymentObj = action.payload.payment
      const dataRes   = action.payload.dataRes

      const index = state.clients.findIndex(client => client._id === clientId)      
      state.clients[index].historyPayment = dataRes.historyPayment
      const prevDette = state.clients[index].dette
      const montant = paymentObj.payment
      const newDette  = Number(prevDette || 0) - Number(montant)
      state.clients[index].dette = Number(newDette)
      state.error = []
    },
    addClientPaymentFailure: (state, action) => {
      state.isFetching = false
      state.error = action
    },

    editClientPaymentStart: (state) => {
      state.isFetching = true;
      state.error = [];
    },
    editClientPaymentSuccess: (state, action) => {
      state.isFetching = false;
      state.clients = action.payload
      state.error = [];
    },
    editClientPaymentFailure: (state, action) => {
      state.isFetching = false;
      state.error = action.payload;
    },

    deleteClientPaymentStart: (state) => {
      state.isFetching = true;
      state.error = [];
    },
    deleteClientPaymentSuccess: (state, action) => {
      state.isFetching = false;
      const clientId = action.payload.clientId;

      const client = action.payload.client 
      const index = state.clients.findIndex(client => client._id === clientId);
      state.clients[index].historyPayment = client.historyPayment
      state.clients[index].dette = client.dette
      
      state.error = [];
    },
    deleteClientPaymentFailure: (state, action) => {
      state.isFetching = false;
      state.error = action.payload;
    },
    // END Payment

  }
})

export const { 
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
  } =  clientSlice.actions
export default clientSlice.reducer
