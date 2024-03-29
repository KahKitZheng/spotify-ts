import Play from "../Play";
import * as C from "./Card.style";
import * as I from "./Card.interface";
import * as SpotifyObjects from "@/types/SpotifyObjects";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentUserId } from "@/slices/currentUserSlice";
import { selectSavedTracks } from "@/slices/savedTracksSlice";
import { ArtistPlaceholder, TrackPlaceholder } from "@/assets/placeholders";
import { renderCardImg } from "../../utils";

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
        {item.track.album?.images.length > 0 ? (
          <C.CardCover
            src={renderCardImg(item.track.album?.images)}
            alt=""
            loading="lazy"
            $overflow={overflow}
          />
        ) : (
          <TrackPlaceholder />
        )}
        <Play variant="track" uri={item.track.uri} />
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
        {item.images?.length > 0 ? (
          <C.CardCover
            src={renderCardImg(item?.images)}
            alt=""
            loading="lazy"
            $isArtist
            $overflow={overflow}
          />
        ) : (
          <ArtistPlaceholder />
        )}
        <Play variant="artist" uri={item.uri} />
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
        {item.album?.images.length > 0 ? (
          <C.CardCover
            src={renderCardImg(item.album?.images)}
            alt=""
            loading="lazy"
            $overflow={overflow}
          />
        ) : (
          <TrackPlaceholder />
        )}
        <Play variant="track" uri={item.uri} />
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
        {item.images.length > 0 ? (
          <C.CardCover
            src={item.images[0].url}
            alt=""
            loading="lazy"
            $overflow={overflow}
          />
        ) : (
          <TrackPlaceholder />
        )}
        <Play variant="playlist" uri={item.uri} />
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
        {item.images.length > 0 ? (
          <C.CardCover
            src={renderCardImg(item.images)}
            alt=""
            loading="lazy"
            $overflow={overflow}
          />
        ) : (
          <TrackPlaceholder />
        )}
        <Play variant="album" uri={item.uri} />
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
        {item.album.images?.length > 0 ? (
          <C.CardCover
            src={renderCardImg(item.album.images)}
            alt=""
            loading="lazy"
            $overflow={overflow}
          />
        ) : (
          <TrackPlaceholder />
        )}
        <Play variant="album" uri={item.album.uri} />
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
        {item.images.length > 0 ? (
          <C.CardCover
            src={renderCardImg(item.images)}
            alt=""
            loading="lazy"
            $overflow={overflow}
          />
        ) : (
          <TrackPlaceholder />
        )}
        <Play variant="album" uri={item.uri} />
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

export const LikedSongsCard = () => {
  const navigate = useNavigate();
  const userId = useAppSelector(selectCurrentUserId);
  const savedTracks = useAppSelector(selectSavedTracks);

  return savedTracks?.items ? (
    <C.CardWrapper $isLikedSongs onClick={() => navigate(`/liked-songs`)}>
      <C.CardHeader>
        {savedTracks?.items?.map((item) => (
          <C.LikedSongsContentWrapper key={item.track.id}>
            <C.LikedSongsArtist>
              {item.track.artists[0].name}{" "}
            </C.LikedSongsArtist>
            <C.LikedSongsName>{item.track.name}</C.LikedSongsName>
          </C.LikedSongsContentWrapper>
        ))}
      </C.CardHeader>
      <C.LikedSongsInfo>
        <C.LikedSongsTitle to={`/liked-songs`}>Liked Songs</C.LikedSongsTitle>
        <C.LikedSongsDescription>
          {savedTracks?.total} liked songs
        </C.LikedSongsDescription>
        <Play variant="liked-songs" uri={`spotify:user:${userId}:collection`} />
      </C.LikedSongsInfo>
    </C.CardWrapper>
  ) : null;
};

export default NewCard;
