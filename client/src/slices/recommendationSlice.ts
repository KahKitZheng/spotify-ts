import axios from "axios";
import { RootState } from "../app/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RecommendationSeed, Track } from "../types/SpotifyObjects";

interface RecommendationResponse {
  seeds: RecommendationSeed[];
  tracks: Track[];
}

interface RecommendationState {
  artists: RecommendationResponse;
  playlistTracks: RecommendationResponse;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: RecommendationState = {
  artists: {} as RecommendationResponse,
  playlistTracks: {} as RecommendationResponse,
  status: "idle",
};

type fetchParams = {
  seed: string[];
  limit: number;
};

export const recommendArtistTracks = createAsyncThunk(
  "recommendation/recommendArtistTracks",
  async (data: fetchParams) => {
    const { seed, limit = 20 } = data;
    const response = await axios.get(
      `/recommendations?seed_artists=${seed.join()}&limit=${limit}`
    );
    return response.data;
  }
);

export const recommendPlaylistTracks = createAsyncThunk(
  "recommendation/recommendPlaylistTracks",
  async (data: fetchParams) => {
    const { seed, limit = 20 } = data;
    const response = await axios.get(
      `/recommendations?seed_tracks=${seed.join()}&limit=${limit}`
    );
    return response.data;
  }
);

export const recommendationSlice = createSlice({
  name: "recommendation",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(recommendArtistTracks.fulfilled, (state, action) => {
      state.artists = action.payload;
    });
    builder.addCase(recommendPlaylistTracks.fulfilled, (state, action) => {
      state.playlistTracks = action.payload;
    });
  },
});

export const selectRecommendedStatus = (state: RootState) => {
  return state.recommendations.status;
};

export const selectRecommendedArtistTracks = (state: RootState) => {
  return state.recommendations.artists;
};

export const selectRecommendedPlaylistTracks = (state: RootState) => {
  return state.recommendations.playlistTracks;
};

export default recommendationSlice.reducer;
