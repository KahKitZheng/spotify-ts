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
import ActionBar from "../../components/ActionBar";
import { selectPlayback } from "../../slices/playerSlice";
import {
  selectCurrentUser,
  selectCurrentUserId,
} from "../../slices/currentUserSlice";
import * as H from "../../styles/components/headers";

const LikedSongs = () => {
  const dispatch = useAppDispatch();
  const savedTracks = useAppSelector(selectSavedTracks);
  const savedTracksStatus = useAppSelector(selectSavedTracksStatus);
  const hasNextPage = savedTracks.next;
  const user = useAppSelector(selectCurrentUser);

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

    dispatch(fetchSavedTracks({ limit: 50 }));
  }, [dispatch, savedTracks.items?.length]);

  return (
    <LikedSongsWrapper>
      <H.HeaderWrapper $bgGradient={`hsl(254, 48%, 42%)`}>
        <H.Thumbnail src="https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png" />
        <div>
          <H.HeaderName>Liked Songs</H.HeaderName>
          <UserName>{user.display_name}</UserName>
          <span className="bull">&bull;</span>
          <small>{savedTracks.total} songs</small>
        </div>
      </H.HeaderWrapper>
      <ActionBar uri={`spotify:user:${user.id}:collection`} />
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

const UserName = styled.small`
  color: ${({ theme }) => theme.colors.white};
  font-weight: 700;
`;

export default LikedSongs;
