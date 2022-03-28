import React, { Fragment } from "react";
import LikeButton from "../../components/button";
import * as T from "./track.style";
import { Link, useParams } from "react-router-dom";
import { BiPlus } from "react-icons/bi";
import { MEDIA } from "../../styles/media";
import { useDispatch } from "react-redux";
import { formatDuration } from "../../utils";
import { useViewportWidth } from "../../hooks/useViewportWidth";
import { removeSavedAlbumTrack, saveAlbumTrack } from "../../slices/albumSlice";
import { removeSavedTopTrack, saveTopTrack, TimeRange } from "../../slices/topItemsSlice";
import { removeSavedPopularArtistTrack, savePopularArtistTrack } from "../../slices/artistSlice";
import * as playlistSlice from "../../slices/playlistSlice";
import { Episode, SimplifiedArtist, SimplifiedTrack, Track } from "../../types/SpotifyObjects";
import { replaceRecommendationTrack } from "../../slices/recommendationSlice";

interface Props {
  variant: "album" | "popular-tracks" | "playlist" | "playlist-add" | "user-top" | "genre";
  item: Track | SimplifiedTrack | Episode;
  index?: number;
  addedAt?: string;
  timeRange?: TimeRange;
}

const TrackComponent = (props: Props) => {
  const { variant, item, addedAt, index, timeRange } = props;

  switch (variant) {
    case "album":
      return <AlbumTrack item={item as SimplifiedTrack} />;
    case "popular-tracks":
      return <PopularArtistTrack item={item as Track} index={index} />;
    case "playlist":
      return <PlaylistTrack item={item as Track} addedAt={addedAt} index={index} />;
    case "playlist-add":
      return <PlaylistAddTrack item={item as Track} />;
    case "user-top":
      return <UserTopTrack item={item as Track} index={index} timeRange={timeRange} />;
    case "genre":
      return <GenreTrack item={item as Track} />;
  }
};

// Return comma separated artist links
const renderArtists = (list: SimplifiedArtist[]) => {
  return list.map((artist, index, arr) => (
    <Fragment key={artist.id}>
      <Link to={`/artist/${artist.id}`}>{artist.name}</Link>
      {index !== arr.length - 1 && <span>, </span>}
    </Fragment>
  ));
};

// Track Name + Artists
const AlbumTrack = (props: { item: SimplifiedTrack }) => {
  const { item } = props;
  const dispatch = useDispatch();

  function handleOnclick(isSaved?: boolean) {
    isSaved ? dispatch(removeSavedAlbumTrack(item.id)) : dispatch(saveAlbumTrack(item.id));
  }

  return (
    <T.OrderedTrack>
      <T.TrackIndex>{item.track_number}</T.TrackIndex>
      <T.TrackInfo>
        <T.TrackDetails>
          <T.TrackName>{item.name}</T.TrackName>
          <T.TrackArtists>
            {item.explicit && <T.ExplicitTrack>E</T.ExplicitTrack>}
            {renderArtists(item?.artists)}
          </T.TrackArtists>
        </T.TrackDetails>
      </T.TrackInfo>
      <T.TrackOptions>
        <LikeButton isSaved={item.is_saved} handleClick={() => handleOnclick(item.is_saved)} />
        <T.TrackDuration>{formatDuration(item.duration_ms, "track")}</T.TrackDuration>
      </T.TrackOptions>
    </T.OrderedTrack>
  );
};

// Album Cover + Track Name
const PopularArtistTrack = (props: { item: Track; index?: number }) => {
  const { index = 1, item } = props;
  const dispatch = useDispatch();

  function handleOnclick(isSaved?: boolean) {
    isSaved
      ? dispatch(removeSavedPopularArtistTrack(item.id))
      : dispatch(savePopularArtistTrack(item.id));
  }

  return (
    <T.OrderedTrack>
      {index !== undefined && <T.TrackIndex>{index + 1}</T.TrackIndex>}
      <T.TrackInfo>
        <T.TrackAlbumCover src={item.album?.images[0].url} alt="" $small />
        <T.TrackDetails>
          <T.TrackName>{item.name}</T.TrackName>
          {item.explicit && <T.ExplicitTrack>E</T.ExplicitTrack>}
        </T.TrackDetails>
      </T.TrackInfo>
      <T.TrackOptions>
        <LikeButton isSaved={item.is_saved} handleClick={() => handleOnclick(item.is_saved)} />
        <T.TrackDuration>{formatDuration(item.duration_ms, "track")}</T.TrackDuration>
      </T.TrackOptions>
    </T.OrderedTrack>
  );
};

