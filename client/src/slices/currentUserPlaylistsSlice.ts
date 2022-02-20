import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Paging, SimplifiedPlaylist } from "../types/SpotifyObjects";
import { RootState } from "../app/store";

interface UserPlaylistsState {
  userPlaylists: Paging<SimplifiedPlaylist>;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: UserPlaylistsState = {
  userPlaylists: {} as Paging<SimplifiedPlaylist>,
  status: "idle",
};

interface fetchParams {
  limit?: number;
  offset?: number;
}

export const getCurrentUserPlaylists = createAsyncThunk(
  "currentUserPlaylists/getCurrentUserPlaylists",
  async (data?: fetchParams) => {
    if (data) {
      const { limit = 20, offset = 0 } = data;
      const response = await axios.get(
        `/me/playlists?limit=${limit}&offset=${offset}`
      );
      return response.data;
    } else {
      const response = await axios.get(`/me/playlists?limit=20&offset=0`);
      return response.data;
    }
  }
);

export const userPlaylistsSlice = createSlice({
  name: "currentUserPlaylists",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentUserPlaylists.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCurrentUserPlaylists.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userPlaylists = action.payload;
      })
      .addCase(getCurrentUserPlaylists.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const selectCurrentUserPlaylists = (state: RootState) => {
  return state.currentUserPlaylists.userPlaylists;
};

export default userPlaylistsSlice.reducer;
