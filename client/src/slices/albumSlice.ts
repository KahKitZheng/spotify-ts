import axios from "axios";
import { groupBy } from "../utils";
import { RootState } from "../app/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Album, Paging, SimplifiedTrack } from "../types/SpotifyObjects";

interface AlbumState {
  album: Album;
  albumDuration: number;
  albumDisc: SimplifiedTrack[][];
  albumDiscography: Paging<Album>;
  status: "idle" | "loading" | "succeeded" | "failed";
}

export const initialState: AlbumState = {
  album: {} as Album,
  albumDuration: 0,
  albumDisc: [] as SimplifiedTrack[][],
  albumDiscography: {} as Paging<Album>,
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

export const getAlbumDiscography = createAsyncThunk(
  "album/getArtistAlbums",
  async (data: { id: string }) => {
    const response = await axios.get(
      `/artists/${data.id}/albums/?include_groups=album&limit=10`
    );
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
    groupTracksByDisc: (state) => {
      if (state.album.tracks.items?.length !== 0) {
        const groupedTrack = groupBy(state.album.tracks?.items, "disc_number");
        const albumDisc = Object.keys(groupedTrack).map((i) => groupedTrack[i]);
        state.albumDisc = albumDisc;
      }
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
    builder
      .addCase(getAlbumDiscography.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAlbumDiscography.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.albumDiscography = action.payload;
      })
      .addCase(getAlbumDiscography.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const selectAlbumStatus = (state: RootState) => {
  return state.album.status;
};

export const selectAlbum = (state: RootState) => {
  return state.album.album;
};

export const selectAlbumDuration = (state: RootState) => {
  return state.album.albumDuration;
};

export const selectAlbumDisc = (state: RootState) => {
  return state.album.albumDisc;
};

export const selectAlbumDiscography = (state: RootState) => {
  return state.album.albumDiscography;
};

export const { countAlbumDuration, groupTracksByDisc } = AlbumSlice.actions;

export default AlbumSlice.reducer;
