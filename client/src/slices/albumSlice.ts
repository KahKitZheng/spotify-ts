import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { Album } from "../types/SpotifyObjects";

interface AlbumState {
  album: Album;
  albumDuration: number;
  status: "idle" | "loading" | "succeeded" | "failed";
}

export const initialState: AlbumState = {
  album: {} as Album,
  albumDuration: 0,
  status: "idle",
};

interface fetchParams {
  id: string;
  query?: string;
}

export const getAlbum = createAsyncThunk(
  "album/getAlbum",
  async (data: fetchParams) => {
    const { id } = data;
    const response = await axios.get(`/albums/${id}`);
    return response.data;
  }
);

export const AlbumSlice = createSlice({
  name: "Album",
  initialState: initialState,
  reducers: {
    countAlbumDuration: (state) => {
      let albumDuration = 0;
      const albumTracks = state.album.tracks.items;
      albumTracks.forEach((item) => (albumDuration += item.duration_ms));
      state.albumDuration = albumDuration;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAlbum.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAlbum.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.album = action.payload;
      })
      .addCase(getAlbum.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const selectAlbum = (state: RootState) => {
  return state.album.album;
};

export const selectAlbumDuration = (state: RootState) => {
  return state.album.albumDuration;
};

export const { countAlbumDuration } = AlbumSlice.actions;

export default AlbumSlice.reducer;