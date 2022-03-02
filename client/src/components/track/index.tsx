import React, { Fragment } from "react";
import * as T from "../../styles/components/track";
import { Link } from "react-router-dom";
import { formatDuration } from "../../utils";
import {
  SimplifiedArtist,
  SimplifiedTrack,
  Track,
} from "../../types/SpotifyObjects";

interface Props {
  variant: "album" | "popular-tracks" | "playlist" | "user-top";
  item: Track | SimplifiedTrack;
  index?: number;
}

const TrackComponent = (props: Props) => {
  const { variant, item, index } = props;

  switch (variant) {
    case "album":
      return <AlbumTrack item={item as SimplifiedTrack} index={index} />;
    case "popular-tracks":
      return <PopularArtistTrack item={item as Track} index={index} />;
    case "playlist":
      return <PlaylistTrack item={item as Track} index={index} />;
    case "user-top":
      return <UserTopTrack item={item as Track} index={index} />;
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
const AlbumTrack = (props: { item: SimplifiedTrack; index?: number }) => {
  const { index, item } = props;

  return (
    <T.Track>
      {index !== undefined && <T.TrackIndex>{index + 1}</T.TrackIndex>}
      <T.TrackInfo>
        <T.TrackDetails>
          <T.TrackName>{item.name}</T.TrackName>
          <T.TrackArtists>
            {item.explicit && <T.ExplicitTrack>E</T.ExplicitTrack>}
            {renderArtists(item?.artists)}
          </T.TrackArtists>
        </T.TrackDetails>
      </T.TrackInfo>
      <T.TrackDuration>
        <span>{formatDuration(item.duration_ms, "track")}</span>
      </T.TrackDuration>
    </T.Track>
  );
};

// Album Cover + Track Name
const PopularArtistTrack = (props: { item: Track; index?: number }) => {
  const { index = 1, item } = props;

  return (
    <T.Track>
      {index !== undefined && <T.TrackIndex>{index + 1}</T.TrackIndex>}
      <T.TrackInfo>
        <T.TrackAlbumCover src={item.album?.images[0].url} alt="" $small />
        <T.TrackDetails>
          <T.TrackName>{item.name}</T.TrackName>
          {item.explicit && <T.ExplicitTrack>E</T.ExplicitTrack>}
        </T.TrackDetails>
      </T.TrackInfo>
      <T.TrackDuration>
        <span>{formatDuration(item.duration_ms, "track")}</span>
      </T.TrackDuration>
    </T.Track>
  );
};

// Album Cover + Track Name + Track Artists
const PlaylistTrack = (props: { item: Track; index?: number }) => {
  const { index, item } = props;

  return (
    <T.Track>
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
      <T.TrackDuration>
        <span>{formatDuration(item.duration_ms, "track")}</span>
      </T.TrackDuration>
    </T.Track>
  );
};

// Album Cover + Track Name + Track Artists
const UserTopTrack = (props: { item: Track; index?: number }) => {
  const { index, item } = props;

  return (
    <T.Track>
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
      <T.TrackDuration>
        <span>{formatDuration(item.duration_ms, "track")}</span>
      </T.TrackDuration>
    </T.Track>
  );
};

export default TrackComponent;
