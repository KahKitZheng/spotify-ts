import axios from "../app/axios";
import { RootState } from "../app/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Paging, SimplifiedPlaylist } from "@/types/SpotifyObjects";

interface UserPlaylistsState {
  userPlaylists: Paging<SimplifiedPlaylist>;
  status: "idle" | "loading" | "succeeded" | "failed";
  offsetStatus: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: UserPlaylistsState = {
  userPlaylists: {} as Paging<SimplifiedPlaylist>,
  status: "idle",
  offsetStatus: "idle",
};

export const getCurrentUserPlaylists = createAsyncThunk(
  "userSavedPlaylists/getCurrentUserPlaylists",
  async (data: { limit: number; offset?: number }) => {
    const { limit = 20, offset = 0 } = data;
    const response = await axios.get(
      `/me/playlists?limit=${limit}&offset=${offset}`
    );
    return response.data;
  }
);

// Fetch current user's remaining playlists
export const getPlaylistWithOffset = createAsyncThunk(
  "userSavedPlaylists/getPlaylistWithOffset",
  async (data: { url: string }) => {
    const response = await axios.get(data.url);
    return response.data;
  }
);

// Create new playlist
export const createPlaylist = createAsyncThunk(
  "userSavedPlaylists/createPlaylist",
  async (data: { user_id: string; name: string }) => {
    const { user_id, name } = data;
    const response = await axios.post(`/users/${user_id}/playlists`, { name });
    return response.data;
  }
);

// Edit playlist details
export const editPlaylistDetails = createAsyncThunk(
  "userSavedPlaylists/editPlaylistDetails",
  async (data: { id: string; name: string; description: string }) => {
    const { id, name, description } = data;
    await axios.put(`/playlists/${id}`, { name, description });
  }
);

export const userPlaylistsSlice = createSlice({
  name: "userSavedPlaylists",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCurrentUserPlaylists.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.userPlaylists = action.payload;
    });
    builder.addCase(getPlaylistWithOffset.fulfilled, (state, action) => {
      action.payload.next === null
        ? (state.offsetStatus = "succeeded")
        : (state.offsetStatus = "idle");
      state.userPlaylists.next = action.payload.next;
      state.userPlaylists.offset = action.payload.offset;
      state.userPlaylists.items = state.userPlaylists.items.concat(
        action.payload.items
      );
    });
    builder.addCase(createPlaylist.fulfilled, (state, action) => {
      const playlist = action.payload;
      playlist.description = "";
      state.userPlaylists.items = [playlist, ...state.userPlaylists.items];
    });
    builder.addCase(editPlaylistDetails.fulfilled, (state, action) => {
      const index = state.userPlaylists.items.findIndex(
        (playlist) => playlist.id === action.meta.arg.id
      );
      state.userPlaylists.items[index].name = action.meta.arg.name;
      state.userPlaylists.items[index].description =
        action.meta.arg.description;
    });
  },
});

export const selectUserPlaylists = (state: RootState) => {
  return state.currentUserPlaylists.userPlaylists;
};

export const selectPlaylistsStatus = (state: RootState) => {
  return state.currentUserPlaylists.status;
};

export const selectPlaylistsOffsetStatus = (state: RootState) => {
  return state.currentUserPlaylists.offsetStatus;
};

export default userPlaylistsSlice.reducer;
