import { createSlice } from "@reduxjs/toolkit";

const s = {
  user: {},
  course: [],
  isLogged: false,
};

const Eslice = createSlice({
  name: "slice",
  initialState: s,
  reducers: {
    toggleIsLogged: (state, action) => {
      state.isLogged = action.payload;
    },
    setCourse:()=>{
        state.course
    }
  },
});
