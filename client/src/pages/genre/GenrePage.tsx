import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Track from "@/components/Track";
import { useParams } from "react-router-dom";
import { TrackList } from "@/components/Track/Track.style";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUserCountry } from "../../slices/currentUserSlice";
import * as genreSlice from "../../slices/genreSlice";
import { getHeaderHue } from "../../utils";

const GenrePage = () => {
  const [color, setColor] = useState("");
  const { category, artist } = useParams();

  const dispatch = useDispatch();
  const genre = useSelector(genreSlice.selectGenreTracks);
  const market = useSelector(selectCurrentUserCountry);

  useEffect(() => {
    if (category && artist && market) {
      const payload = { category, artist, limit: 30, market };
      dispatch(genreSlice.recommendGenreTracks(payload));
      setColor(getHeaderHue(category));
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
