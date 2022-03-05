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

// Fetch albums of an artist
export const getAlbum = createAsyncThunk(
  "album/getAlbum",
  async (data: { id: string; query?: string }) => {
    const { id } = data;
    const response = await axios.get(`/albums/${id}`);
    return response.data;
  }
);

// Fetch all albums of an artist
export const getAlbumDiscography = createAsyncThunk(
  "album/getArtistAlbums",
  async (data: { id: string }) => {
    const response = await axios.get(
      `/artists/${data.id}/albums/?include_groups=album&limit=10`
    );
    return response.data;
  }
);

// Check if one or more tracks is already saved in liked songs
export const checkSavedAlbumTracks = createAsyncThunk(
  "album/checkSavedAlbumTrack",
  async (ids: string[]) => {
    const response = await axios.get(`/me/tracks/contains?ids=${ids}`);
    return response.data;
  }
);

// Save track to your liked songs
export const saveAlbumTrack = createAsyncThunk(
  "album/saveTrack",
  async (id: string) => {
    await axios.put(`/me/tracks?ids=${id}`, {});
    return id;
  }
);

// Save track to your liked songs
export const removeAlbumTrack = createAsyncThunk(
  "album/removeTrack",
  async (id: string) => {
    await axios.delete(`/me/tracks?ids=${id}`, {});
    return id;
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
    builder.addCase(getAlbumDiscography.fulfilled, (state, action) => {
      state.albumDiscography = action.payload;
    });
    builder.addCase(checkSavedAlbumTracks.fulfilled, (state, action) => {
      state.album.tracks.items?.map((track, index) => {
        track.is_saved = action.payload[index];
      });

      const groupedTrack = groupBy(state.album.tracks?.items, "disc_number");
      const albumDisc = Object.keys(groupedTrack).map((i) => groupedTrack[i]);
      state.albumDisc = albumDisc;
    });
    builder.addCase(saveAlbumTrack.fulfilled, (state, action) => {
      const list = state.album.tracks.items;
      const index = list.findIndex((track) => track.id === action.payload);
      state.album.tracks.items[index].is_saved = true;
    });
    builder.addCase(removeAlbumTrack.fulfilled, (state, action) => {
      const list = state.album.tracks.items;
      const index = list.findIndex((track) => track.id === action.payload);
      state.album.tracks.items[index].is_saved = false;
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

export const { countAlbumDuration } = AlbumSlice.actions;

export default AlbumSlice.reducer;
