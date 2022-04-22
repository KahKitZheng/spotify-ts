import { useParams } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { Track, SimplifiedTrack } from "../../types/SpotifyObjects";
import * as albumSlice from "../../slices/albumSlice";
import * as artistSlice from "../../slices/artistSlice";
import * as playlistSlice from "../../slices/playlistSlice";
import * as topItemsSlice from "../../slices/topItemsSlice";
import * as genreSlice from "../../slices/genreSlice";
import { replaceRecommendationTrack } from "../../slices/recommendationSlice";
import { useViewportWidth } from "../../hooks/useViewportWidth";
import { MEDIA } from "../../styles/media";
import { startPlayback } from "../../slices/playerSlice";
import { removeSavedTrack } from "../../slices/savedTracksSlice";

type SaveTrackProps = {
  track: Track;
  isSaved: boolean;
};

type SaveAlbumTrackProps = {
  track: SimplifiedTrack;
  isSaved: boolean;
};

type SaveUserTopTrack = {
  track: Track;
  isSaved: boolean;
  timeRange: topItemsSlice.TimeRange;
};

//////////////////////////////
// Add or remove liked song //
//////////////////////////////
export const useSaveAlbumTrack = (data: SaveAlbumTrackProps) => {
  const dispatch = useAppDispatch();
  const { track, isSaved } = data;

  const handleSaveAlbumTrack = () => {
    isSaved
      ? dispatch(albumSlice.removeSavedAlbumTrack(track.id))
      : dispatch(albumSlice.saveAlbumTrack(track.id));
  };

  return handleSaveAlbumTrack;
};

export const useSavePopularArtistTrack = (data: SaveTrackProps) => {
  const dispatch = useAppDispatch();
  const { track, isSaved } = data;

  const handleSavePopularArtistTrack = () => {
    isSaved
      ? dispatch(artistSlice.removeSavedPopularArtistTrack(track.id))
      : dispatch(artistSlice.savePopularArtistTrack(track.id));
  };

  return handleSavePopularArtistTrack;
};

export const useSavePlaylistTrack = (data: SaveTrackProps) => {
  const dispatch = useAppDispatch();
  const { track, isSaved } = data;

  const handleSavePlaylistTrack = () => {
    isSaved
      ? dispatch(playlistSlice.removeSavedPlaylistTrack(track.id))
      : dispatch(playlistSlice.savePlaylistTrack(track.id));
  };

  return handleSavePlaylistTrack;
};

export const useSaveUserTopTrack = (data: SaveUserTopTrack) => {
  const dispatch = useAppDispatch();
  const { track, timeRange, isSaved } = data;

  const handleSaveUserTopTrack = () => {
    if (timeRange !== undefined) {
      const payload = { id: track.id, time_range: timeRange };

      isSaved
        ? dispatch(topItemsSlice.removeSavedTopTrack(payload))
        : dispatch(topItemsSlice.saveTopTrack(payload));
    }
  };

  return handleSaveUserTopTrack;
};

export const useSaveGenreTrack = (data: SaveTrackProps) => {
  const dispatch = useAppDispatch();
  const { track, isSaved } = data;

  const handleSaveGenreTrack = () => {
    isSaved
      ? dispatch(genreSlice.removeGenreTrack(track.id))
      : dispatch(genreSlice.saveGenreTrack(track.id));
  };

  return handleSaveGenreTrack;
};

export const useRemoveSavedTrack = ({ track }: SaveTrackProps) => {
  const dispatch = useAppDispatch();

  const handleSaveGenreTrack = () => {
    dispatch(removeSavedTrack(track.id));
  };

  return handleSaveGenreTrack;
};

/////////////////////////////////////
// Add or remove song from playlist//
/////////////////////////////////////
export const useAddPlaylistTrack = (
  track: Track | SimplifiedTrack,
  playlistId: string
) => {
  const dispatch = useAppDispatch();

  const handleSaveAddPlaylistTrack = () => {
    const spotifyPayload = { playlist_id: playlistId, uris: [track.uri] };

    dispatch(playlistSlice.addTrackToPlaylist(spotifyPayload));
  };

  return handleSaveAddPlaylistTrack;
};

export const useAddRecommendationPlaylistTrack = (data: SaveTrackProps) => {
  const dispatch = useAppDispatch();
  const { id } = useParams();

  const handleSaveAddPlaylistTrack = () => {
    if (id !== undefined) {
      const spotifyPayload = { playlist_id: id, uris: [data.track.uri] };

      dispatch(playlistSlice.addTrackToPlaylist(spotifyPayload));
      dispatch(playlistSlice.addTrackToPlaylistData(data.track?.id));
      dispatch(replaceRecommendationTrack({ id: data.track?.id }));
    }
  };

  return handleSaveAddPlaylistTrack;
};

export const useRemovePlaylistTrack = (track: Track) => {
  const dispatch = useAppDispatch();
  const { id } = useParams();

  const handleRemovePlaylistTrack = () => {
    if (id !== undefined) {
      const payload = { playlist_id: id, uris: [track.uri] };
      dispatch(playlistSlice.removeTrackFromPlaylist(payload));
    }
  };

  return handleRemovePlaylistTrack;
};

////////////////
// Play track //
////////////////
export const usePlayTrack = (
  payload: { uris: string[] } | { context_uri: string }
) => {
  const dispatch = useAppDispatch();
  const isDesktop = useViewportWidth(+MEDIA.tablet.slice(0, -2));

  const handleMobile = () => {
    if (isDesktop) return;

    dispatch(startPlayback(payload));
  };

  const handleDesktop = () => {
    dispatch(startPlayback(payload));
  };

  return [handleMobile, handleDesktop];
};
