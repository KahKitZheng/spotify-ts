import axios from "axios";
import { RootState } from "../app/store";
import { Playlist, Track } from "../types/SpotifyObjects";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

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
export const getPlaylistInfo = createAsyncThunk(
  "playlist/getPlaylistInfo",
  async (data: fetchParams) => {
    const { playlist_id } = data;
    const response = await axios.get(`/playlists/${playlist_id}`);
    console.log(response.data);

    return response.data;
  }
);

// Fetch remaining tracks of playlist
export const getPlaylistTracksWithOffset = createAsyncThunk(
  "playlist/getPlaylistTracksWithOffset",
  async (url: string) => {
    const response = await axios.get(url);
    return response.data;
  }
);

// Check if playlist is already saved in current user's library
export const checkSavedPlaylist = createAsyncThunk(
  "playlist/checkSavedPlaylist",
  async (data: { playlist_id: string; userId: string }) => {
    const response = await axios.get(
      `/playlists/${data.playlist_id}/followers/contains?ids=${data.userId}`
    );
    return response.data;
  }
);

// Save playlist to current user's library
export const savePlaylist = createAsyncThunk(
  "playlist/savePlaylist",
  async (playlist_id: string) => {
    await axios.put(`/playlists/${playlist_id}/followers`, {});
  }
);

// Remove playlist from current user's library
export const removeSavedPlaylist = createAsyncThunk(
  "playlist/removeSavedPlaylist",
  async (playlist_id: string) => {
    await axios.delete(`/playlists/${playlist_id}/followers`, {});
  }
);

// Check if one or more tracks is already saved in liked songs
export const checkSavedPlaylistTracks = createAsyncThunk(
  "playlist/checkSavedPlaylistTracks",
  async (data: { startIndex: number; ids: string[] }) => {
    const response = await axios.get(`/me/tracks/contains?ids=${data.ids}`);
    return response.data;
  }
);

// Save playlist track to your liked songs
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

// Edit current playlist details
export const editCurrentPlaylistDetails = createAsyncThunk(
  "playlist/EditCurrentPlaylistDetails",
  async (data: { id: string; name: string; description: string }) => {
    const { id, name, description } = data;
    await axios.put(`/playlists/${id}`, { name, description });
  }
);

// Add track to playlist
export const addTrackToPlaylist = createAsyncThunk(
  "playlist/AddTrackToPlaylist",
  async (data: { playlist_id: string; uris: string[] }) => {
    const { playlist_id, uris } = data;
    const response = await axios.post(`/playlists/${playlist_id}/tracks`, {
      uris,
    });
    return response.data;
  }
);

// Add track to playlist store
export const addTrackToPlaylistData = createAsyncThunk(
  "playlist/AddTrackToPlaylistData",
  async (id: string) => {
    const response = await axios.get(`/tracks/${id}`);
    return response.data;
  }
);

export const playlistSlice = createSlice({
  name: "playlist",
  initialState: initialState,
  reducers: {
    setPlaylistStatus: (state, action) => {
      state.status = action.payload;
    },
    countPlaylistDuration: (state) => {
      const tracklist = state.playlist.tracks.items;

      state.playlistDuration = tracklist.reduce(
        (total, item) => total + item.track.duration_ms,
        0
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPlaylistInfo.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.playlist = action.payload;
    });
    builder.addCase(checkSavedPlaylist.fulfilled, (state, action) => {
      state.playlist.is_saved = action.payload[0];
    });
    builder.addCase(savePlaylist.fulfilled, (state) => {
      state.playlist.is_saved = true;
    });
    builder.addCase(removeSavedPlaylist.fulfilled, (state) => {
      state.playlist.is_saved = false;
    });
    builder.addCase(checkSavedPlaylistTracks.fulfilled, (state, action) => {
      const playlist = state.playlist.tracks.items;
      const startIndex = action.meta.arg.startIndex;
      const verifyList = action.meta.arg.ids;

      for (let index = 0; index < verifyList.length; index++) {
        playlist[startIndex + index].track.is_saved = action.payload[index];
      }
    });
    builder.addCase(savePlaylistTrack.fulfilled, (state, action) => {
      const list = state.playlist.tracks.items;
      const index = list.findIndex((item) => item.track.id === action.payload);
      state.playlist.tracks.items[index].track.is_saved = true;
    });
    builder.addCase(removeSavedPlaylistTrack.fulfilled, (state, action) => {
      const list = state.playlist.tracks.items;
      const index = list.findIndex((item) => item.track.id === action.payload);
      state.playlist.tracks.items[index].track.is_saved = false;
    });
    builder.addCase(getPlaylistTracksWithOffset.fulfilled, (state, action) => {
      action.payload.next !== null
        ? (state.offsetStatus = "idle")
        : (state.offsetStatus = "succeeded");
      state.playlist.tracks.next = action.payload.next;
      state.playlist.tracks.offset = action.payload.offset;
      state.playlist.tracks.items = state.playlist.tracks.items.concat(
        action.payload.items
      );
    });
    builder.addCase(addTrackToPlaylistData.fulfilled, (state, action) => {
      const now = new Date();
      type userType = "user";

      const playlistItem = {
        added_at: now.toString(),
        added_by: {
          display_name: "",
          external_urls: { spotify: "" },
          followers: undefined,
          href: "",
          id: "",
          images: undefined,
          type: "user" as userType,
          uri: "",
        },
        is_local: false,
        primary_color: null,
        track: action.payload,
        video_thumbnail: {
          url: null,
        },
      };

      state.playlist.tracks.items.push(playlistItem);
    });
    builder.addCase(editCurrentPlaylistDetails.fulfilled, (state, action) => {
      state.playlist.name = action.meta.arg.name;
      state.playlist.description = action.meta.arg.description;
    });
  },
});

export const selectPlaylistStatus = (state: RootState) => {
  return state.playlist.status;
};

export const selectPlaylistOffsetStatus = (state: RootState) => {
  return state.playlist.offsetStatus;
};

export const selectPlaylist = (state: RootState) => {
  return state.playlist.playlist;
};

export const selectPlaylistDuration = (state: RootState) => {
  return state.playlist.playlistDuration;
};

export const { setPlaylistStatus, countPlaylistDuration } =
  playlistSlice.actions;

export default playlistSlice.reducer;
