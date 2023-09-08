import { createSlice } from "@reduxjs/toolkit";

const loginSlice = createSlice({
  name: "login",
  initialState: {
    userData: null,
    isFetching: false,
    error: false,
  },
  reducers: {
    loginStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    loginSuccess: (state, action) => {
      state.isFetching = false;
      state.userData = action.payload;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.isFetching = false;
      state.error = action.payload;
    },
    logoutSuccess: (state) => {
      state.isFetching = false;
      state.userData = null;
      state.error = null;
    },
    refreshLogin: (state, action) => {
      state.isFetching = false;
      const { accessToken, refreshToken } = action.payload
      // const { _id, username, phone, groups, createdAt,  updatedAt } = state.userData
      state.userData = { ...state.userData, accessToken, refreshToken } 
      state.error = null;
    }
  },
});

export const { 
  loginStart,
  loginSuccess, 
  loginFailure, 
  logoutSuccess,
  refreshLogin
} = loginSlice.actions;

export default loginSlice.reducer;
