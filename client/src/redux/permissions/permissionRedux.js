import { createSlice } from "@reduxjs/toolkit";

const permissionSlice = createSlice({
  name: "permissions",
  initialState: {
    isFetching: false,
    permissions: [],
    error: []
  },
  reducers: {
    statusPermissionStart: (state) => {
      state.isFetching = true
      state.error = []
    },
    statusPermissionSuccess: (state, action) => {
      state.isFetching = false
      state.permissions = action.payload
      state.error = []
    },
    statusPermissionFailure: (state, action) => {
      state.isFetching = false
      state.error = action.payload
    }
  }
});

export default permissionSlice.reducer
export const { 
  statusPermissionStart,
  statusPermissionSuccess,
  statusPermissionFailure } = permissionSlice.actions;