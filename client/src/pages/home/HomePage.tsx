import { useEffect } from "react";
import styled from "styled-components";
import Card from "@/components/Card";
import * as S from "@/styles/components/section";
import { Link, useLocation } from "react-router-dom";
import { random } from "../../utils";
import { CollectionOverflow } from "@/components/Collection";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectCurrentUser } from "@/slices/currentUserSlice";
import { selectUserPlaylists } from "@/slices/userSavedPlaylistsSlice";
import { getRecentTracks, selectRecentTracks } from "@/slices/recentTrackSlice";
import * as topItems from "@/slices/topItemsSlice";
import * as recommend from "@/slices/recommendationSlice";
import * as savedArtists from "@/slices/userSavedArtistsSlice";
import { MEDIA } from "@/styles/media";
import { logout } from "../../spotify/auth";
import { ArtistPlaceholder } from "@/assets/placeholders";

const HomePage = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const user = useAppSelector(selectCurrentUser);
  const likedArtists = useAppSelector(savedArtists.selectSavedArtists);
  const userPlaylists = useAppSelector(selectUserPlaylists);
  const recentTracks = useAppSelector(selectRecentTracks);
  const topArtists = useAppSelector(topItems.selectTopArtists);
  const topTracks = useAppSelector(topItems.selectTopTracks);
  const recommendArtists = useAppSelector(
    recommend.selectRecommendedArtistTracks
  );
  const seedArtist = useAppSelector(recommend.selectHomeSeedArtist);
  const userSavedArtistsStatus = useSelector(
    (state: RootState) => state.userSavedArtists.status
  );

  useEffect(() => {
    // Remove the access token in url after signing in
    window.history.replaceState(null, "", "/");

    if (location) {
      dispatch(getRecentTracks({ limit: 20 }));
    }

    if (userSavedArtistsStatus === "idle") {
      dispatch(savedArtists.getUserSavedArtists({ type: "artist" }));
    }
  }, [dispatch, location, userSavedArtistsStatus]);

  useEffect(() => {
    if (topArtists.short_term?.items === undefined) {
      dispatch(topItems.getTopArtists({ limit: 10, time_range: "short_term" }));
    }
    if (topTracks.short_term?.items === undefined) {
      dispatch(topItems.getTopTracks({ limit: 10, time_range: "short_term" }));
    }
  }, [dispatch, topArtists.short_term, topTracks.short_term]);

  useEffect(() => {
    if (topArtists.short_term?.items.length > 0) {
      const seed = topArtists.short_term?.items[random(0, 11)];

      dispatch(recommend.setHomeSeedArtist(seed));
      dispatch(
        recommend.recommendArtistTracks({ seed: [seed?.id], limit: 10 })
      );
    }
  }, [dispatch, topArtists.short_term?.items]);

  return (
    <div>
      <Header>
        <User>
          <ArtistPlaceholder />
          {user.images ? (
            <UserImage
              src={user.images[0].url}
              height={80}
              width={80}
              alt=""
              loading="lazy"
            />
          ) : (
            <ArtistPlaceholder />
          )}
          <UserInfo>
            <h1>{user.display_name ?? "Unknown"}</h1>
            <UserStats>
              <StatItem>
                <StatValue>{user.followers?.total ?? 0}</StatValue> followers
              </StatItem>
              <StatItem>
                <StatValue>{likedArtists.artists?.total ?? 0}</StatValue>{" "}
                following
              </StatItem>
              <StatItem>
                <StatValue>{userPlaylists?.total ?? 0}</StatValue> playlists
              </StatItem>
            </UserStats>
          </UserInfo>
        </User>
        <LogoutButton onClick={logout}>Logout</LogoutButton>
      </Header>

      <S.Section>
        <S.SectionLink to="/genre/recently-played">
          Recently played
        </S.SectionLink>
        <CollectionOverflow>
          {recentTracks.items?.slice(0, 10).map((item, index) => (
            <Card key={index} variant="recent-tracks" item={item} overflow />
          ))}
        </CollectionOverflow>
      </S.Section>

      <S.Section>
        <S.SectionLink to="/top-artists">Your top artists</S.SectionLink>
        <CollectionOverflow>
          {topArtists.short_term?.items.slice(0, 10).map((artist) => (
            <Card key={artist.id} variant="artist" item={artist} overflow />
          ))}
        </CollectionOverflow>
      </S.Section>

      <S.Section>
        <S.SectionLink to="/top-tracks">Your top tracks</S.SectionLink>
        <CollectionOverflow>
          {topTracks.short_term?.items.slice(0, 10).map((track) => (
            <Card key={track.id} variant="track" item={track} overflow />
          ))}
        </CollectionOverflow>
      </S.Section>

      {userPlaylists.items?.length > 0 && (
        <S.Section>
          <S.SectionLink to="/library">Your playlists</S.SectionLink>
          <CollectionOverflow>
            {userPlaylists.items?.slice(0, 10).map((playlist) => (
              <Card
                key={playlist.id}
                variant="playlist"
                item={playlist}
                overflow
              />
            ))}
          </CollectionOverflow>
        </S.Section>
      )}

      {seedArtist && recommendArtists && recommendArtists.tracks?.length && (
        <S.Section>
          <SeedArtist>
            <Link to={`/artist/${seedArtist?.id}`}>
              {seedArtist.images?.length > 0 ? (
                <SeedArtistCover
                  src={seedArtist.images[0].url}
                  height={54}
                  width={54}
                  alt=""
                  loading="lazy"
                />
              ) : (
                <ArtistPlaceholder />
              )}
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

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 16px;
  margin-bottom: 64px;

  @media (min-width: ${MEDIA.tablet}) {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }

  @media (min-width: ${MEDIA.laptop}) {
    margin-top: 0;
  }
`;

const User = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: ${MEDIA.tablet}) {
    flex-direction: row;
  }
`;

const UserImage = styled.img`
  border-radius: 50%;
  margin-bottom: 16px;

  @media (min-width: ${MEDIA.tablet}) {
    margin-bottom: 0px;
    margin-right: 16px;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: ${MEDIA.tablet}) {
    align-items: flex-start;
  }
`;

const UserStats = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StatItem = styled.small`
  text-transform: uppercase;

  &:nth-child(even) {
    margin-left: 8px;
    margin-right: 8px;
  }
`;

const StatValue = styled.span`
  color: ${({ theme }) => theme.colors.white};
  font-weight: 700;
`;

const LogoutButton = styled.button`
  background-color: transparent;
  border: 1px solid currentColor;
  border-radius: 20px;
  font-weight: 600;
  margin-top: 16px;
  padding: 2px 12px;
  color: ${({ theme }) => theme.font.text};
  transition: color 0.2s ease;

  :hover {
    color: ${({ theme }) => theme.colors.white};
  }
`;

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
