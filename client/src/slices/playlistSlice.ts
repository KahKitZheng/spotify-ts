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

/** Fetch playlist  */
export const getPlaylistInfo = createAsyncThunk(
  "playlist/getPlaylistInfo",
  async (data: fetchParams) => {
    const { playlist_id } = data;
    const response = await axios.get(`/playlists/${playlist_id}`);
    return response.data;
  }
);

//** Fetch the offset playlist tracks */
export const getPlaylistTracksWithOffset = createAsyncThunk(
  "playlist/getPlaylistTracksWithOffset",
  async (data: { startIndex: number; url: string }) => {
    const response = await axios.get(data.url);
    return response.data;
  }
);

/** Check if the current user has liked the playlist */
export const checkSavedPlaylist = createAsyncThunk(
  "playlist/checkSavedPlaylist",
  async (data: { playlist_id: string; userId: string }) => {
    const response = await axios.get(
      `/playlists/${data.playlist_id}/followers/contains?ids=${data.userId}`
    );
    return response.data;
  }
);

/** Save the playlist to current user's library */
export const savePlaylist = createAsyncThunk(
  "playlist/savePlaylist",
  async (playlist_id: string) => {
    await axios.put(`/playlists/${playlist_id}/followers`, {});
  }
);

/** Remove the playlist from current user's library */
export const removeSavedPlaylist = createAsyncThunk(
  "playlist/removeSavedPlaylist",
  async (playlist_id: string) => {
    await axios.delete(`/playlists/${playlist_id}/followers`, {});
  }
);

/** Check which playlist tracks the current user has liked */
export const checkSavedPlaylistTracks = createAsyncThunk(
  "playlist/checkSavedPlaylistTracks",
  async (data: { startIndex: number; ids: string[] }) => {
    const response = await axios.get(`/me/tracks/contains?ids=${data.ids}`);
    return response.data;
  }
);

/** Save playlist track to curent user's liked songs */
export const savePlaylistTrack = createAsyncThunk(
  "playlist/savePlaylistTrack",
  async (id: string) => {
    await axios.put(`/me/tracks?ids=${id}`, {});
    return id;
  }
);

/** Remove playlist track from current user's liked songs */
export const removeSavedPlaylistTrack = createAsyncThunk(
  "playlist/removeSavedPlaylistTrack",
  async (id: string) => {
    await axios.delete(`/me/tracks?ids=${id}`, {});
    return id;
  }
);

/** Edit current playlist details  */
export const editCurrentPlaylistDetails = createAsyncThunk(
  "playlist/EditCurrentPlaylistDetails",
  async (data: { id: string; name: string; description: string }) => {
    const { id, name, description } = data;
    await axios.put(`/playlists/${id}`, { name, description });
  }
);

/** Add track to playlist */
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

/** Add track to playlist store */
export const addTrackToPlaylistData = createAsyncThunk(
  "playlist/addTrackToPlaylistData",
  async (id: string, thunkApi) => {
    type User = "user";
    const now = new Date();
    const response = await axios.get(`/tracks/${id}`);
    const state = thunkApi.getState() as RootState;
    const user = state.currentUser.user;

    const playlistItem = {
      added_at: now.toISOString(),
      added_by: {
        display_name: user.display_name,
        external_urls: user.external_urls,
        followers: undefined,
        href: user.href,
        id: user.id,
        images: user.images,
        type: "user" as User,
        uri: user.uri,
      },
      is_local: false,
      primary_color: null,
      track: response.data as Track,
      video_thumbnail: {
        url: null,
      },
    };

    return playlistItem;
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
      state.playlistDuration = state.playlist.tracks.items.reduce(
        (total, item) => total + item.track.duration_ms,
        0
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPlaylistInfo.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.playlist = action.payload;
      state.playlist.tracks.items = action.payload.tracks.items.filter(
        (item: Track) => item.track !== null
      );
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
      const playlistItems = state.playlist.tracks.items;
      const playlistTotal = state.playlist.tracks.total;

      const startIndex = action.meta.arg.startIndex;
      const offsetItems = action.payload.items.length;
      const resultSize = startIndex + offsetItems;
      const exceedingSize = startIndex + offsetItems * 2;

      if (resultSize <= playlistTotal || exceedingSize - playlistTotal <= 50) {
        action.payload.next !== null
          ? (state.offsetStatus = "idle")
          : (state.offsetStatus = "succeeded");

        state.playlist.tracks.next = action.payload.next;
        state.playlist.tracks.offset = action.payload.offset;

        for (let index = 0; index < offsetItems.length; index++) {
          if (action.payload.items[index].track !== null) {
            playlistItems[startIndex + index] = action.payload.items[index];
          }
        }
      }
    });

    builder.addCase(checkSavedPlaylistTracks.fulfilled, (state, action) => {
      const playlist = state.playlist.tracks.items;
      const startIndex = action.meta.arg.startIndex;
      const verifyList = action.meta.arg.ids;

      for (let index = 0; index < verifyList.length; index++) {
        if (playlist[startIndex + index].track !== null) {
          playlist[startIndex + index].track.is_saved = action.payload[index];
        }
      }
    });

    builder.addCase(addTrackToPlaylistData.fulfilled, (state, action) => {
      state.playlist.tracks.items = [
        ...state.playlist.tracks.items,
        action.payload,
      ];
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

export const selectPlaylist = (state: RootState) => {
  return state.playlist.playlist;
};

export const selectPlaylistDuration = (state: RootState) => {
  return state.playlist.playlistDuration;
};

export const { setPlaylistStatus, countPlaylistDuration } =
  playlistSlice.actions;

export default playlistSlice.reducer;
