import axios from "axios";
import { RootState } from "../app/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PrivateUser } from "../types/SpotifyObjects";

interface CurrentUserState {
  user: PrivateUser;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: CurrentUserState = {
  user: {} as PrivateUser,
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
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const selectCurrentUser = (state: RootState) => {
  return state.currentUser.user;
};

export const selectCurrentUserStatus = (state: RootState) => {
  return state.currentUser.status;
};

export const selectCurrentUserCountry = (state: RootState) => {
  return state.currentUser.user.country;
};

export default currentUserSlice.reducer;
