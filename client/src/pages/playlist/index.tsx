import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Track from "../../components/track";
import ActionBar from "../../components/actionbar";
import * as H from "../../styles/components/headers";
import * as T from "../../styles/components/track";
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { RootState } from "../../app/store";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../../slices/currentUserSlice";
import {
  extractTrackId,
  formatAddedAt,
  formatDuration,
  stringToHSL,
} from "../../utils";
import {
  checkSavedPlaylist,
  checkSavedPlaylistTracks,
  countPlaylistDuration,
  getPlaylistTracksWithOffset,
  removeSavedPlaylist,
  savePlaylist,
  selectPlaylistStatus,
} from "../../slices/playlistSlice";
import {
  getPlaylist,
  selectPlaylist,
  selectPlaylistDuration,
} from "../../slices/playlistSlice";

const PlaylistPage = () => {
  const { id } = useParams();
  const [gradient, setGradient] = useState("");

  const dispatch = useAppDispatch();
  const userId = useAppSelector(selectCurrentUserId);
  const playlist = useAppSelector(selectPlaylist);
  const playlistStatus = useAppSelector(selectPlaylistStatus);
  const playlistDuration = useAppSelector(selectPlaylistDuration);

  const offsetStatus = useSelector(
    (state: RootState) => state.playlist.offsetStatus
  );

  // Fetch playlist for initial render
  useEffect(() => {
    if (id) {
      dispatch(getPlaylist({ playlist_id: id }));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (playlistStatus === "succeeded") {
      dispatch(checkSavedPlaylist({ playlist_id: playlist.id, userId }));
    }
  }, [dispatch, playlist.id, playlistStatus, userId]);

  // useEffect(() => {
  //   if (offsetStatus === "succeeded") {
  //     dispatch(countPlaylistDuration());
  //   }
  // }, [dispatch, offsetStatus]);

  // Fetch again if the tracklist is incomplete
  useEffect(() => {
    // Check if the tracklist is not empty before fetching next batch of tracks and
    // has items to count the playlist duration
    if (playlist.tracks?.items.length > 0) {
      setGradient(stringToHSL(playlist.name));

      // // Make sure that only one request is dispatched to the API at a time
      // if (offsetStatus === "idle" && playlist.tracks?.next !== null) {
      //   dispatch(getPlaylistTracksWithOffset({ url: playlist.tracks?.next }));
      // }
    }
  }, [
    dispatch,
    offsetStatus,
    playlist.name,
    playlist.tracks?.items.length,
    playlist.tracks?.next,
  ]);

  useEffect(() => {
    if (playlist.tracks?.items.length > 0) {
      const list = playlist.tracks?.items;
      dispatch(checkSavedPlaylistTracks(extractTrackId(list?.slice(0, 50))));
    }
  }, [dispatch, playlist.tracks?.items]);

  function handleOnclick(isSaved?: boolean) {
    isSaved
      ? dispatch(removeSavedPlaylist(playlist.id))
      : dispatch(savePlaylist(playlist.id));
  }

  return id === playlist.id ? (
    <div>
      <H.HeaderWrapper $bgGradient={gradient}>
        {playlist.images[0] === undefined ? (
          <H.ThumbnailPlaceholder>
            {playlist.name.slice(0, 1)}
          </H.ThumbnailPlaceholder>
        ) : (
          <H.Thumbnail src={playlist.images && playlist.images[0].url} alt="" />
        )}
        <div>
          <H.HeaderExtraInfo>
            By <PlaylistOwner>{playlist.owner?.display_name}</PlaylistOwner>
          </H.HeaderExtraInfo>
          <H.HeaderName>{playlist.name?.split("/").join("/ ")}</H.HeaderName>
          {playlist.description && (
            <PlaylistDescription
              dangerouslySetInnerHTML={{ __html: playlist.description }}
            />
          )}
          <H.HeaderStats>
            {playlist.followers?.total.toLocaleString()} likes
            <span className="bull">&bull;</span>
            {playlist.tracks?.total} songs,{" "}
            {formatDuration(playlistDuration, "playlist")}
          </H.HeaderStats>
        </div>
      </H.HeaderWrapper>

      <ActionBar
        isSaved={playlist.is_saved}
        handleClick={() => handleOnclick(playlist.is_saved)}
      />

      {playlist.tracks?.items && (
        <T.TrackList>
          {playlist.tracks?.items.map((item, index) => {
            return "track" in item.track ? (
              <Track
                key={item.track.id}
                variant="playlist"
                index={index}
                item={item.track}
                addedAt={
                  item.added_at !== null ? formatAddedAt(item.added_at) : ""
                }
              />
            ) : null;
          })}
        </T.TrackList>
      )}
    </div>
  ) : null;
};

const PlaylistOwner = styled.span`
  color: ${({ theme }) => theme.font.title};
  font-weight: 600;
`;

const PlaylistDescription = styled.p`
  font-size: 14px;
  margin-top: 8px;
  opacity: 0.8;
  color: #cecece;
`;

export default PlaylistPage;
