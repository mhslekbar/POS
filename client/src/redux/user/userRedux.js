import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    isFetching: false,
    error: false,
  },
  reducers: {
    statusUserStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    statusUsersSuccess: (state, action) => {
      state.isFetching = false;
      state.currentUser = action.payload;
      state.error = false;
    },
    statusUsersFailure: (state, action) => {
      state.isFetching = false;
      state.error = action.payload;
    }
  },
});

export const { 
  statusUserStart, 
  statusUsersSuccess, 
  statusUsersFailure
} = userSlice.actions;

export default userSlice.reducer;
