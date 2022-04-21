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
      const response = await axios.get(
        `/me/albums?limit=${limit}&offset=${offset}`
      );
      return response.data;
    } else {
      const response = await axios.get(`/me/albums?limit=20`);
      return response.data;
    }
  }
);

// Fetch current user's remaining albums
export const getUserSavedAlbumsWithOffset = createAsyncThunk(
  "userArtists/getUserSavedAlbumsWithOffset",
  async (url: string) => {
    const response = await axios.get(url);
    return response.data;
  }
);

export const userSavedAlbumsSlice = createSlice({
  name: "userSavedAlbums",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserSavedAlbums.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.followedAlbums = action.payload;
    });

    builder.addCase(getUserSavedAlbumsWithOffset.fulfilled, (state, action) => {
      const albums = state.followedAlbums;

      albums.href = action.payload.href;
      albums.items = albums.items.concat(action.payload.items);
      albums.next = action.payload.next;
      albums.limit = action.payload.limit;
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
