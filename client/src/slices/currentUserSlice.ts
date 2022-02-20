import axios from "axios";
import { User } from "../types/SpotifyObjects";
import { RootState } from "../app/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface CurrentUserState {
  user: User;
  status: "idle" | "loading" | "failed";
}

const initialState: CurrentUserState = {
  user: {} as User,
  status: "idle",
};

export const fetchCurrentUser = createAsyncThunk(
  "currentUser/fetchCurrentUser",
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
    builder.addCase(fetchCurrentUser.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      state.status = "idle";
      state.user = action.payload;
    });
    builder.addCase(fetchCurrentUser.rejected, (state) => {
      state.status = "failed";
    });
  },
});

export const selectCurrentUser = (state: RootState) => state.currentUser.user;

export default currentUserSlice.reducer;
