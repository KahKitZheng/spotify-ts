import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Track from "../../components/track";
import * as H from "../../styles/components/headers";
import * as T from "../../styles/components/track";
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { RootState } from "../../app/store";
import { useSelector } from "react-redux";
import { formatDuration, stringToHSL } from "../../utils";
import {
  countPlaylistDuration,
  getPlaylistWithOffset,
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
  const playlist = useAppSelector(selectPlaylist);
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

  // Fetch again if the tracklist is incomplete
  useEffect(() => {
    // Check if the tracklist is not empty before fetching next batch of tracks and
    // has items to count the playlist duration
    if (playlist.tracks?.items.length > 0) {
      dispatch(countPlaylistDuration());
      setGradient(stringToHSL(playlist.name));

      // Make sure that only one request is dispatched to the API at a time
      if (offsetStatus === "idle" && playlist.tracks?.next !== null) {
        dispatch(getPlaylistWithOffset({ url: playlist.tracks?.next }));
      }
    }
  }, [
    dispatch,
    offsetStatus,
    playlist.name,
    playlist.tracks?.items.length,
    playlist.tracks?.next,
  ]);

  return id === playlist.id ? (
    <div>
      <H.HeaderWrapper $bgGradient={gradient}>
        <H.Thumbnail src={playlist.images && playlist.images[0].url} alt="" />
        <PlaylistOwner>
          By <span>{playlist.owner?.display_name}</span>
        </PlaylistOwner>
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
          {formatDuration(playlistDuration, "long")}
        </H.HeaderStats>
      </H.HeaderWrapper>

      <T.TracklistWrapper>
        {playlist.tracks?.items.map((item) => {
          return "track" in item.track ? (
            <Track key={item.track.id} variant="playlist" item={item.track} />
          ) : null;
        })}
      </T.TracklistWrapper>
    </div>
  ) : null;
};

export const PlaylistOwner = styled.p`
  font-size: 14px;

  span {
    font-weight: 600;
  }
`;

export const PlaylistDescription = styled.p`
  font-size: 14px;
  margin-top: 8px;
  opacity: 0.8;
`;

export default PlaylistPage;
