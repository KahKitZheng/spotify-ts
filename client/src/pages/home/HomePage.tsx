import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "../../components/card";
import UserSummary from "./UserSummary";
import * as S from "../../styles/components/section";
import { Link } from "react-router-dom";
import { random } from "../../utils";
import { CollectionOverflow } from "../../components/collection";
import { Artist } from "../../types/SpotifyObjects";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectCurrentUser } from "../../slices/currentUserSlice";
import { selectUserPlaylists } from "../../slices/userSavedPlaylistsSlice";
import { getRecentTracks, selectRecentTracks } from "../../slices/recentTrackSlice";
import * as topItems from "../../slices/topItemsSlice";
import * as recommend from "../../slices/recommendationSlice";
import * as savedArtists from "../../slices/userSavedArtistsSlice";

const HomePage = () => {
  const [seedArtist, setSeedArtist] = useState({} as Artist);

  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const likedArtists = useAppSelector(savedArtists.selectSavedArtists);
  const userPlaylists = useAppSelector(selectUserPlaylists);
  const recentTracks = useAppSelector(selectRecentTracks);
  const topArtists = useAppSelector(topItems.selectTopArtists);
  const topTracks = useAppSelector(topItems.selectTopTracks);
  const recommendArtists = useAppSelector(recommend.selectRecommendedArtistTracks);

  const userSavedArtistsStatus = useSelector(
    (state: RootState) => state.userSavedArtists.status
  );
  const recentTracksStatus = useSelector((state: RootState) => state.recentTracks.status);

  useEffect(() => {
    // Remove the access token in url after signing in
    window.history.replaceState(null, "", "/");

    if (recentTracksStatus === "idle") {
      dispatch(getRecentTracks({ limit: 10 }));
    }

    if (userSavedArtistsStatus === "idle") {
      dispatch(savedArtists.getUserSavedArtists({ type: "artist" }));
    }
  }, [dispatch, recentTracksStatus, seedArtist, userSavedArtistsStatus]);

  useEffect(() => {
    if (topArtists.short_term) {
      const seed = topArtists.short_term?.items[random(0, 11)];

      setSeedArtist(seed);
      dispatch(recommend.recommendArtistTracks({ seed: [seed.id], limit: 10 }));
    }
  }, [dispatch, topArtists.short_term]);

  useEffect(() => {
    if (topArtists.short_term === undefined) {
      dispatch(topItems.getTopArtists({ limit: 10, time_range: "short_term" }));
    }
    if (topTracks.short_term === undefined) {
      dispatch(topItems.getTopTracks({ limit: 10, time_range: "short_term" }));
    }
  }, [dispatch, topArtists.short_term, topTracks.short_term]);

  return (
    <div>
      <UserSummary
        image={user.images && user.images[0].url}
        name={user.display_name || "Not Available"}
        followerCount={user.followers?.total}
        followingCount={likedArtists.artists?.total}
        playlistCount={userPlaylists?.total}
      />

      <S.Section>
        <S.SectionLink to="/genre/recently-played">Recently played</S.SectionLink>
        <CollectionOverflow>
          {recentTracks.items?.slice(0, 10).map((item, index) => (
            <Card key={index} variant="recently-played" item={item} overflow />
          ))}
        </CollectionOverflow>
      </S.Section>

      <S.Section>
        <S.SectionLink to="/top-artists">Your top artists</S.SectionLink>
        <CollectionOverflow>
          {topArtists.short_term?.items?.slice(0, 10).map((artist) => (
            <Card key={artist.id} variant="artist" item={artist} overflow />
          ))}
        </CollectionOverflow>
      </S.Section>

      <S.Section>
        <S.SectionLink to="/top-tracks">Your top tracks</S.SectionLink>
        <CollectionOverflow>
          {topTracks.short_term?.items?.slice(0, 10).map((track) => (
            <Card key={track.id} variant="track" item={track} overflow />
          ))}
        </CollectionOverflow>
      </S.Section>

      <S.Section>
        <S.SectionLink to="/library">Your playlists</S.SectionLink>
        <CollectionOverflow>
          {userPlaylists.items?.slice(0, 10).map((playlist) => (
            <Card key={playlist.id} variant="playlist" item={playlist} overflow />
          ))}
        </CollectionOverflow>
      </S.Section>

      {recommendArtists.tracks?.length > 0 && seedArtist && (
        <S.Section>
          <SeedArtist>
            <Link to={`/artist/${seedArtist.id}`}>
              <SeedArtistCover
                src={seedArtist.images ? seedArtist.images[0].url : ""}
                alt=""
              />
            </Link>
            <SeedArtistInfo>
              <SeedArtistDescription>Based on</SeedArtistDescription>
              <SeedArtistName to={`/artist/${seedArtist.id}`}>
                {seedArtist.name}
              </SeedArtistName>
            </SeedArtistInfo>
          </SeedArtist>
          <CollectionOverflow>
            {recommendArtists.tracks?.slice(0, 10).map((track) => (
              <Card key={track.id} variant="track" item={track} overflow />
            ))}
          </CollectionOverflow>
        </S.Section>
      )}
    </div>
  );
};

const SeedArtist = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  width: fit-content;
`;

const SeedArtistCover = styled.img`
  aspect-ratio: 1;
  max-height: 54px;
  object-fit: cover;
  border-radius: 50%;
`;

const SeedArtistInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 8px;
`;

const SeedArtistDescription = styled.span`
  font-size: 0.75rem;
  text-transform: uppercase;
`;

const SeedArtistName = styled(Link)`
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.3;
  color: ${({ theme }) => theme.font.title};
`;

export default HomePage;
