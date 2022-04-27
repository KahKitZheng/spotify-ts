import axios from "../app/axios";
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
      const response = await axios.get(`/me/player/recently-played?limit=20`);
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
        const response = action.payload;
        const list = [
          ...new Map(
            response.items?.map((item: PlayHistory) => [item.track.id, item])
          ).values(),
        ];

        state.status = "succeeded";
        state.recentTracks = {
          ...action.payload,
          items: list,
        };
      })
      .addCase(getRecentTracks.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const selectRecentTracks = (state: RootState) => {
  return state.recentTracks.recentTracks;
};

export const selectRecentTracksStatus = (state: RootState) => {
  return state.recentTracks.status;
};

export default recentTracksSlice.reducer;
