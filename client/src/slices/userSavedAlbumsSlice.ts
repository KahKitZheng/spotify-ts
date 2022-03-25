import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { GetSavedAlbumsResponse } from "../types/SpotifyResponses";

interface UserSavedAlbumsState {
  followedAlbums: GetSavedAlbumsResponse;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: UserSavedAlbumsState = {
  followedAlbums: {} as GetSavedAlbumsResponse,
  status: "idle",
};

interface fetchParams {
  limit?: number;
  market?: string;
  offset?: number;
}

export const getUserSavedAlbums = createAsyncThunk(
  "userSavedAlbums/getUserSavedAlbums",
  async (data?: fetchParams) => {
    if (data) {
      const { limit = 20, offset = 0 } = data;
      const response = await axios.get(`/me/albums?limit=${limit}&offset=${offset}`);
      return response.data;
    } else {
      const response = await axios.get(`/me/albums?limit=20`);
      return response.data;
    }
  }
);

export const userSavedAlbumsSlice = createSlice({
  name: "userSavedAlbums",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserSavedAlbums.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserSavedAlbums.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.followedAlbums = action.payload;
      })
      .addCase(getUserSavedAlbums.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const selectSavedAlbums = (state: RootState) => {
  return state.userSavedAlbums.followedAlbums;
};

export const selectSavedAlbumsStatus = (state: RootState) => {
  return state.userSavedAlbums.status;
};

export default userSavedAlbumsSlice.reducer;
