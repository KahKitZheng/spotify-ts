import React, { useEffect } from "react";
import InfiniteLoader from "../../components/InfiniteLoader";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchOffsetSavedTrack,
  fetchSavedTracks,
  selectSavedTracks,
  selectSavedTracksStatus,
} from "../../slices/savedTracksSlice";
import styled from "styled-components";

const LikedSongs = () => {
  const dispatch = useAppDispatch();
  const savedTracks = useAppSelector(selectSavedTracks);
  const savedTracksStatus = useAppSelector(selectSavedTracksStatus);

  const hasNextPage = savedTracks.next !== null;
  const items = savedTracks.items;

  useEffect(() => {
    if (savedTracks.items?.length > 0) return;

    dispatch(fetchSavedTracks());
  }, [dispatch, savedTracks.items?.length]);

  const loadNextPage = () => {
    if (savedTracks.next !== null && savedTracksStatus === "idle") {
      dispatch(fetchOffsetSavedTrack(savedTracks.next));
    }
  };

  return (
    <LikedSongsWrapper>
      <h1>Liked Songs</h1>
      {savedTracks.items?.length > 0 && (
        <InfiniteLoader
          hasNextPage={hasNextPage}
          isNextPageLoading={savedTracksStatus === "loading"}
          items={items}
          loadNextPage={loadNextPage}
          trackVariant="liked-songs"
        />
      )}
    </LikedSongsWrapper>
  );
};

const LikedSongsWrapper = styled.div`
  margin-bottom: -16px;
`;

export default LikedSongs;
