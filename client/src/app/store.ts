import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import currentUserReducer from "../slices/currentUserSlice";
import currentUserPlaylistsReducer from "../slices/currentUserPlaylistsSlice";
import recentTracksReducer from "../slices/recentTrackSlice";
import topItemsReducer from "../slices/topItemsSlice";
import recommendationSlice from "../slices/recommendationSlice";
import categoriesSlice from "../slices/categoriesSlice";
import userSavedArtistsSlice from "../slices/userSavedArtistsSlice";
import userSavedAlbumsSlice from "../slices/userSavedAlbumsSlice";
import searchResultSlice from "../slices/searchResultSlice";
import playlistSlice from "../slices/playlistSlice";
import albumSlice from "../slices/albumSlice";
import artistSlice from "../slices/artistSlice";
import genreSlice from "../slices/genreSlice";

export const store = configureStore({
  reducer: {
    currentUser: currentUserReducer,
    currentUserPlaylists: currentUserPlaylistsReducer,
    recentTracks: recentTracksReducer,
    topItems: topItemsReducer,
    recommendations: recommendationSlice,
    categories: categoriesSlice,
    searchResults: searchResultSlice,
    userSavedArtists: userSavedArtistsSlice,
    userSavedAlbums: userSavedAlbumsSlice,
    playlist: playlistSlice,
    album: albumSlice,
    artist: artistSlice,
    genre: genreSlice,
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
