import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import currentUserReducer from "../slices/currentUserSlice";
import currentUserPlaylistsReducer from "../slices/currentUserPlaylistsSlice";
import recentTracksReducer from "../slices/recentTrackSlice";
import topItemsReducer from "../slices/topItemsSlice";
import recommendationSlice from "../slices/recommendationSlice";

export const store = configureStore({
  reducer: {
    currentUser: currentUserReducer,
    currentUserPlaylists: currentUserPlaylistsReducer,
    recentTracks: recentTracksReducer,
    topItems: topItemsReducer,
    recommendations: recommendationSlice,
    counter: counterReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
