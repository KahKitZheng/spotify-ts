import React, { Fragment } from "react";
import * as T from "../../styles/components/track";
import { Link } from "react-router-dom";
import {
  SimplifiedArtist,
  SimplifiedTrack,
  Track,
} from "../../types/SpotifyObjects";

interface Props {
  variant: "basic" | "popular-artist" | "playlist";
  item: Track | SimplifiedTrack;
}

const TrackComponent = (props: Props) => {
  const { variant, item } = props;

  switch (variant) {
    case "basic":
      return <BasicTrack item={item as SimplifiedTrack} />;
    case "popular-artist":
      return <PopularArtistTrack item={item as Track} />;
    case "playlist":
      return <PlaylistTrack item={item as Track} />;
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
const BasicTrack = (props: { item: SimplifiedTrack }) => {
  const { item } = props;

  return (
    <T.Track>
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
const PopularArtistTrack = (props: { item: Track }) => {
  const { item } = props;

  return (
    <T.Track>
      <T.TrackAlbumCover src={item.album?.images[0].url} alt="" $small />
      <T.TrackInfo>
        <T.TrackName>{item.name}</T.TrackName>
        {item.explicit && <T.ExplicitTrack>E</T.ExplicitTrack>}
      </T.TrackInfo>
    </T.Track>
  );
};

// Album Cover + Track Name + Track Artists
const PlaylistTrack = (props: { item: Track }) => {
  const { item } = props;

  return (
    <T.Track>
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
