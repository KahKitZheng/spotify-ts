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

const HomePage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
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
  }, [
    userStatus,
    userPlaylistsStatus,
    recentTracksStatus,
    topItemsStatus,
    dispatch,
  ]);

  return (
    <div>
      <UserSummary
        image={user.images && user.images[0].url}
        name={user.display_name || "Not Available"}
        followerCount={user.followers?.total}
        followingCount={0}
        playlistCount={0}
      />

      <Collection title="Your playlists">
        {userPlaylists.items?.map((playlist) => (
          <Card
            key={playlist.id}
            imgSource={playlist.images[0].url}
            title={playlist.name}
            undertitle={`By ${playlist.owner?.display_name}`}
          />
        ))}
      </Collection>

      <Collection title="Recently played">
        {recentTracks.items?.map((item) => (
          <Card
            key={item.track.id}
            imgSource={item.track?.album.images[0].url}
            title={item.track.name}
            undertitle={item.track.artists[0].name}
          />
        ))}
      </Collection>

      <Collection title="Top artists">
        {topArtists.items?.map((artist) => (
          <Card
            key={artist.id}
            imgSource={artist.images[0].url}
            title={artist.name}
            undertitle={artist.type}
          />
        ))}
      </Collection>

      <Collection title="Top tracks">
        {topTracks.items?.map((track) => (
          <Card
            key={track.id}
            imgSource={track.album.images[0].url}
            title={track.name}
            undertitle={track.artists[0].name}
          />
        ))}
      </Collection>

      {topArtists.items?.length > 0 && (
        <Collection title={`Similiar to ${topArtists?.items[0].name}`}>
          {recommendArtists.tracks?.map((track) => (
            <Card
              key={track.id}
              imgSource={track.album.images[0].url}
              title={track.name}
              undertitle={`By ${track.artists[0].name}`}
            />
          ))}
        </Collection>
      )}
    </div>
  );
};

export default HomePage;
