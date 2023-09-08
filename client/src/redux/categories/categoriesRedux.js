import  { createSlice } from "@reduxjs/toolkit";

const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    isFetching: false,
    categories: [],
    error: []
  },
  reducers: {
    statusCategoriesStart: (state) => {
      state.isFetching = true
      state.error = []
    },
    statusCategoriesSuccess: (state, action) => {
      state.isFetching = false
      state.categories = action.payload
      state.error = []
    },
    statusCategoriesFailure: (state, action) => {
      state.isFetching = false
      state.error = action.payload
    },
  }
})

export const  {
  statusCategoriesStart,
  statusCategoriesSuccess,
  statusCategoriesFailure
} = categoriesSlice.actions;
export default categoriesSlice.reducer;
