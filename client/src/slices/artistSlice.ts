import axios from "../app/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import {
  GetArtistAlbumsResponse,
  GetArtistTopTracksResponse,
  GetRelatedArtistsResponse,
} from "@/types/SpotifyResponses";
import { Artist } from "@/types/SpotifyObjects";

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
  async (id: string) => {
    const response = await axios.get(`/artists/${id}`);
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

// Fetch artist albums
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

// Fetch the artist's top 10 tracks
export const getArtistTopTracks = createAsyncThunk(
  "artist/getArtistTopTracks",
  async (data: { id: string; market: string }) => {
    const response = await axios.get(
      `/artists/${data.id}/top-tracks?market=${data.market}`
    );
    return response.data;
  }
);

// Fetch artist's related artists
export const getRelatedArtists = createAsyncThunk(
  "artist/getArtistRelatedArtists",
  async (id: string) => {
    const response = await axios.get(`/artists/${id}/related-artists`);
    return response.data;
  }
);

// Check if current user follows artist
export const checkSavedArtist = createAsyncThunk(
  "artist/checkSavedArtist",
  async (ids: string) => {
    const response = await axios.get(
      `me/following/contains?type=artist&ids=${ids}`
    );
    return response.data;
  }
);

// Save artist to your library
export const saveArtist = createAsyncThunk(
  "artist/saveArtist",
  async (id: string) => {
    await axios.put(`/me/following?type=artist&ids=${id}`, {});
    // return id;
  }
);

// Remove artist track from your library
export const removeSavedArtist = createAsyncThunk(
  "artist/removeSavedArtist",
  async (id: string) => {
    await axios.delete(`/me/following?type=artist&ids=${id}`, {});
    // return id;
  }
);

// Check if one or more tracks is already saved in liked songs
export const checkSavedPopularTracks = createAsyncThunk(
  "artist/checkSavedPopularTracks",
  async (ids: string[]) => {
    const response = await axios.get(`/me/tracks/contains?ids=${ids}`);
    return response.data;
  }
);

// Save artist track to your liked songs
export const savePopularArtistTrack = createAsyncThunk(
  "artist/savePopularArtistTrack",
  async (id: string) => {
    await axios.put(`/me/tracks?ids=${id}`, {});
    return id;
  }
);

// Remove a liked popular artist track from your liked songs
export const removeSavedPopularArtistTrack = createAsyncThunk(
  "artist/removeSavedPopularArtistTrack",
  async (id: string) => {
    await axios.delete(`/me/tracks?ids=${id}`, {});
    return id;
  }
);

export const ArtistSlice = createSlice({
  name: "Artist",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getArtist.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.artist = action.payload;
    });

    builder.addCase(getArtistAlbums.fulfilled, (state, action) => {
      state.albums = action.payload;
    });

    builder.addCase(getArtistTopTracks.fulfilled, (state, action) => {
      state.topTracks = action.payload;
    });

    builder.addCase(getRelatedArtists.fulfilled, (state, action) => {
      state.relatedArtists = action.payload;
    });

    builder.addCase(checkSavedArtist.fulfilled, (state, action) => {
      state.artist.is_saved = action.payload[0];
    });

    builder.addCase(saveArtist.fulfilled, (state) => {
      state.artist.is_saved = true;
    });

    builder.addCase(removeSavedArtist.fulfilled, (state) => {
      state.artist.is_saved = false;
    });

    builder.addCase(checkSavedPopularTracks.fulfilled, (state, action) => {
      state.topTracks.tracks?.map((track, index) => {
        track.is_saved = action.payload[index];
      });
    });

    builder.addCase(savePopularArtistTrack.fulfilled, (state, action) => {
      const list = state.topTracks.tracks;
      const index = list.findIndex((track) => track.id === action.payload);
      state.topTracks.tracks[index].is_saved = true;
    });

    builder.addCase(
      removeSavedPopularArtistTrack.fulfilled,
      (state, action) => {
        const list = state.topTracks.tracks;
        const index = list.findIndex((track) => track.id === action.payload);
        state.topTracks.tracks[index].is_saved = false;
      }
    );
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

export default ArtistSlice.reducer;
