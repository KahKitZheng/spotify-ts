import React from "react";
import * as C from "../../styles/components/card";
import { NavigateFunction, useNavigate } from "react-router-dom";
import {
  Album,
  Artist,
  PlayHistory,
  SavedAlbum,
  SimplifiedAlbum,
  SimplifiedPlaylist,
  Track,
} from "../../types/SpotifyObjects";

interface Props {
  variant:
    | "recently-played"
    | "artist"
    | "track"
    | "playlist"
    | "album"
    | "album-saved"
    | "album-discography"
    | "category";
  item:
    | PlayHistory
    | Artist
    | Track
    | SimplifiedPlaylist
    | Album
    | SavedAlbum
    | SimplifiedAlbum;
}

const NewCard = (props: Props) => {
  const { variant, item } = props;
  const navigate = useNavigate();

  switch (variant) {
    case "recently-played":
      return <RecentTracksCard item={item as PlayHistory} to={navigate} />;
    case "artist":
      return <ArtistCard item={item as Artist} to={navigate} />;
    case "track":
      return <TrackCard item={item as Track} to={navigate} />;
    case "playlist":
      return <PlaylistCard item={item as SimplifiedPlaylist} to={navigate} />;
    case "album":
      return <AlbumCard item={item as Album} to={navigate} />;
    case "album-saved":
      return <AlbumSavedCard item={item as SavedAlbum} to={navigate} />;
    case "album-discography":
      return (
        <AlbumDiscographyCard item={item as SimplifiedAlbum} to={navigate} />
      );
    case "category":
      return <CategoryCard item={item as SimplifiedPlaylist} to={navigate} />;
    default:
      return null;
  }
};

const RecentTracksCard = (props: {
  item: PlayHistory;
  to: NavigateFunction;
}) => {
  const { to, item } = props;

  return (
    <C.CardWrapper onClick={() => to(`/album/${item.track.album?.id}`)}>
      <C.CardCover src={item.track.album?.images[0].url} alt="" />
      <C.CardTitle to={`/album/${item.track.album?.id}`}>
        {item.track.name}
      </C.CardTitle>
      <C.CardArtistLink
        onClick={(e) => e.stopPropagation()}
        to={`/artist/${item.track.album.artists[0].id}`}
      >
        {item.track.artists[0].name}
      </C.CardArtistLink>
    </C.CardWrapper>
  );
};

const ArtistCard = (props: { item: Artist; to: NavigateFunction }) => {
  const { to, item } = props;

  return (
    <C.CardWrapper onClick={() => to(`/artist/${item.id}`)}>
      <C.CardCover
        src={item.images.length > 0 ? item?.images[0].url : ""}
        alt=""
        $isArtist
      />
      <C.CardTitle to={`/artist/${item.id}`}>{item.name}</C.CardTitle>
      <C.CardDescription>Artist</C.CardDescription>
    </C.CardWrapper>
  );
};

const TrackCard = (props: { item: Track; to: NavigateFunction }) => {
  const { to, item } = props;

  return (
    <C.CardWrapper onClick={() => to(`/album/${item.album.id}`)}>
      <C.CardCover src={item.album?.images[0].url} alt="" />
      <C.CardTitle to={`/album/${item.album.id}`}>{item.name}</C.CardTitle>
      <C.CardArtistLink
        onClick={(e) => e.stopPropagation()}
        to={`/artist/${item.album.artists[0].id}`}
      >
        {item.album.artists[0].name}
      </C.CardArtistLink>
    </C.CardWrapper>
  );
};

const PlaylistCard = (props: {
  item: SimplifiedPlaylist;
  to: NavigateFunction;
}) => {
  const { to, item } = props;

  return (
    <C.CardWrapper onClick={() => to(`/playlist/${item.id}`)}>
      <C.CardCover
        src={item.images?.length !== 0 ? item.images[0].url : ""}
        alt=""
      />
      <C.CardTitle to={`/playlist/${item.id}`}>{item.name}</C.CardTitle>
      {item.description ? (
        <C.CardDescription
          dangerouslySetInnerHTML={{ __html: item.description }}
        />
      ) : (
        <C.CardDescription>By {item.owner.display_name}</C.CardDescription>
      )}
    </C.CardWrapper>
  );
};

const AlbumCard = (props: { item: Album; to: NavigateFunction }) => {
  const { to, item } = props;

  return (
    <C.CardWrapper onClick={() => to(`/album/${item.id}`)}>
      <C.CardCover src={item.images[0].url} alt="" />
      <C.CardTitle to={`/album/${item.id}`}>{item.name}</C.CardTitle>
      <C.CardDescription>{item.release_date?.slice(0, 4)}</C.CardDescription>
    </C.CardWrapper>
  );
};

const AlbumSavedCard = (props: { item: SavedAlbum; to: NavigateFunction }) => {
  const { to, item } = props;

  return (
    <C.CardWrapper onClick={() => to(`/album/${item.album.id}`)}>
      <C.CardCover src={item.album.images[0].url} alt="" />
      <C.CardTitle to={`/album/${item.album.id}`}>
        {item.album.name}
      </C.CardTitle>
      <C.CardDescription>{item.album.artists[0].name}</C.CardDescription>
    </C.CardWrapper>
  );
};

const AlbumDiscographyCard = (props: {
  item: SimplifiedAlbum;
  to: NavigateFunction;
}) => {
  const { to, item } = props;

  return (
    <C.CardWrapper onClick={() => to(`/album/${item.id}`)}>
      <C.CardCover src={item.images[0].url} alt="" />
      <C.CardTitle to={`/album/${item.id}`}>{item.name}</C.CardTitle>
      {item.album_group === "album" || item.album_group === "appears_on" ? (
        <C.CardDescription>
          {item.release_date?.slice(0, 4)}
          <span className="bull">&bull;</span>
          Album
        </C.CardDescription>
      ) : null}
      {item.album_group === "single" && (
        <C.CardDescription>
          {item.release_date?.slice(0, 4)}
          <span className="bull">&bull;</span>
          {item.total_tracks <= 2 ? "Single" : "EP"}
        </C.CardDescription>
      )}
    </C.CardWrapper>
  );
};

const CategoryCard = (props: {
  item: SimplifiedPlaylist;
  to: NavigateFunction;
}) => {
  const { to, item } = props;

  return (
    <C.CardWrapper onClick={() => to(`/playlist/${item.id}`)}>
      <C.CardCover src={item.images[0].url} alt="" />
      <C.CardTitle to={`/playlist/${item.id}`}>{item.name}</C.CardTitle>
      {item.description ? (
        <C.CardDescription
          dangerouslySetInnerHTML={{ __html: item.description }}
        />
      ) : (
        <C.CardDescription>By {item.owner.display_name}</C.CardDescription>
      )}
    </C.CardWrapper>
  );
};

export default NewCard;
