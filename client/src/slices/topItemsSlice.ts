import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Paging, Track, Artist } from "../types/SpotifyObjects";
import { RootState } from "../app/store";

interface TopArtists {
  short_term: Paging<Artist>;
  medium_term: Paging<Artist>;
  long_term: Paging<Artist>;
}

interface TopTracks {
  short_term: Paging<Track>;
  medium_term: Paging<Track>;
  long_term: Paging<Track>;
}

interface TopItemsState {
  topArtists: TopArtists;
  topTracks: TopTracks;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: TopItemsState = {
  topArtists: {} as TopArtists,
  topTracks: {} as TopTracks,
  status: "idle",
};

interface fetchParams {
  limit?: number;
  offset?: number;
  time_range: "short_term" | "medium_term" | "long_term";
}

export const getTopArtists = createAsyncThunk(
  "topItems/getTopArtists",
  async (data?: fetchParams) => {
    if (data) {
      const { limit = 20, offset = 0, time_range = "medium_term" } = data;
      const response = await axios.get(
        `/me/top/artists?limit=${limit}&offset=${offset}&time_range=${time_range}`
      );
      return response.data;
    } else {
      const response = await axios.get(
        `/me/top/artists?limit=20&offset=0&time_range=medium_term`
      );
      return response.data;
    }
  }
);

export const getTopTracks = createAsyncThunk(
  "topItems/getTopTracks",
  async (data?: fetchParams) => {
    if (data) {
      const { limit = 20, offset = 0, time_range = "medium_term" } = data;
      const response = await axios.get(
        `/me/top/tracks?limit=${limit}&offset=${offset}&time_range=${time_range}`
      );
      return response.data;
    } else {
      const response = await axios.get(
        `/me/top/tracks?limit=20&offset=0&time_range=short_term`
      );
      return response.data;
    }
  }
);

export const topItemsSlice = createSlice({
  name: "topItems",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTopArtists.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getTopArtists.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.meta.arg !== undefined) {
          state.topArtists[action.meta.arg.time_range] = action.payload;
        }
      })
      .addCase(getTopArtists.rejected, (state) => {
        state.status = "failed";
      });
    builder
      .addCase(getTopTracks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getTopTracks.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.meta.arg !== undefined) {
          state.topTracks[action.meta.arg.time_range] = action.payload;
        }
      })
      .addCase(getTopTracks.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const selectTopArtists = (state: RootState) => {
  return state.topItems.topArtists;
};

export const selectTopTracks = (state: RootState) => {
  return state.topItems.topTracks;
};

export default topItemsSlice.reducer;
