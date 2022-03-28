import axios from "axios";
import { random } from "../utils";
import { RootState } from "../app/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Artist, RecommendationSeed, Track } from "../types/SpotifyObjects";

interface RecommendationResponse {
  seeds: RecommendationSeed[];
  tracks: Track[];
}

interface RecommendationState {
  homeSeedArtist: Artist;
  artistsTracks: RecommendationResponse;
  playlistTracks: RecommendationResponse;
  artistTracksStatus: "idle" | "loading" | "succeeded" | "failed";
  playlistTracksStatus: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: RecommendationState = {
  homeSeedArtist: {} as Artist,
  artistsTracks: {} as RecommendationResponse,
  playlistTracks: {} as RecommendationResponse,
  artistTracksStatus: "idle",
  playlistTracksStatus: "idle",
};

export const recommendArtistTracks = createAsyncThunk(
  "recommendation/recommendArtistTracks",
  async (data: { seed: string[]; limit?: number }) => {
    const { seed, limit = 20 } = data;
    const response = await axios.get(`/recommendations?seed_artists=${seed.join()}&limit=${limit}`);
    return response.data;
  }
);

export const recommendPlaylistTracks = createAsyncThunk(
  "recommendation/recommendPlaylistTracks",
  async (data: { seed: string[]; limit?: number }) => {
    const { seed, limit = 20 } = data;
    const response = await axios.get(`/recommendations?seed_tracks=${seed.join()}&limit=${limit}`);
    return response.data;
  }
);

export const replaceRecommendationTrack = createAsyncThunk(
  "recommendation/replaceRecommendationTrack",
  async (data: { id: string }, thunkApi) => {
    const seed = [];
    const state = thunkApi.getState() as RootState;
    const playlistItems = state.recommendations.playlistTracks;

    if (0 < playlistItems.tracks?.length && playlistItems.tracks?.length <= 5) {
      playlistItems.tracks.forEach((item) => {
        seed.push(item.id);
      });
    }

    if (playlistItems.tracks?.length > 5) {
      for (let index = 0; index < 5; index++) {
        const randomSeed = random(1, playlistItems.tracks?.length);
        seed.push(playlistItems.tracks[randomSeed].id);
      }
    }

    const response = await axios.get(`/recommendations?seed_tracks=${seed.join()}&limit=1`);
    return response.data;
  }
);

export const recommendationSlice = createSlice({
  name: "recommendation",
  initialState: initialState,
  reducers: {
    setHomeSeedArtist: (state, action) => {
      state.homeSeedArtist = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(recommendArtistTracks.fulfilled, (state, action) => {
      state.artistsTracks = action.payload;
      state.artistTracksStatus = "succeeded";
    });
    builder.addCase(recommendPlaylistTracks.fulfilled, (state, action) => {
      state.playlistTracks = action.payload;
      state.playlistTracksStatus = "succeeded";
    });
    builder.addCase(replaceRecommendationTrack.fulfilled, (state, action) => {
      const tracks = state.playlistTracks.tracks;
      const trackId = action.meta.arg.id;
      const trackIndex = tracks.findIndex((track) => track.id === trackId);

      state.playlistTracks.tracks[trackIndex] = action.payload.tracks[0];
    });
  },
});

export const selectRecommendedArtistStatus = (state: RootState) => {
  return state.recommendations.artistTracksStatus;
};

export const selectRecommendedPlaylistStatus = (state: RootState) => {
  return state.recommendations.playlistTracksStatus;
};

export const selectRecommendedArtistTracks = (state: RootState) => {
  return state.recommendations.artistsTracks;
};

export const selectRecommendedPlaylistTracks = (state: RootState) => {
  return state.recommendations.playlistTracks;
};

export const selectHomeSeedArtist = (state: RootState) => {
  return state.recommendations.homeSeedArtist;
};

export const { setHomeSeedArtist } = recommendationSlice.actions;

export default recommendationSlice.reducer;
