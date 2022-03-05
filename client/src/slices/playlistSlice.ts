import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { Playlist } from "../types/SpotifyObjects";

interface PlaylistState {
  playlist: Playlist;
  playlistDuration: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  offsetStatus: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: PlaylistState = {
  playlist: {} as Playlist,
  playlistDuration: 0,
  status: "idle",
  offsetStatus: "idle",
};

interface fetchParams {
  playlist_id: string;
  additional_types?: "track" | "episode";
  fields?: string;
  market?: string;
}

// Fetch playlist
export const getPlaylist = createAsyncThunk(
  "playlist/getPlaylist",
  async (data: fetchParams) => {
    const { playlist_id } = data;
    const response = await axios.get(`/playlists/${playlist_id}`);
    return response.data;
  }
);

// Fetch remaining tracks of playlist
export const getPlaylistWithOffset = createAsyncThunk(
  "playlist/getPlaylistWithOffset",
  async (data: { url: string }) => {
    const response = await axios.get(data.url);
    return response.data;
  }
);

// Check if one or more tracks is already saved in liked songs
export const checkSavedPlaylistTracks = createAsyncThunk(
  "playlist/checkSavedPopularTracks",
  async (ids: string[]) => {
    const response = await axios.get(`/me/tracks/contains?ids=${ids}`);
    return response.data;
  }
);

// Save track to your liked songs
export const savePlaylistTrack = createAsyncThunk(
  "playlist/savePlaylistTrack",
  async (id: string) => {
    await axios.put(`/me/tracks?ids=${id}`, {});
    return id;
  }
);

// Remove a liked playlist track from your liked songs
export const removeSavedPlaylistTrack = createAsyncThunk(
  "playlist/removeSavedPlaylistTrack",
  async (id: string) => {
    await axios.delete(`/me/tracks?ids=${id}`, {});
    return id;
  }
);

export const playlistSlice = createSlice({
  name: "playlist",
  initialState: initialState,
  reducers: {
    countPlaylistDuration: (state) => {
      const tracklist = state.playlist.tracks.items;

      state.playlistDuration = tracklist.reduce(
        (total, item) => total + item.track.duration_ms,
        0
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPlaylist.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getPlaylist.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.playlist = action.payload;
      })
      .addCase(getPlaylist.rejected, (state) => {
        state.status = "failed";
      });
    builder.addCase(checkSavedPlaylistTracks.fulfilled, (state, action) => {
      state.playlist.tracks.items?.map((track, index) => {
        track.track.is_saved = action.payload[index];
      });
    });
    builder.addCase(savePlaylistTrack.fulfilled, (state, action) => {
      const list = state.playlist.tracks.items;
      const index = list.findIndex(
        (track) => track.track.id === action.payload
      );
      state.playlist.tracks.items[index].track.is_saved = true;
    });
    builder.addCase(removeSavedPlaylistTrack.fulfilled, (state, action) => {
      const list = state.playlist.tracks.items;
      const index = list.findIndex(
        (track) => track.track.id === action.payload
      );
      state.playlist.tracks.items[index].track.is_saved = false;
    });
    builder
      .addCase(getPlaylistWithOffset.pending, (state) => {
        state.offsetStatus = "loading";
      })
      .addCase(getPlaylistWithOffset.fulfilled, (state, action) => {
        if (action.payload.next === null) {
          state.offsetStatus = "succeeded";
          state.playlist.tracks.next = action.payload.next;
          state.playlist.tracks.offset = action.payload.offset;
          state.playlist.tracks.items = state.playlist.tracks.items.concat(
            action.payload.items
          );
        } else {
          state.offsetStatus = "idle";
          state.playlist.tracks.next = action.payload.next;
          state.playlist.tracks.offset = action.payload.offset;
          state.playlist.tracks.items = state.playlist.tracks.items.concat(
            action.payload.items
          );
        }
      })
      .addCase(getPlaylistWithOffset.rejected, (state) => {
        state.offsetStatus = "failed";
      });
  },
});

export const selectPlaylist = (state: RootState) => {
  return state.playlist.playlist;
};

export const selectPlaylistDuration = (state: RootState) => {
  return state.playlist.playlistDuration;
};

export const { countPlaylistDuration } = playlistSlice.actions;

export default playlistSlice.reducer;
