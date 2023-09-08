import { createSlice } from "@reduxjs/toolkit";

const consumptionSlice = createSlice({
  name: "consumptions",
  initialState: {
    isFetching: false,
    consumptions: [],
    error: []
  },
  reducers: {
    statusConsumptionStart: (state) => {
      state.isFetching = false
      state.error = []
    },
    statusConsumptionSuccess: (state, action) => {
      state.isFetching = false
      state.consumptions = action.payload
      state.error = []
    },
    statusConsumptionFailure: (state, action) => {
      state.isFetching = false
      state.error = action.payload
    }
  }
})


export const { 
  statusConsumptionStart,
  statusConsumptionSuccess,
  statusConsumptionFailure 
} = consumptionSlice.actions

export default consumptionSlice.reducer