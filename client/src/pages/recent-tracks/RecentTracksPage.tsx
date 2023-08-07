import { useEffect } from "react";
import styled from "styled-components";
import Card from "@/components/Card";
import { useDispatch, useSelector } from "react-redux";
import { CollectionGrid } from "@/components/Collection";
import { getRecentTracks, selectRecentTracks } from "@/slices/recentTrackSlice";
import { AppDispatch } from "@/app/store";

const RecentTracksPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const recentlyPlayed = useSelector(selectRecentTracks);

  useEffect(() => {
    dispatch(getRecentTracks({ limit: 50 }));
  }, [dispatch]);

  return (
    <div>
      <PageTitle>Recently played</PageTitle>
      <CollectionGrid>
        {recentlyPlayed.items?.map((track, index) => (
          <Card key={index} variant="recent-tracks" item={track} />
        ))}
      </CollectionGrid>
    </div>
  );
};

const PageTitle = styled.h1`
  margin-bottom: 16px;
`;

export default RecentTracksPage;
