import { createSlice } from "@reduxjs/toolkit";

const initialState = { attrs: null };

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.attrs = action.payload;
    }
  }
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
