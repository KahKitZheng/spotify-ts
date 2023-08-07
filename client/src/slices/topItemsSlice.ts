import axios from "../app/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Paging, Track, Artist } from "@/types/SpotifyObjects";
import { RootState } from "../app/store";

export type TimeRange = "short_term" | "medium_term" | "long_term";

interface TopArtists {
  short_term: Paging<Artist>;
  medium_term: Paging<Artist>;
  long_term: Paging<Artist>;
}

interface TopTracks {
  short_term: Paging<Track>;
  medium_term: Paging<Track>;
  long_term: Paging<Track>;
}

interface TopItemsState {
  topArtists: TopArtists;
  topTracks: TopTracks;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: TopItemsState = {
  topArtists: {} as TopArtists,
  topTracks: {} as TopTracks,
  status: "idle",
};

interface CheckSavedTrackProps {
  ids: string[];
  time_range: TimeRange;
}
interface ChangeTrackProps {
  id: string;
  time_range: TimeRange;
}

interface fetchParams {
  limit?: number;
  offset?: number;
  time_range: TimeRange;
}

// Fetch top artists of current user
export const getTopArtists = createAsyncThunk(
  "topItems/getTopArtists",
  async (data?: fetchParams) => {
    if (data) {
      const { limit = 20, offset = 0, time_range = "medium_term" } = data;
      const response = await axios.get(
        `/me/top/artists?limit=${limit}&offset=${offset}&time_range=${time_range}`
      );
      return response.data;
    } else {
      const response = await axios.get(
        `/me/top/artists?limit=20&offset=0&time_range=medium_term`
      );
      return response.data;
    }
  }
);

// Fetch top tracks of current user
export const getTopTracks = createAsyncThunk(
  "topItems/getTopTracks",
  async (data?: fetchParams) => {
    if (data) {
      const { limit = 20, offset = 0, time_range = "medium_term" } = data;
      const response = await axios.get(
        `/me/top/tracks?limit=${limit}&offset=${offset}&time_range=${time_range}`
      );
      return response.data;
    } else {
      const response = await axios.get(
        `/me/top/tracks?limit=20&offset=0&time_range=short_term`
      );
      return response.data;
    }
  }
);

// Check if one or more tracks is already saved in liked songs
export const checkSavedTopTracks = createAsyncThunk(
  "topItems/checkSavedTopTracks",
  async (data: CheckSavedTrackProps) => {
    const response = await axios.get(`/me/tracks/contains?ids=${data.ids}`);
    return response.data;
  }
);

// Save top track to your liked songs
export const saveTopTrack = createAsyncThunk(
  "topItems/saveTopTrack",
  async (data: ChangeTrackProps) => {
    await axios.put(`/me/tracks?ids=${data.id}`, {});
    return data.id;
  }
);

// Remove a liked top track from your liked songs
export const removeSavedTopTrack = createAsyncThunk(
  "topItems/removeSavedTopTrack",
  async (data: ChangeTrackProps) => {
    await axios.delete(`/me/tracks?ids=${data.id}`, {});
    return data.id;
  }
);

export const topItemsSlice = createSlice({
  name: "topItems",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTopArtists.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getTopArtists.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.meta.arg !== undefined) {
          state.topArtists[action.meta.arg.time_range] = action.payload;
        }
      })
      .addCase(getTopArtists.rejected, (state) => {
        state.status = "failed";
      });
    builder.addCase(getTopTracks.fulfilled, (state, action) => {
      state.status = "succeeded";
      if (action.meta.arg !== undefined) {
        state.topTracks[action.meta.arg.time_range] = action.payload;
      }
    });
    builder.addCase(checkSavedTopTracks.fulfilled, (state, action) => {
      const timeRange = action.meta.arg.time_range;
      state.topTracks[timeRange].items?.map((track, index) => {
        track.is_saved = action.payload[index];
      });
    });
    builder.addCase(saveTopTrack.fulfilled, (state, action) => {
      const timeRange = action.meta.arg.time_range;
      const list = state.topTracks[timeRange].items;
      const index = list.findIndex((track) => track.id === action.payload);
      state.topTracks[timeRange].items[index].is_saved = true;
    });
    builder.addCase(removeSavedTopTrack.fulfilled, (state, action) => {
      const timeRange = action.meta.arg.time_range;
      const list = state.topTracks[timeRange].items;
      const index = list.findIndex((track) => track.id === action.payload);
      state.topTracks[timeRange].items[index].is_saved = false;
    });
  },
});

export const selectTopArtists = (state: RootState) => {
  return state.topItems.topArtists;
};

export const selectTopTracks = (state: RootState) => {
  return state.topItems.topTracks;
};

export default topItemsSlice.reducer;
