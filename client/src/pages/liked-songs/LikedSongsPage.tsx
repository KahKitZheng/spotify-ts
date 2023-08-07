import { useEffect } from "react";
import styled from "styled-components";
import Track from "@/components/Track";
import ActionBar from "@/components/ActionBar";
import RenderIfVisible from "react-render-if-visible";
import * as H from "@/styles/components/headers";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import * as savedTracksSlice from "@/slices/savedTracksSlice";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { selectCurrentUser } from "@/slices/currentUserSlice";
import { formatAddedAt } from "../../utils";

const LikedSongs = () => {
  const dispatch = useAppDispatch();
  const savedTracks = useAppSelector(savedTracksSlice.selectSavedTracks);
  const savedTracksStatus = useAppSelector(
    savedTracksSlice.selectSavedTracksStatus
  );
  const hasNextPage = savedTracks.next;
  const user = useAppSelector(selectCurrentUser);

  const lastTrackRef = useInfiniteScroll(
    savedTracksStatus,
    hasNextPage !== null,
    handleFetchOffset
  );

  function handleFetchOffset() {
    if (hasNextPage === null) return;
    dispatch(savedTracksSlice.fetchOffsetSavedTrack(hasNextPage));
  }

  // Initial fetch
  useEffect(() => {
    if (savedTracks.items?.length > 0) return;

    dispatch(savedTracksSlice.fetchSavedTracks({ limit: 50 }));
  }, [dispatch, savedTracks.items?.length]);

  return savedTracks.items?.length > 0 ? (
    <>
      <H.HeaderWrapper $bgGradient={`hsl(254, 48%, 42%)`}>
        <H.Thumbnail
          src="https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png"
          loading="lazy"
        />
        <div>
          <H.HeaderName>Liked Songs</H.HeaderName>
          <UserName>{user.display_name}</UserName>
          <span className="bull">&bull;</span>
          <small>{savedTracks.total} songs</small>
        </div>
      </H.HeaderWrapper>
      <ActionBar uri={`spotify:user:${user.id}:collection`} />

      {savedTracks.items.map((item, index) => (
        <RenderIfVisible defaultHeight={64} key={index}>
          <div
            ref={savedTracks.items?.length === index + 1 ? lastTrackRef : null}
          >
            <Track
              variant="liked-songs"
              index={index}
              item={item}
              addedAt={formatAddedAt(item.added_at)}
            />
          </div>
        </RenderIfVisible>
      ))}
    </>
  ) : null;
};

const UserName = styled.small`
  color: ${({ theme }) => theme.colors.white};
  font-weight: 700;
`;

export default LikedSongs;
