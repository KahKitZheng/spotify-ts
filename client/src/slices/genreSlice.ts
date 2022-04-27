import axios from "../app/axios";
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

// Save genre track to your liked songs
export const saveGenreTrack = createAsyncThunk(
  "genre/saveGenreTrack",
  async (id: string) => {
    await axios.put(`/me/tracks?ids=${id}`, {});
    return id;
  }
);

// Remove a liked genre artist track from your liked songs
export const removeGenreTrack = createAsyncThunk(
  "genre/removeGenreTrack",
  async (id: string) => {
    await axios.delete(`/me/tracks?ids=${id}`, {});
    return id;
  }
);

export const genreSlice = createSlice({
  name: "genre",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(recommendGenreTracks.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.genreTracks = action.payload;
    });

    builder.addCase(saveGenreTrack.fulfilled, (state, action) => {
      const list = state.genreTracks.tracks;
      const index = list.findIndex((track) => track.id === action.payload);
      state.genreTracks.tracks[index].is_saved = true;
    });

    builder.addCase(removeGenreTrack.fulfilled, (state, action) => {
      const list = state.genreTracks.tracks;
      const index = list.findIndex((track) => track.id === action.payload);
      state.genreTracks.tracks[index].is_saved = false;
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
