import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { GetFollowedArtistsResponse } from "../types/SpotifyResponses";

interface UserSavedArtistsState {
  followedArtists: GetFollowedArtistsResponse;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: UserSavedArtistsState = {
  followedArtists: {} as GetFollowedArtistsResponse,
  status: "idle",
};

interface fetchParams {
  type: string;
  after?: number;
  limit?: number;
}

export const getUserSavedArtists = createAsyncThunk(
  "userSavedArtists/getUserSavedArtists",
  async (data?: fetchParams) => {
    if (data) {
      const { type = "artist", limit = 20 } = data;
      const response = await axios.get(
        `/me/following?type=${type}&limit=${limit}`
      );
      return response.data;
    } else {
      const response = await axios.get(`/me/following?type=artist&limit=20`);
      return response.data;
    }
  }
);

export const userSavedArtistsSlice = createSlice({
  name: "userSavedArtists",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserSavedArtists.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserSavedArtists.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.followedArtists = action.payload;
      })
      .addCase(getUserSavedArtists.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const selectUserSavedArtists = (state: RootState) => {
  return state.userSavedArtists.followedArtists;
};

export default userSavedArtistsSlice.reducer;
