import axios from "../app/axios";
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
  offsetStatus: "idle" | "loading" | "succeeded" | "failed";
}

export const initialState: AlbumState = {
  album: {} as Album,
  albumDuration: 0,
  albumDisc: [] as SimplifiedTrack[][],
  albumDiscography: {} as Paging<Album>,
  status: "idle",
  offsetStatus: "idle",
};

/** Fetch album */
export const getAlbum = createAsyncThunk(
  "album/getAlbum",
  async (data: { id: string; query?: string }) => {
    const response = await axios.get(`/albums/${data.id}`);
    return response.data;
  }
);

/** Fetch the offset album tracks */
export const getOffsetAlbumTracks = createAsyncThunk(
  "album/getOffsetAlbumTracks",
  async (data: { startIndex: number; url: string }) => {
    const response = await axios.get(data.url);
    return response.data;
  }
);

/** Fetch ten albums of an artist */
export const getAlbumDiscography = createAsyncThunk(
  "album/getAlbumDiscography",
  async (data: { id: string }) => {
    const response = await axios.get(
      `/artists/${data.id}/albums/?include_groups=album&limit=10`
    );
    return response.data;
  }
);

/** Check if the current user has liked the album */
export const checkSavedAlbum = createAsyncThunk(
  "album/checkSavedAlbum",
  async (id: string) => {
    const response = await axios.get(`/me/albums/contains?ids=${id}`);
    return response.data;
  }
);

/** Save album to current user's library */
export const saveAlbum = createAsyncThunk(
  "album/saveAlbum",
  async (id: string) => {
    await axios.put(`/me/albums?ids=${id}`, {});
  }
);

/** Remove album from current user's library */
export const removeSavedAlbum = createAsyncThunk(
  "album/removeAlbum",
  async (id: string) => {
    await axios.delete(`/me/albums?ids=${id}`, {});
  }
);

/** Check if current user has liked any of album tracks */
export const checkSavedAlbumTracks = createAsyncThunk(
  "album/checkSavedAlbumTracks",
  async (data: { startIndex: number; ids: string[] }) => {
    const response = await axios.get(`/me/tracks/contains?ids=${data.ids}`);
    return response.data;
  }
);

/** Save album track to current user's liked songs */
export const saveAlbumTrack = createAsyncThunk(
  "album/saveAlbumTrack",
  async (id: string) => {
    await axios.put(`/me/tracks?ids=${id}`, {});
    return id;
  }
);

/** Remove album track from current user's liked songs */
export const removeSavedAlbumTrack = createAsyncThunk(
  "album/removeTrack",
  async (id: string) => {
    await axios.delete(`/me/tracks?ids=${id}`, {});
    return id;
  }
);

export const AlbumSlice = createSlice({
  name: "album",
  initialState: initialState,
  reducers: {
    countAlbumDuration: (state) => {
      state.albumDuration = state.album.tracks.items.reduce(
        (total, item) => total + item.duration_ms,
        0
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAlbum.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.album = action.payload;
      state.album.tracks.items = action.payload.tracks.items.filter(
        (item: Album) => item !== null
      );
    });

    builder.addCase(getOffsetAlbumTracks.fulfilled, (state, action) => {
      const albumItems = state.album.tracks.items;
      const albumTotal = state.album.tracks.total;

      const startIndex = action.meta.arg.startIndex;
      const offsetItems = action.payload.items.length;
      const resultSize = startIndex + offsetItems;
      const exceedingSize = startIndex + offsetItems * 2;

      if (resultSize <= albumTotal || exceedingSize - albumTotal <= 50) {
        action.payload.next !== null
          ? (state.offsetStatus = "idle")
          : (state.offsetStatus = "succeeded");

        state.album.tracks.next = action.payload.next;
        state.album.tracks.offset = action.payload.offset;

        for (let index = 0; index < offsetItems; index++) {
          if (action.payload.items[index].track !== null) {
            albumItems[startIndex + index] = action.payload.items[index];
          }
        }
      }
    });

    builder.addCase(getAlbumDiscography.fulfilled, (state, action) => {
      state.albumDiscography = action.payload;
    });

    builder.addCase(checkSavedAlbum.fulfilled, (state, action) => {
      state.album.is_saved = action.payload[0];
    });

    builder.addCase(saveAlbum.fulfilled, (state) => {
      state.album.is_saved = true;
    });

    builder.addCase(removeSavedAlbum.fulfilled, (state) => {
      state.album.is_saved = false;
    });

    builder.addCase(checkSavedAlbumTracks.fulfilled, (state, action) => {
      const album = state.album.tracks.items;
      const startIndex = action.meta.arg.startIndex;
      const verifyList = action.meta.arg.ids;

      for (let index = 0; index < verifyList.length; index++) {
        if (album[startIndex + index] !== null) {
          album[startIndex + index].is_saved = action.payload[index];
        }
      }

      const groupedTrack = groupBy(state.album.tracks?.items, "disc_number");
      const albumDisc = Object.keys(groupedTrack).map((i) => groupedTrack[i]);
      state.albumDisc = albumDisc;
    });

    builder.addCase(saveAlbumTrack.fulfilled, (state, action) => {
      state.albumDisc.map((disc, discIndex) => {
        const trackIndex = disc.findIndex(
          (track) => track.id === action.payload
        );

        if (trackIndex !== -1) {
          state.albumDisc[discIndex][trackIndex].is_saved = true;
        }
      });
    });

    builder.addCase(removeSavedAlbumTrack.fulfilled, (state, action) => {
      state.albumDisc.map((disc, discIndex) => {
        const trackIndex = disc.findIndex(
          (track) => track.id === action.payload
        );

        if (trackIndex !== -1) {
          state.albumDisc[discIndex][trackIndex].is_saved = false;
        }
      });
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
