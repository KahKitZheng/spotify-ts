import axios from "axios";
import { User } from "../types/SpotifyObjects";
import { RootState } from "../app/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface CurrentUserState {
  user: User;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: CurrentUserState = {
  user: {} as User,
  status: "idle",
};

export const getCurrentUser = createAsyncThunk(
  "currentUser/getCurrentUser",
  async () => {
    const response = await axios.get(`/me`);
    return response.data;
  }
);

export const currentUserSlice = createSlice({
  name: "currentUser",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCurrentUser.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getCurrentUser.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.user = action.payload;
    });
    builder.addCase(getCurrentUser.rejected, (state) => {
      state.status = "failed";
    });
  },
});

export const selectCurrentUser = (state: RootState) => state.currentUser.user;

export default currentUserSlice.reducer;
