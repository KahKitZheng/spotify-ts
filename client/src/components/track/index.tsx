import React, { Fragment } from "react";
import * as T from "../../styles/components/track";
import { Link } from "react-router-dom";
import {
  SimplifiedArtist,
  SimplifiedTrack,
  Track,
} from "../../types/SpotifyObjects";

interface Props {
  variant: "album" | "popular-artist" | "playlist";
  item: Track | SimplifiedTrack;
  index: number;
}

const TrackComponent = (props: Props) => {
  const { variant, item, index } = props;

  switch (variant) {
    case "album":
      return <AlbumTrack item={item as SimplifiedTrack} index={index} />;
    case "popular-artist":
      return <PopularArtistTrack item={item as Track} index={index} />;
    case "playlist":
      return <PlaylistTrack item={item as Track} index={index} />;
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
const AlbumTrack = (props: { item: SimplifiedTrack; index: number }) => {
  const { index, item } = props;

  return (
    <T.Track>
      <T.TrackIndex>{index + 1}</T.TrackIndex>
      <T.TrackInfo>
        <T.TrackName>{item.name}</T.TrackName>
        <T.TrackArtists>
          {item.explicit && <T.ExplicitTrack>E</T.ExplicitTrack>}
          {renderArtists(item?.artists)}
        </T.TrackArtists>
      </T.TrackInfo>
    </T.Track>
  );
};

// Album Cover + Track Name
const PopularArtistTrack = (props: { item: Track; index: number }) => {
  const { index = 1, item } = props;

  return (
    <T.Track>
      <T.TrackIndex>{index + 1}</T.TrackIndex>
      <T.TrackAlbumCover src={item.album?.images[0].url} alt="" $small />
      <T.TrackInfo>
        <T.TrackName>{item.name}</T.TrackName>
        {item.explicit && <T.ExplicitTrack>E</T.ExplicitTrack>}
      </T.TrackInfo>
    </T.Track>
  );
};

// Album Cover + Track Name + Track Artists
const PlaylistTrack = (props: { item: Track; index: number }) => {
  const { index, item } = props;

  return (
    <T.Track>
      <T.TrackIndex>{index + 1}</T.TrackIndex>
      <T.TrackAlbumCover src={item.album?.images[0].url} alt="" />
      <T.TrackInfo>
        <T.TrackName>{item.name}</T.TrackName>
        <T.TrackArtists>
          {item.explicit && <T.ExplicitTrack>E</T.ExplicitTrack>}
          {renderArtists(item.artists)}
        </T.TrackArtists>
      </T.TrackInfo>
    </T.Track>
  );
};

export default TrackComponent;