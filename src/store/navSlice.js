import { createSlice } from "@reduxjs/toolkit";

const navSlice = createSlice({
  name: 'nav',
  initialState: {
    collapsed: false,
  },
  reducers: {
    toggleNavbar: (state) => {
      state.collapsed = !state.collapsed;
    },
    setNavbarState: (state, action) => {
      state.collapsed = action.payload;
    },
  },
});

export const { toggleNavbar, setNavbarState } = navSlice.actions;

export default navSlice.reducer;
