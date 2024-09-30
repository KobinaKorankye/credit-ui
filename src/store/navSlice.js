import { createSlice } from "@reduxjs/toolkit";

const navSlice = createSlice({
  name: 'nav',
  initialState: {
    collapsed: false, currentSideNavSection: "Dashboard"
  },
  reducers: {
    toggleNavbar: (state) => {
      state.collapsed = !state.collapsed;
    },
    setNavbarState: (state, action) => {
      state.collapsed = action.payload;
    },
    setCurrentSideNavSection: (state, action) => {
      state.currentSideNavSection = action.payload;
    },
  },
});

export const { toggleNavbar, setNavbarState, setCurrentSideNavSection } = navSlice.actions;

export default navSlice.reducer;
