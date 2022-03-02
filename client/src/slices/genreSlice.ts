import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { RecommendationSeed, Track } from "../types/SpotifyObjects";

interface RecommendationResponse {
  seeds: RecommendationSeed[];
  tracks: Track[];
}

interface GenreState {
  genreTracks: RecommendationResponse;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: GenreState = {
  genreTracks: {} as RecommendationResponse,
  status: "idle",
};

interface fechParams {
  category: string;
  artist: string;
  limit: number;
  market: string;
}

export const recommendGenreTracks = createAsyncThunk(
  "genre/recommendGenreTracks",
  async (data: fechParams) => {
    const { category, artist, limit = 30, market } = data;
    const response = await axios.get(
      `/recommendations?seed_genres=${category}&seed_artists=${artist}&limit=${limit}&market=${market}`
    );
    return response.data;
  }
);

export const genreSlice = createSlice({
  name: "genre",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(recommendGenreTracks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(recommendGenreTracks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.genreTracks = action.payload;
      })
      .addCase(recommendGenreTracks.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const selectGenreTracks = (state: RootState) => {
  return state.genre.genreTracks;
};

export const selectGenreStatus = (state: RootState) => {
  return state.genre.status;
};

export default genreSlice.reducer;
