import React from "react";
import Play from "../Play";
import * as C from "./Card.style";
import * as I from "./Card.interface";
import * as SpotifyObjects from "../../types/SpotifyObjects";
import { useNavigate } from "react-router-dom";

const NewCard = (props: I.CardProps) => {
  const { variant, item, overflow } = props;
  const navigate = useNavigate();

  switch (variant) {
    case "recent-tracks":
      return (
        <RecentTracksCard
          item={item as SpotifyObjects.PlayHistory}
          to={navigate}
          overflow={overflow}
        />
      );
    case "artist":
      return (
        <ArtistCard
          item={item as SpotifyObjects.Artist}
          to={navigate}
          overflow={overflow}
        />
      );
    case "track":
      return (
        <TrackCard
          item={item as SpotifyObjects.Track}
          to={navigate}
          overflow={overflow}
        />
      );
    case "playlist":
      return (
        <PlaylistCard
          item={item as SpotifyObjects.SimplifiedPlaylist}
          to={navigate}
          overflow={overflow}
        />
      );
    case "album":
      return (
        <AlbumCard
          item={item as SpotifyObjects.Album}
          to={navigate}
          overflow={overflow}
        />
      );
    case "album-saved":
      return (
        <AlbumSavedCard
          item={item as SpotifyObjects.SavedAlbum}
          to={navigate}
          overflow={overflow}
        />
      );
    case "album-discography":
      return (
        <AlbumDiscographyCard
          item={item as SpotifyObjects.SimplifiedAlbum}
          to={navigate}
          overflow={overflow}
        />
      );
    default:
      return null;
  }
};

const RecentTracksCard = ({ item, to, overflow }: I.RecentTracksCardProps) => {
  return (
    <C.CardWrapper onClick={() => to(`/album/${item.track.album?.id}`)}>
      <C.CardHeader>
        <C.CardCover
          src={
            item.track.album?.images.length > 0
              ? item.track.album?.images[0].url
              : ""
          }
          alt=""
          $overflow={overflow}
        />
        <Play variant="track" id={item.track.uri} />
      </C.CardHeader>
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

const ArtistCard = ({ item, to, overflow }: I.ArtistCardProps) => {
  return (
    <C.CardWrapper onClick={() => to(`/artist/${item.id}`)}>
      <C.CardHeader>
        <C.CardCover
          src={item.images.length > 0 ? item?.images[0].url : ""}
          alt=""
          $isArtist
          $overflow={overflow}
        />
        <Play variant="artist" id={item.id} />
      </C.CardHeader>
      <C.CardTitle to={`/artist/${item.id}`}>{item.name}</C.CardTitle>
      <C.CardDescription>Artist</C.CardDescription>
    </C.CardWrapper>
  );
};

const TrackCard = ({ item, to, overflow }: I.TrackCardProps) => {
  return (
    <C.CardWrapper onClick={() => to(`/album/${item.album.id}`)}>
      <C.CardHeader>
        <C.CardCover
          src={item.album?.images.length > 0 ? item.album?.images[0].url : ""}
          alt=""
          $overflow={overflow}
        />
        <Play variant="track" id={item.uri} />
      </C.CardHeader>
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

const PlaylistCard = ({ item, to, overflow }: I.PlaylistCardProps) => {
  return (
    <C.CardWrapper onClick={() => to(`/playlist/${item.id}`)}>
      <C.CardHeader>
        {item.images[0] === undefined ? (
          <C.CardCoverPlaceholder $overflow={overflow}>
            {item.name.slice(0, 1)}
          </C.CardCoverPlaceholder>
        ) : (
          <C.CardCover
            src={item.images?.length !== 0 ? item.images[0].url : ""}
            alt=""
            $overflow={overflow}
          />
        )}
        <Play variant="playlist" id={item.id} />
      </C.CardHeader>
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

const AlbumCard = ({ item, to, overflow }: I.AlbumCardProps) => {
  return (
    <C.CardWrapper onClick={() => to(`/album/${item.id}`)}>
      <C.CardHeader>
        <C.CardCover src={item.images[0].url} alt="" $overflow={overflow} />
        <Play variant="album" id={item.id} />
      </C.CardHeader>
      <C.CardTitle to={`/album/${item.id}`}>{item.name}</C.CardTitle>
      <C.CardDescription>{item.release_date?.slice(0, 4)}</C.CardDescription>
    </C.CardWrapper>
  );
};

const AlbumSavedCard = ({ item, to, overflow }: I.AlbumSavedCardProps) => {
  return (
    <C.CardWrapper onClick={() => to(`/album/${item.album.id}`)}>
      <C.CardHeader>
        <C.CardCover
          src={item.album.images[0].url}
          alt=""
          $overflow={overflow}
        />
        <Play variant="album" id={item.album.id} />
      </C.CardHeader>
      <C.CardTitle to={`/album/${item.album.id}`}>
        {item.album.name}
      </C.CardTitle>
      <C.CardDescription>{item.album.artists[0].name}</C.CardDescription>
    </C.CardWrapper>
  );
};

const AlbumDiscographyCard = (props: I.AlbumDiscographyCardProps) => {
  const { item, to, overflow } = props;

  return (
    <C.CardWrapper onClick={() => to(`/album/${item.id}`)}>
      <C.CardHeader>
        <C.CardCover src={item.images[0].url} alt="" $overflow={overflow} />
        <Play variant="album" id={item.id} />
      </C.CardHeader>
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

export default NewCard;
