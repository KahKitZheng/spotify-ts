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
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: RecommendationState = {
  artists: {} as RecommendationResponse,
  status: "idle",
};

type fetchArtistParams = {
  seed: string;
  limit: number;
};

export const getArtistRecommendation = createAsyncThunk(
  "recommendation/getArtistRecommendation",
  async (data: fetchArtistParams) => {
    const { seed, limit = 20 } = data;
    const response = await axios.get(
      `/recommendations?seed_artists=${seed}&limit=${limit}`
    );
    return response.data;
  }
);

export const recommendationSlice = createSlice({
  name: "recommendation",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getArtistRecommendation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getArtistRecommendation.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.artists = action.payload;
      })
      .addCase(getArtistRecommendation.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const selectArtistRecommendation = (state: RootState) => {
  return state.recommendations.artists;
};

export default recommendationSlice.reducer;
