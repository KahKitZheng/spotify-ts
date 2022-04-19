import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchOffsetSavedTrack,
  fetchSavedTracks,
  selectSavedTracks,
  selectSavedTracksStatus,
} from "../../slices/savedTracksSlice";
import styled from "styled-components";
import Track from "../../components/Track";
import { TrackList } from "../../components/Track/Track.style";
import { formatAddedAt } from "../../utils";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";

const LikedSongs = () => {
  const dispatch = useAppDispatch();
  const savedTracks = useAppSelector(selectSavedTracks);
  const savedTracksStatus = useAppSelector(selectSavedTracksStatus);
  const hasNextPage = savedTracks.next;

  const lastTrackRef = useInfiniteScroll(
    savedTracksStatus,
    hasNextPage !== null,
    handleFetchOffset
  );

  function handleFetchOffset() {
    if (hasNextPage === null) return;
    dispatch(fetchOffsetSavedTrack(hasNextPage));
  }

  // Initial fetch
  useEffect(() => {
    if (savedTracks.items?.length > 0) return;

    dispatch(fetchSavedTracks());
  }, [dispatch, savedTracks.items?.length]);

  return (
    <LikedSongsWrapper>
      <h1>Liked Songs</h1>
      <TrackList>
        {savedTracks.items?.map((track, index) => (
          <div
            key={track.track.id}
            ref={savedTracks.items.length === index + 1 ? lastTrackRef : null}
          >
            <Track
              variant="liked-songs"
              index={index}
              item={track}
              addedAt={formatAddedAt(track.added_at)}
            />
          </div>
        ))}
        <div>{savedTracksStatus === "loading" && "Loading..."}</div>
      </TrackList>
    </LikedSongsWrapper>
  );
};

const LikedSongsWrapper = styled.div`
  margin-bottom: -16px;
`;

export default LikedSongs;
