import React, { Fragment } from "react";
import LikeButton from "../../components/button";
import * as T from "../../styles/components/track";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { formatDuration } from "../../utils";
import { removeAlbumTrack, saveAlbumTrack } from "../../slices/albumSlice";
import {
  removePopularArtistTrack,
  savePopularArtistTrack,
} from "../../slices/artistSlice";
import {
  SimplifiedArtist,
  SimplifiedTrack,
  Track,
} from "../../types/SpotifyObjects";

interface Props {
  variant: "album" | "popular-tracks" | "playlist" | "user-top" | "genre";
  item: Track | SimplifiedTrack;
  index?: number;
  addedAt?: string;
}

const TrackComponent = (props: Props) => {
  const { variant, item, addedAt, index } = props;

  switch (variant) {
    case "album":
      return <AlbumTrack item={item as SimplifiedTrack} />;
    case "popular-tracks":
      return <PopularArtistTrack item={item as Track} index={index} />;
    case "playlist":
      return (
        <PlaylistTrack item={item as Track} addedAt={addedAt} index={index} />
      );
    case "user-top":
      return <UserTopTrack item={item as Track} index={index} />;
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
    isSaved
      ? dispatch(removeAlbumTrack(item.id))
      : dispatch(saveAlbumTrack(item.id));
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
      <T.TrackDuration>
        <LikeButton
          isSaved={item.is_saved}
          handleClick={() => handleOnclick(item.is_saved)}
        />
        <span>{formatDuration(item.duration_ms, "track")}</span>
      </T.TrackDuration>
    </T.OrderedTrack>
  );
};

// Album Cover + Track Name
const PopularArtistTrack = (props: { item: Track; index?: number }) => {
  const { index = 1, item } = props;
  const dispatch = useDispatch();

  function handleOnclick(isSaved?: boolean) {
    isSaved
      ? dispatch(removePopularArtistTrack(item.id))
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
      <T.TrackDuration>
        <LikeButton
          isSaved={item.is_saved}
          handleClick={() => handleOnclick(item.is_saved)}
        />
        <span>{formatDuration(item.duration_ms, "track")}</span>
      </T.TrackDuration>
    </T.OrderedTrack>
  );
};

// Album Cover + Track Name + Track Artists
const PlaylistTrack = (props: {
  item: Track;
  index?: number;
  addedAt?: string;
}) => {
  const { index, item, addedAt } = props;

  return (
    <T.PlaylistTrack>
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
      {addedAt !== null && <T.TrackDateAdded>{addedAt}</T.TrackDateAdded>}
      <T.TrackDuration>
        <span>{formatDuration(item.duration_ms, "track")}</span>
      </T.TrackDuration>
    </T.PlaylistTrack>
  );
};

// Album Cover + Track Name + Track Artists
const UserTopTrack = (props: { item: Track; index?: number }) => {
  const { index, item } = props;

  return (
    <T.OrderedTrack>
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
    </T.OrderedTrack>
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
      <T.TrackDuration>
        <span>{formatDuration(item.duration_ms, "track")}</span>
      </T.TrackDuration>
    </T.Track>
  );
};

export default TrackComponent;
