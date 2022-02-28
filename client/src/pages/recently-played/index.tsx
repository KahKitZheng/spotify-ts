import React, { useEffect } from "react";
import styled from "styled-components";
import Card from "../../components/card";
import { useDispatch, useSelector } from "react-redux";
import { CollectionGrid } from "../../components/collection";
import {
  getRecentTracks,
  selectRecentTracks,
} from "../../slices/recentTrackSlice";

const RecentlyPlayedPage = () => {
  const dispatch = useDispatch();
  const recentlyPlayed = useSelector(selectRecentTracks);

  useEffect(() => {
    dispatch(getRecentTracks({ limit: 50 }));
  }, [dispatch]);

  return (
    <div>
      <PageTitle>Recently played</PageTitle>
      <CollectionGrid>
        {recentlyPlayed.items?.map((track) => (
          <Card
            key={track.track.id}
            imgSource={track.track.album?.images[0].url}
            link={`/album/${track.track.album?.id}`}
            title={track.track.album?.name}
            undertitle={track.track.album?.artists[0].name}
          />
        ))}
      </CollectionGrid>
    </div>
  );
};

const PageTitle = styled.h1`
  margin-bottom: 16px;
`;

export default RecentlyPlayedPage;
