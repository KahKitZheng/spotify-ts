import React, { useState, useEffect, useCallback } from "react";
import Track from "../../components/track";
import ActionBar from "../../components/actionbar";
import PlaylistHeader from "./PlaylistHeader";
import PlaylistSearchTracks from "./PlaylistSearchTracks";
import PlaylistRecommendTracks from "./PlaylistRecommendTracks";
import EditPlaylistModal from "./EditPlaylistModal";
import * as T from "../../styles/components/track";
import * as utils from "../../utils";
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectCurrentUserId } from "../../slices/currentUserSlice";
import * as playlistSlice from "../../slices/playlistSlice";
import * as recommendationSlice from "../../slices/recommendationSlice";

const PlaylistPage = () => {
  const { id } = useParams();
  const [fetchOffset, setFetchOffset] = useState(0);
  const [bgGradient, setBgGradient] = useState(`hsl(0, 0%, 40%)`);
  const [isSearching, setIsSearching] = useState(false);
  const [modal, setModal] = useState(false);

  const dispatch = useAppDispatch();
  const userId = useAppSelector(selectCurrentUserId);
  const playlist = useAppSelector(playlistSlice.selectPlaylist);
  const playlistSize = playlist.tracks?.items.length;
  const playlistStatus = useAppSelector(playlistSlice.selectPlaylistStatus);
  const recommendStatus = useAppSelector(recommendationSlice.selectRecommendedPlaylistStatus);

  /** Fetch playlist info with up to 100 tracks */
  const fetchPlaylistInfo = useCallback(() => {
    if (playlist.id !== id && id !== undefined) {
      dispatch(playlistSlice.getPlaylistInfo({ playlist_id: id }));
    }
  }, [dispatch, id, playlist.id]);

  /** Check whether the current user has liked the playlist or not*/
  const fetchPlaylistIsSaved = useCallback(() => {
    if (playlistStatus === "succeeded") {
      dispatch(playlistSlice.checkSavedPlaylist({ playlist_id: playlist.id, userId }));
    }
  }, [dispatch, playlist.id, playlistStatus, userId]);

  /** Fetch the remaining playlist tracks if the initial fetch has not retrieved them all */
  const fetchOffsetPlaylistTracks = useCallback(() => {
    const url = playlist.tracks?.next;
    const startIndex = fetchOffset;

    if (startIndex >= playlistSize && url !== null) {
      dispatch(playlistSlice.getPlaylistTracksWithOffset({ startIndex, url }));
    }
  }, [dispatch, fetchOffset, playlist.tracks?.next, playlistSize]);

  /** Check which playlist tracks the current user has liked */
  const fetchSavedTracks = useCallback(() => {
    const playlistItems = playlist.tracks?.items;
    const incrementBy = 50;
    const startIndex = fetchOffset;
    const endIndex = fetchOffset + incrementBy;

    if (startIndex < playlistSize && startIndex < playlist.tracks?.total) {
      const ids = utils.extractTrackId(playlistItems?.slice(startIndex, endIndex));
      dispatch(playlistSlice.checkSavedPlaylistTracks({ startIndex, ids })).then(() => {
        setFetchOffset(endIndex);
      });
    }
  }, [dispatch, fetchOffset, playlist.tracks?.items, playlist.tracks?.total, playlistSize]);

  /** Create recommendation seeders based on the already added playlist tracks */
  const fetchRecommendations = useCallback(() => {
    const playlistItems = playlist.tracks?.items;
    const seed = [];

    if (0 < playlistSize && playlistSize <= 5) {
      playlistItems.forEach((item) => {
        seed.push(item.track.id);
      });
    }

    if (playlistSize > 5) {
      for (let index = 0; index < 5; index++) {
        const randomSeed = utils.random(1, playlistItems?.length);
        seed.push(playlistItems[randomSeed].track.id);
      }
    }

    if (seed.length > 0) {
      dispatch(recommendationSlice.recommendPlaylistTracks({ seed, limit: 10 }));
    }
  }, [dispatch, playlist.tracks?.items, playlistSize]);

  /** Fetch recommended tracks for your playlist based on a tracks seeder */
  const fetchInitialRecommendations = useCallback(() => {
    if (recommendStatus === "idle" && playlistSize > 0) {
      fetchRecommendations();
    }
  }, [recommendStatus, playlistSize, fetchRecommendations]);

  /** Calculate the playlist duration after all tracks has been fetched */
  const setPlaylistdDuration = useCallback(() => {
    if (playlist.tracks?.next === null) {
      dispatch(playlistSlice.countPlaylistDuration());
    }
  }, [dispatch, playlist.tracks?.next]);

  /** Set the background gradient */
  const setPlaylistBackground = useCallback(() => {
    playlistSize > 0
      ? setBgGradient(utils.stringToHSL(playlist.name))
      : setBgGradient(`hsl(0, 0%, 40%)`);
  }, [playlist.name, playlistSize]);

  useEffect(() => {
    if (id) setFetchOffset(0);
    if (playlistSize === 0) setIsSearching(true);
  }, [id, playlistSize]);

  useEffect(() => {
    fetchPlaylistInfo();
    fetchPlaylistIsSaved();
  }, [fetchPlaylistInfo, fetchPlaylistIsSaved]);

  useEffect(() => {
    fetchOffsetPlaylistTracks();
  }, [fetchOffsetPlaylistTracks]);

  useEffect(() => {
    fetchSavedTracks();
  }, [fetchSavedTracks]);

  useEffect(() => {
    setPlaylistBackground();
    setPlaylistdDuration();
  }, [setPlaylistBackground, setPlaylistdDuration]);

  useEffect(() => {
    fetchInitialRecommendations();
  }, [fetchInitialRecommendations]);

  function handleSavePlaylist(isSaved?: boolean) {
    isSaved
      ? dispatch(playlistSlice.removeSavedPlaylist(playlist.id))
      : dispatch(playlistSlice.savePlaylist(playlist.id));
  }

  return id === playlist.id ? (
    <div>
      <PlaylistHeader bgGradient={bgGradient} playlist={playlist} setModal={setModal} />
      <ActionBar
        isSaved={playlist.is_saved}
        handleClick={() => handleSavePlaylist(playlist.is_saved)}
      />

      {playlist.tracks.items?.length > 0 && (
        <T.TrackList>
          {playlist.tracks?.items.map((item, index) => (
            <Track
              key={item.track.id}
              variant="playlist"
              index={index}
              item={item.track}
              addedAt={item.added_at !== null ? utils.formatAddedAt(item.added_at) : ""}
            />
          ))}
        </T.TrackList>
      )}

      {playlist.owner.id === userId && isSearching ? (
        <PlaylistSearchTracks
          isSearching={isSearching}
          setIsSearching={setIsSearching}
          playlistSize={playlistSize}
        />
      ) : null}

      {playlist.owner.id === userId && !isSearching && playlistSize > 0 ? (
        <PlaylistRecommendTracks
          isSearching={isSearching}
          setIsSearching={setIsSearching}
          refreshRecommendations={fetchRecommendations}
        />
      ) : null}

      <EditPlaylistModal modal={modal} setModal={setModal} playlist={playlist} />
    </div>
  ) : null;
};

export default PlaylistPage;
