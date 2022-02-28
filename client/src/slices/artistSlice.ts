import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import {
  GetArtistAlbumsResponse,
  GetArtistTopTracksResponse,
  GetRelatedArtistsResponse,
} from "../types/SpotifyResponses";
import { Artist } from "../types/SpotifyObjects";

interface ArtistState {
  artist: Artist;
  albums: GetArtistAlbumsResponse;
  topTracks: GetArtistTopTracksResponse;
  relatedArtists: GetRelatedArtistsResponse;
  status: "idle" | "loading" | "succeeded" | "failed";
}

export const initialState: ArtistState = {
  artist: {} as Artist,
  albums: {} as GetArtistAlbumsResponse,
  topTracks: {} as GetArtistTopTracksResponse,
  relatedArtists: {} as GetRelatedArtistsResponse,
  status: "idle",
};

export const getArtist = createAsyncThunk(
  "artist/getArtist",
  async (data: { id: string }) => {
    const response = await axios.get(`/artists/${data.id}`);
    return response.data;
  }
);

interface fetchArtistAlbumParams {
  id: string;
  include_groups?: string;
  limit?: number;
  market?: string;
  offset?: number;
}

export const getArtistAlbums = createAsyncThunk(
  "artist/getArtistAlbum",
  async (data: fetchArtistAlbumParams) => {
    const { id, limit = 50, offset = 0 } = data;
    const response = await axios.get(
      `artists/${id}/albums?limit=${limit}&offset=${offset}`
    );
    return response.data;
  }
);

export const getArtistTopTracks = createAsyncThunk(
  "artist/getArtistTopTracks",
  async (data: { id: string; market: string }) => {
    const response = await axios.get(
      `/artists/${data.id}/top-tracks?market=${data.market}`
    );
    return response.data;
  }
);

export const getRelatedArtists = createAsyncThunk(
  "artist/getArtistRelatedArtists",
  async (data: { id: string }) => {
    const response = await axios.get(`/artists/${data.id}/related-artists`);
    return response.data;
  }
);

export const ArtistSlice = createSlice({
  name: "Artist",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getArtist.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getArtist.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.artist = action.payload;
      })
      .addCase(getArtist.rejected, (state) => {
        state.status = "failed";
      });
    builder
      .addCase(getArtistAlbums.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getArtistAlbums.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.albums = action.payload;
      })
      .addCase(getArtistAlbums.rejected, (state) => {
        state.status = "failed";
      });
    builder
      .addCase(getArtistTopTracks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getArtistTopTracks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.topTracks = action.payload;
      })
      .addCase(getArtistTopTracks.rejected, (state) => {
        state.status = "failed";
      });
    builder
      .addCase(getRelatedArtists.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getRelatedArtists.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.relatedArtists = action.payload;
      })
      .addCase(getRelatedArtists.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const selectArtist = (state: RootState) => {
  return state.artist.artist;
};

export const selectArtistAlbum = (state: RootState) => {
  return state.artist.albums;
};

export const selectArtistTopTracks = (state: RootState) => {
  return state.artist.topTracks;
};

export const selectRelatedArtists = (state: RootState) => {
  return state.artist.relatedArtists;
};

export const selectArtistStatus = (state: RootState) => {
  return state.artist.status;
};

export default ArtistSlice.reducer;
