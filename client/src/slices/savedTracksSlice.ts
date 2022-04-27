import axios from "../app/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { GetSavedTracksResponse } from "../types/SpotifyResponses";

interface GenreState {
  savedTracks: GetSavedTracksResponse;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: GenreState = {
  savedTracks: {} as GetSavedTracksResponse,
  status: "idle",
};

export const fetchSavedTracks = createAsyncThunk(
  "savedTracks/fetchSavedTracks",
  async (data: { limit: number }) => {
    const response = await axios.get(`/me/tracks?limit=${data.limit}`);
    return response.data;
  }
);

export const fetchOffsetSavedTrack = createAsyncThunk(
  "savedTracks/fetchOffsetSavedTrack",
  async (url: string) => {
    const response = await axios.get(url);
    return response.data;
  }
);

export const removeSavedTrack = createAsyncThunk(
  "savedTracks/removeSavedTrack",
  async (id: string) => {
    await axios.delete(`/me/tracks?ids=${id}`, {});
    return id;
  }
);

export const savedTracksSlice = createSlice({
  name: "savedTracks",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSavedTracks.fulfilled, (state, action) => {
      state.savedTracks = action.payload;
    });

    builder.addCase(fetchOffsetSavedTrack.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(fetchOffsetSavedTrack.fulfilled, (state, action) => {
      const updatedList = [...state.savedTracks.items, ...action.payload.items];

      state.savedTracks.next = action.payload.next;
      state.savedTracks.offset = action.payload.offset;
      state.savedTracks.previous = action.payload.previous;
      state.savedTracks.limit = action.payload.limit;
      state.savedTracks.items = updatedList;

      state.status = "idle";
    });

    builder.addCase(removeSavedTrack.fulfilled, (state, action) => {
      const list = state.savedTracks.items;
      const index = list.findIndex((item) => item.track.id === action.payload);

      list[index].track.is_saved = false;
      list.splice(index, 1);
    });
  },
});

export const selectSavedTracks = (state: RootState) => {
  return state.savedTracks.savedTracks;
};

export const selectSavedTracksStatus = (state: RootState) => {
  return state.savedTracks.status;
};

export default savedTracksSlice.reducer;
