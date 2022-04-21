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

// Fetch current user's remaining artists
export const getUserSavedArtistsWithOffset = createAsyncThunk(
  "userArtists/getUserSavedArtistsWithOffset",
  async (url: string) => {
    const response = await axios.get(url);
    return response.data;
  }
);

export const userSavedArtistsSlice = createSlice({
  name: "userSavedArtists",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserSavedArtists.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.followedArtists = action.payload;
      })
      .addCase(getUserSavedArtistsWithOffset.fulfilled, (state, action) => {
        const artists = state.followedArtists.artists;

        artists.href = action.payload.artists.href;
        artists.items = artists.items.concat(action.payload.artists.items);
        artists.next = action.payload.artists.next;
        artists.limit = action.payload.artists.limit;
        artists.cursors = action.payload.artists.cursors;
      });
  },
});

export const selectSavedArtists = (state: RootState) => {
  return state.userSavedArtists.followedArtists;
};

export const selectSavedArtistsStatus = (state: RootState) => {
  return state.userSavedArtists.status;
};

export default userSavedArtistsSlice.reducer;
