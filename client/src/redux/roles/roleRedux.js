import { createSlice } from "@reduxjs/toolkit"

const roleSlice = createSlice({
  name: "role",
  initialState: {
    isFetching: false,
    roles: [],
    error: []
  },
  reducers: {
    statusRoleStart: (state) => {
      state.isFetching = true
      state.error = []
    },
    statusRoleSuccess: (state, action) => {
      state.isFetching = false
      state.roles = action.payload
      state.error = []
    },
    statusRoleFailure: (state, action) => {
      state.isFetching = false
      state.error = action.payload
    }
  }
})

export default roleSlice.reducer
export const { statusRoleStart, statusRoleSuccess, statusRoleFailure } = roleSlice.actions 
