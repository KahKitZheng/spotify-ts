import axios from "axios";
import { RootState } from "../app/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CursorBasedPaging, PlayHistory } from "../types/SpotifyObjects";

interface recentTracksState {
  recentTracks: CursorBasedPaging<PlayHistory>;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: recentTracksState = {
  recentTracks: {} as CursorBasedPaging<PlayHistory>,
  status: "idle",
};

type fetchParams = {
  before?: number;
  after?: number;
  limit?: number;
};

export const getRecentTracks = createAsyncThunk(
  "recentTracks/getRecentTracks",
  async (data?: fetchParams) => {
    if (data) {
      const { limit = 20 } = data;
      const response = await axios.get(
        `/me/player/recently-played?limit=${limit}`
      );
      return response.data;
    } else {
      const response = await axios.get(`/me/playlists?limit=20`);
      return response.data;
    }
  }
);

export const recentTracksSlice = createSlice({
  name: "recentTracks",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRecentTracks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getRecentTracks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.recentTracks = action.payload;
      })
      .addCase(getRecentTracks.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const selectRecentTracks = (state: RootState) => {
  return state.recentTracks.recentTracks;
};

export default recentTracksSlice.reducer;
