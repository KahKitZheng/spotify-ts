import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import currentUserReducer from "../slices/currentUserSlice";
import currentUserPlaylistsReducer from "../slices/userSavedPlaylistsSlice";
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
import playbackSlice from "../slices/playerSlice";
import savedTracksSlice from "../slices/savedTracksSlice";

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
    player: playbackSlice,
    savedTracks: savedTracksSlice,
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