// Album Cover + Track Name + Track Artists
const PlaylistTrack = (props: { item: Track; index?: number; addedAt?: string }) => {
  const { index, item, addedAt } = props;
  const dispatch = useDispatch();

  function handleOnclick(isSaved?: boolean) {
    isSaved
      ? dispatch(playlistSlice.removeSavedPlaylistTrack(item.id))
      : dispatch(playlistSlice.savePlaylistTrack(item.id));
  }

  return (
    <T.PlaylistTrack>
      {index !== undefined && <T.TrackIndex>{index + 1}</T.TrackIndex>}
      <T.TrackInfo>
        <T.TrackAlbumCover src={item.album?.images[0] && item.album?.images[0].url} alt="" />
        <T.TrackDetails>
          <T.TrackName>{item.name}</T.TrackName>
          <T.TrackArtists>
            {item.explicit && <T.ExplicitTrack>E</T.ExplicitTrack>}
            {renderArtists(item.artists)}
          </T.TrackArtists>
        </T.TrackDetails>
      </T.TrackInfo>
      <T.TrackAlbum>
        <Link to={`/album/${item.album?.id}`}>{item.album?.name}</Link>
      </T.TrackAlbum>
      {addedAt !== null && <T.TrackDateAdded>{addedAt}</T.TrackDateAdded>}
      <T.TrackOptions>
        <LikeButton isSaved={item.is_saved} handleClick={() => handleOnclick(item.is_saved)} />
        <T.TrackDuration>{formatDuration(item.duration_ms, "track")}</T.TrackDuration>
      </T.TrackOptions>
    </T.PlaylistTrack>
  );
};

const PlaylistAddTrack = (props: { item: Track }) => {
  const { item } = props;
  const { id } = useParams();
  const dispatch = useDispatch();
  const isDesktop = useViewportWidth(+MEDIA.tablet.slice(0, -2));

  function addTrack() {
    if (id !== undefined) {
      dispatch(playlistSlice.addTrackToPlaylist({ playlist_id: id, uris: [item.uri] }));
      dispatch(playlistSlice.addTrackToPlaylistData(item.id));
      dispatch(replaceRecommendationTrack({ id: item.id }));
    }
  }

  return (
    <T.PlaylistAddTrack>
      <T.TrackInfo>
        <T.TrackAlbumCover src={item.album?.images[0].url} alt="" />
        <T.TrackDetails>
          <T.TrackName>{item.name}</T.TrackName>
          <T.TrackArtists>
            {item.explicit && <T.ExplicitTrack>E</T.ExplicitTrack>}
            {renderArtists(item.artists)}
            <T.AddPlaylistTrackAlbum>
              <span className="bull">&bull;</span>
              <Link to={`/album/${item.album?.id}`}>{item.album?.name}</Link>
            </T.AddPlaylistTrackAlbum>
          </T.TrackArtists>
        </T.TrackDetails>
      </T.TrackInfo>
      <T.AddPlaylistTrackAlbumSection>
        <Link to={`/album/${item.album?.id}`}>{item.album?.name}</Link>
      </T.AddPlaylistTrackAlbumSection>
      <T.TrackOptions>
        <T.TrackDuration>{formatDuration(item.duration_ms, "track")}</T.TrackDuration>
        <T.AddTrackToPlaylist onClick={() => addTrack()}>
          {isDesktop ? "Add" : <BiPlus />}
        </T.AddTrackToPlaylist>
      </T.TrackOptions>
    </T.PlaylistAddTrack>
  );
};

// Album Cover + Track Name + Track Artists
const UserTopTrack = (props: { item: Track; index?: number; timeRange?: TimeRange }) => {
  const { index, item, timeRange } = props;
  const dispatch = useDispatch();

  function handleOnclick(isSaved?: boolean) {
    if (timeRange !== undefined) {
      isSaved
        ? dispatch(removeSavedTopTrack({ id: item.id, time_range: timeRange }))
        : dispatch(saveTopTrack({ id: item.id, time_range: timeRange }));
    }
  }
  return (
    <T.TopTrack>
      {index !== undefined && <T.TrackIndex>{index + 1}</T.TrackIndex>}
      <T.TrackInfo>
        <T.TrackAlbumCover src={item.album?.images[0].url} alt="" />
        <T.TrackDetails>
          <T.TrackName>{item.name}</T.TrackName>
          <T.TrackArtists>
            {item.explicit && <T.ExplicitTrack>E</T.ExplicitTrack>}
            {renderArtists(item.artists)}
          </T.TrackArtists>
        </T.TrackDetails>
      </T.TrackInfo>
      <T.TrackAlbum>
        <Link to={`/album/${item.album?.id}`}>{item.album?.name}</Link>
      </T.TrackAlbum>
      <T.TrackOptions>
        {timeRange !== undefined && (
          <LikeButton isSaved={item.is_saved} handleClick={() => handleOnclick(item.is_saved)} />
        )}
        <T.TrackDuration>{formatDuration(item.duration_ms, "track")}</T.TrackDuration>
      </T.TrackOptions>
    </T.TopTrack>
  );
};

// Album Cover + Track Name + Track Artists
const GenreTrack = (props: { item: Track }) => {
  const { item } = props;

  return (
    <T.Track>
      <T.TrackInfo>
        <T.TrackAlbumCover src={item.album?.images[0].url} alt="" />
        <T.TrackDetails>
          <T.TrackName>{item.name}</T.TrackName>
          <T.TrackArtists>
            {item.explicit && <T.ExplicitTrack>E</T.ExplicitTrack>}
            {renderArtists(item.artists)}
          </T.TrackArtists>
        </T.TrackDetails>
      </T.TrackInfo>
      <T.TrackOptions>
        <T.TrackDuration>{formatDuration(item.duration_ms, "track")}</T.TrackDuration>
      </T.TrackOptions>
    </T.Track>
  );
};

export default TrackComponent;
