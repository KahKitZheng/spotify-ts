import axios from "../app/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import {
  CurrentlyPlayingContext,
  Device,
  Track,
} from "../types/SpotifyObjects";

interface ArtistState {
  playback: CurrentlyPlayingContext;
  trackProgress: number;
  currentTrack: Track;
  deviceId: string;
  devices: Device[];
  currentVolume: number;
  shuffle: boolean;
  repeat_mode: number;
  saved: { isSaved: boolean; isChecked: boolean };
}

export const initialState: ArtistState = {
  playback: {} as CurrentlyPlayingContext,
  trackProgress: 0,
  currentTrack: {} as Track,
  deviceId: "",
  devices: [] as Device[],
  currentVolume: 10,
  shuffle: false,
  repeat_mode: 0,
  saved: { isSaved: false, isChecked: false },
};

export const getPlaybackState = createAsyncThunk(
  "playback/getPlaybackState",
  async () => {
    const response = await axios.get(`/me/player`);
    return response.data;
  }
);

export const getPlaybackDevices = createAsyncThunk(
  "playback/getPlaybackDevices",
  async () => {
    const response = await axios.get(`/me/player/devices`);
    return response.data;
  }
);

export const setPlaybackDevice = createAsyncThunk(
  "playback/setPlaybackDevice",
  async (data: { device_ids: string[]; play?: boolean }) => {
    await axios.put(`/me/player`, {
      device_ids: data.device_ids,
      play: data.play,
    });
  }
);

export const startPlayback = createAsyncThunk(
  "playback/startPlayback",
  async (data?: { uris?: string[]; context_uri?: string }) => {
    await axios.put(`/me/player/play`, {
      uris: data?.uris,
      context_uri: data?.context_uri,
    });
  }
);

export const pausePlayback = createAsyncThunk(
  "playback/pausePlayback",
  async () => {
    await axios.put(`/me/player/pause`);
  }
);

export const playNextTrack = createAsyncThunk(
  "playback/playNextTrack",
  async () => {
    await axios.post(`/me/player/next`);
  }
);

export const playPreviousTrack = createAsyncThunk(
  "playback/playPreviousTrack",
  async () => {
    await axios.post(`/me/player/previous`);
  }
);

export const setShuffle = createAsyncThunk(
  "playback/setShuffle",
  async (data: { shuffleState: boolean }) => {
    await axios.put(`/me/player/shuffle?state=${data.shuffleState}`);
  }
);

export const setRepeat = createAsyncThunk(
  "playback/setRepeat",
  async (data: { repeatState: "track" | "context" | "off" }) => {
    await axios.put(`/me/player/repeat?state=${data.repeatState}`);
  }
);

export const seekPosition = createAsyncThunk(
  "playback/seekPosition",
  async (data: { position_ms: number }) => {
    await axios.put(`/me/player/seek?position_ms=${data.position_ms}`);
  }
);

export const setPlaybackVolume = createAsyncThunk(
  "playback/setPlaybackVolume",
  async (data: { volume_percent: number }) => {
    await axios.put(`/me/player/volume?volume_percent=${data.volume_percent}`);
  }
);

export const checkCurrentSavedTrack = createAsyncThunk(
  "playback/checkCurrentSavedTrack",
  async (data: { ids: string }) => {
    const response = await axios.get(`me/tracks/contains?ids=${data.ids}`);
    return response.data;
  }
);

export const saveCurrentTrack = createAsyncThunk(
  "playback/saveCurrentTrack",
  async (id: string) => {
    await axios.put(`/me/tracks?ids=${id}`, {});
    return id;
  }
);

export const removeSavedCurrentTrack = createAsyncThunk(
  "playback/removeSavedCurrentTrack",
  async (id: string) => {
    await axios.delete(`me/tracks?ids=${id}`, {});
    return id;
  }
);

export const playbackSlice = createSlice({
  name: "playback",
  initialState: initialState,
  reducers: {
    updatePlayback: (state, action) => {
      state.playback.item = action.payload.track_window.current_track;
      state.playback.is_playing = !action.payload.paused;
      state.playback.progress_ms = +action.payload.position;
      state.playback.context = action.payload.context;
      state.shuffle = action.payload.shuffle;
      state.repeat_mode = action.payload.repeat_mode;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPlaybackState.fulfilled, (state, action) => {
      state.playback = action.payload;
    });

    builder.addCase(getPlaybackDevices.fulfilled, (state, action) => {
      state.devices = action.payload.devices;
    });

    builder.addCase(setPlaybackDevice.fulfilled, (state, action) => {
      state.deviceId = action.meta.arg.device_ids[0];
    });

    builder.addCase(startPlayback.fulfilled, (state) => {
      state.playback.is_playing = true;
    });

    builder.addCase(pausePlayback.fulfilled, (state) => {
      state.playback.is_playing = false;
    });

    builder.addCase(setShuffle.fulfilled, (state, action) => {
      state.playback.shuffle_state = action.meta.arg.shuffleState;
    });

    builder.addCase(setRepeat.fulfilled, (state, action) => {
      state.playback.repeat_state = action.meta.arg.repeatState;
    });

    builder.addCase(seekPosition.fulfilled, (state, action) => {
      state.playback.progress_ms = action.meta.arg.position_ms;
    });

    builder.addCase(setPlaybackVolume.fulfilled, (state, action) => {
      state.currentVolume = action.meta.arg.volume_percent;
    });

    builder.addCase(checkCurrentSavedTrack.fulfilled, (state, action) => {
      state.saved = { isSaved: action.payload[0], isChecked: true };
    });

    builder.addCase(saveCurrentTrack.fulfilled, (state) => {
      state.saved = { isSaved: true, isChecked: true };
    });

    builder.addCase(removeSavedCurrentTrack.fulfilled, (state) => {
      state.saved = { isSaved: false, isChecked: true };
    });
  },
});

export const selectPlayback = (state: RootState) => {
  return state.player.playback;
};

export const selectCheckCurrentTrack = (state: RootState) => {
  return state.player.currentTrack;
};

export const selectCheckCurrentSavedTrack = (state: RootState) => {
  return state.player.saved;
};

export const selectTrackProgress = (state: RootState) => {
  return state.player.trackProgress;
};

export const selectPlaybackShuffle = (state: RootState) => {
  return state.player.shuffle;
};

export const selectPlaybackRepeat = (state: RootState) => {
  return state.player.repeat_mode;
};

export const selectDeviceId = (state: RootState) => {
  return state.player.deviceId;
};

export const selectAvailableDevices = (state: RootState) => {
  return state.player.devices;
};

export const selectCurrentVolume = (state: RootState) => {
  return state.player.currentVolume;
};

export const { updatePlayback } = playbackSlice.actions;

export default playbackSlice.reducer;
