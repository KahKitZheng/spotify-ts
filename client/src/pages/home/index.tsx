import React, { useEffect } from "react";
import UserSummary from "./UserSummary";
import Collection from "../../components/collection";
import Card from "../../components/card";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  getCurrentUser,
  selectCurrentUser,
} from "../../slices/currentUserSlice";
import {
  getCurrentUserPlaylists,
  selectCurrentUserPlaylists,
} from "../../slices/currentUserPlaylistsSlice";
import {
  getRecentTracks,
  selectRecentTracks,
} from "../../slices/recentTrackSlice";
import {
  getTopArtists,
  getTopTracks,
  selectTopArtists,
  selectTopTracks,
} from "../../slices/topItemsSlice";
import {
  getArtistRecommendation,
  selectArtistRecommendation,
} from "../../slices/recommendationSlice";
import {
  getUserSavedArtists,
  selectUserSavedArtists,
} from "../../slices/userSavedArtistsSlice";

const HomePage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const savedArtists = useAppSelector(selectUserSavedArtists);
  const userPlaylists = useAppSelector(selectCurrentUserPlaylists);
  const recentTracks = useAppSelector(selectRecentTracks);
  const topArtists = useAppSelector(selectTopArtists);
  const topTracks = useAppSelector(selectTopTracks);
  const recommendArtists = useAppSelector(selectArtistRecommendation);

  const userStatus = useSelector(
    (state: RootState) => state.currentUser.status
  );
  const userPlaylistsStatus = useSelector(
    (state: RootState) => state.currentUserPlaylists.status
  );
  const userSavedArtistsStatus = useSelector(
    (state: RootState) => state.userSavedArtists.status
  );
  const recentTracksStatus = useSelector(
    (state: RootState) => state.recentTracks.status
  );
  const topItemsStatus = useSelector(
    (state: RootState) => state.topItems.status
  );
  const recommendArtistStatus = useSelector(
    (state: RootState) => state.recommendations.status
  );

  useEffect(() => {
    // Remove the access token in url after signing in
    window.history.replaceState(null, "", "/");

    if (userStatus === "idle") {
      dispatch(getCurrentUser());
    }
    if (userPlaylistsStatus === "idle") {
      dispatch(getCurrentUserPlaylists({ limit: 10 }));
    }
    if (recentTracksStatus === "idle") {
      dispatch(getRecentTracks({ limit: 10 }));
    }
    if (topItemsStatus === "idle") {
      dispatch(getTopArtists({ limit: 10 }));
      dispatch(getTopTracks({ limit: 10 }));
    }
    if (recommendArtistStatus === "idle" && topArtists.items?.length > 0) {
      const artistSeed = topArtists.items[0].id;
      dispatch(getArtistRecommendation({ seed: artistSeed, limit: 10 }));
    }
    if (userSavedArtistsStatus === "idle") {
      dispatch(getUserSavedArtists({ type: "artist" }));
    }
  }, [
    dispatch,
    recentTracksStatus,
    recommendArtistStatus,
    topArtists.items,
    topItemsStatus,
    userPlaylistsStatus,
    userSavedArtistsStatus,
    userStatus,
  ]);

  return (
    <div>
      <UserSummary
        image={user.images && user.images[0].url}
        name={user.display_name || "Not Available"}
        followerCount={user.followers?.total}
        followingCount={savedArtists.artists?.total}
        playlistCount={userPlaylists?.total}
      />

      <Collection title="Recently played">
        {recentTracks.items?.slice(0, 10).map((item, index) => (
          <Card
            key={item.track.id + "-" + index}
            imgSource={item.track?.album.images[0].url}
            title={item.track.name}
            undertitle={item.track.artists[0].name}
          />
        ))}
      </Collection>

      <Collection title="Top artists">
        {topArtists.items?.slice(0, 10).map((artist, index) => (
          <Card
            key={artist.id + "-" + index}
            imgSource={artist.images[0].url}
            title={artist.name}
            undertitle={artist.type}
            isArtist
          />
        ))}
      </Collection>

      <Collection title="Top tracks">
        {topTracks.items?.slice(0, 10).map((track, index) => (
          <Card
            key={track.id + "-" + index}
            imgSource={track.album.images[0].url}
            title={track.name}
            undertitle={track.artists[0].name}
          />
        ))}
      </Collection>

      <Collection title="Your playlists">
        {userPlaylists.items?.slice(0, 10).map((playlist, index) => (
          <Card
            key={playlist.id + "-" + index}
            imgSource={playlist.images[0].url}
            link={`/playlist/${playlist.id}`}
            title={playlist.name}
            undertitle={
              playlist.description
                ? playlist.description
                : `By ${playlist.owner?.display_name}`
            }
          />
        ))}
      </Collection>

      {recommendArtists.tracks?.length > 0 && (
        <Collection title={`Similiar to ${topArtists?.items[0].name}`}>
          {recommendArtists.tracks?.slice(0, 10).map((track, index) => (
            <Card
              key={track.id + "-" + index}
              imgSource={track.album.images[0].url}
              title={track.name}
              undertitle={track.artists[0].name}
            />
          ))}
        </Collection>
      )}
    </div>
  );
};

export default HomePage;
