import { createSlice } from "@reduxjs/toolkit";

export const ToggleMenuSlice = createSlice({
  name: "toggleMenu",
  initialState: {
    value: false,
  },
  reducers: {
    toggle: (state) => {
      state.value = !state.value;
    },
    sidebarMini: (state) => {
      state.value = true;
    },
    leave: (state) => {
      state.value = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { toggle, sidebarMini, leave } = ToggleMenuSlice.actions;

export default ToggleMenuSlice.reducer;
