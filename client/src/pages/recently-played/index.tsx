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
        {recentlyPlayed.items?.map((track, index) => (
          <Card key={index} variant="recently-played" item={track} />
        ))}
      </CollectionGrid>
    </div>
  );
};

const PageTitle = styled.h1`
  margin-bottom: 16px;
`;

export default RecentlyPlayedPage;
