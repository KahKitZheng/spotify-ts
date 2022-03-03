import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Track from "../../components/track";
import { useParams } from "react-router-dom";
import { TrackList } from "../../styles/components/track";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUserCountry } from "../../slices/currentUserSlice";
import {
  recommendGenreTracks,
  selectGenreTracks,
} from "../../slices/genreSlice";
import { stringToHSL } from "../../utils";

const GenrePage = () => {
  const [color, setColor] = useState("");
  const { category, artist } = useParams();

  const dispatch = useDispatch();
  const genre = useSelector(selectGenreTracks);
  const market = useSelector(selectCurrentUserCountry);

  useEffect(() => {
    if (category && artist && market) {
      dispatch(recommendGenreTracks({ category, artist, limit: 30, market }));
      setColor(stringToHSL(category));
    }
  }, [dispatch, category, market, artist]);

  return genre.tracks?.length === 0 ? (
    <PageTitle $highlight={color}>
      No recommended songs for <span>{category}</span> was found
    </PageTitle>
  ) : (
    <div>
      <PageTitle $highlight={color}>
        Recommended <span>{category}</span> songs
      </PageTitle>
      <TrackList>
        {genre.tracks?.map((track) => (
          <Track key={track.id} variant="genre" item={track} />
        ))}
      </TrackList>
    </div>
  );
};

const PageTitle = styled.h1<{ $highlight: string }>`
  line-height: 1.2;
  font-size: 28px;

  span {
    color: ${({ $highlight }) => $highlight};
  }
`;

export default GenrePage;
