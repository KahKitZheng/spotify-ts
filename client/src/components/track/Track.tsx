import React, { Fragment } from "react";
import TrackSaveButton from "./TrackSaveButton";
import TrackMenu from "../TrackMenu/TrackMenu";
import * as T from "./Track.style";
import { Link } from "react-router-dom";
import { BiPlus } from "react-icons/bi";
import { MEDIA } from "../../styles/media";
import { formatDuration } from "../../utils";
import { useViewportWidth } from "../../hooks/useViewportWidth";
import * as TrackHooks from "./Track.hooks";
import * as topItemsSlice from "../../slices/topItemsSlice";
import * as SpotifyObjects from "../../types/SpotifyObjects";

type AlbumVariant = {
  variant: "album";
  item: SpotifyObjects.SimplifiedTrack;
};

type PopularArtistTracksVariant = {
  variant: "popular-artist-tracks";
  item: SpotifyObjects.Track;
  index: number;
};

type PlaylistVariant = {
  variant: "playlist";
  item: SpotifyObjects.PlaylistItem;
  index: number;
  addedAt: string;
  isOwner: boolean;
};

type PlaylistAddTrackVariant = {
  variant: "playlist-add-track";
  item: SpotifyObjects.Track;
};

type UserTopVariant = {
  variant: "user-top";
  item: SpotifyObjects.Track;
  index: number;
  timeRange: topItemsSlice.TimeRange;
};

type GenreVariant = {
  variant: "genre";
  item: SpotifyObjects.Track;
};

type TrackProps =
  | AlbumVariant
  | PopularArtistTracksVariant
  | PlaylistVariant
  | PlaylistAddTrackVariant
  | UserTopVariant
  | GenreVariant;

type AlbumTrackProps = Omit<AlbumVariant, "variant">;
type PopularArtistTrackProps = Omit<PopularArtistTracksVariant, "variant">;
type PlaylistTrackProps = Omit<PlaylistVariant, "variant">;
type PlaylistAddTrackProps = Omit<PlaylistAddTrackVariant, "variant">;
type UserTopTrackProps = Omit<UserTopVariant, "variant">;
type GenreTrackProps = Omit<GenreVariant, "variant">;

const TrackComponent = (props: TrackProps) => {
  switch (props.variant) {
    case "album":
      return <AlbumTrack item={props.item} />;
    case "genre":
      return <GenreTrack item={props.item} />;
    case "popular-artist-tracks":
      return <PopularArtistTrack item={props.item} index={props.index} />;
    case "playlist-add-track":
      return <PlaylistAddTrack item={props.item as SpotifyObjects.Track} />;
    case "playlist":
      return (
        <PlaylistTrack
          item={props.item}
          addedAt={props.addedAt}
          index={props.index}
          isOwner={props.isOwner}
        />
      );
    case "user-top":
      return (
        <UserTopTrack
          item={props.item}
          index={props.index}
          timeRange={props.timeRange}
        />
      );
  }
};

// Return comma separated artist links
const renderArtists = (list: SpotifyObjects.SimplifiedArtist[]) => {
  return list.map((artist, index, arr) => (
    <Fragment key={artist.id}>
      <Link to={`/artist/${artist.id}`}>{artist.name}</Link>
      {index !== arr.length - 1 && <span>, </span>}
    </Fragment>
  ));
};

const AlbumTrack = ({ item }: AlbumTrackProps) => {
  const payload = { track: item, isSaved: item.is_saved };
  const saveTrack = TrackHooks.useSaveAlbumTrack(payload);

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
        <TrackSaveButton isSaved={item.is_saved} handleClick={saveTrack} />
        <T.TrackDuration>
          {formatDuration(item.duration_ms, "track")}
        </T.TrackDuration>
        <TrackMenu
          variant="album"
          track={item}
          artistId={item.artists}
          isSaved={item.is_saved}
        />
      </T.TrackOptions>
    </T.OrderedTrack>
  );
};

const PopularArtistTrack = ({ item, index = 1 }: PopularArtistTrackProps) => {
  const payload = { track: item, isSaved: item.is_saved };
  const saveTrack = TrackHooks.useSavePopularArtistTrack(payload);

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
        <TrackSaveButton isSaved={item.is_saved} handleClick={saveTrack} />
        <T.TrackDuration>
          {formatDuration(item.duration_ms, "track")}
        </T.TrackDuration>
        <TrackMenu
          variant="artist-top"
          track={item}
          albumId={item.album.id}
          isSaved={item.is_saved}
        />
      </T.TrackOptions>
    </T.OrderedTrack>
  );
};

const PlaylistTrack = (props: PlaylistTrackProps) => {
  const { index, item, addedAt, isOwner } = props;
  const track = item.track as SpotifyObjects.Track;

  const payload = { track: track, isSaved: item.track.is_saved };
  const saveTrack = TrackHooks.useSavePlaylistTrack(payload);

  return (
    <T.PlaylistTrack>
      {index !== undefined && <T.TrackIndex>{index + 1}</T.TrackIndex>}
      <T.TrackInfo>
        <T.TrackAlbumCover
          src={track.album?.images[0] && track.album?.images[0].url}
          alt=""
        />
        <T.TrackDetails>
          <T.TrackName>{track.name}</T.TrackName>
          <T.TrackArtists>
            {track.explicit && <T.ExplicitTrack>E</T.ExplicitTrack>}
            {renderArtists(track.artists)}
          </T.TrackArtists>
        </T.TrackDetails>
      </T.TrackInfo>
      <T.TrackAlbum>
        <Link to={`/album/${track.album?.id}`}>{track.album?.name}</Link>
      </T.TrackAlbum>
      {addedAt !== null && <T.TrackDateAdded>{addedAt}</T.TrackDateAdded>}
      <T.TrackOptions>
        <TrackSaveButton isSaved={track.is_saved} handleClick={saveTrack} />
        <T.TrackDuration>
          {formatDuration(track.duration_ms, "track")}
        </T.TrackDuration>
        <TrackMenu
          variant="playlist"
          track={track}
          artistId={track.artists}
          albumId={track.album.id}
          isSaved={track.is_saved}
          isPlaylistOwner={isOwner}
        />
      </T.TrackOptions>
    </T.PlaylistTrack>
  );
};

const PlaylistAddTrack = ({ item }: PlaylistAddTrackProps) => {
  const payload = { track: item, isSaved: item.is_saved };
  const saveTrack = TrackHooks.useSaveAddPlaylistTrack(payload);

  const isDesktop = useViewportWidth(+MEDIA.tablet.slice(0, -2));

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
        <T.TrackAlbum>
          <Link to={`/album/${item.album?.id}`}>{item.album?.name}</Link>
        </T.TrackAlbum>
      </T.AddPlaylistTrackAlbumSection>
      <T.TrackOptions>
        <T.TrackDuration>
          {formatDuration(item.duration_ms, "track")}
        </T.TrackDuration>
        <T.AddTrackToPlaylist onClick={saveTrack}>
          {isDesktop ? "Add" : <BiPlus />}
        </T.AddTrackToPlaylist>
      </T.TrackOptions>
    </T.PlaylistAddTrack>
  );
};

const UserTopTrack = ({ index, item, timeRange }: UserTopTrackProps) => {
  const payload = { track: item, isSaved: item.is_saved, timeRange };
  const saveTrack = TrackHooks.useSaveUserTopTrack(payload);

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
          <TrackSaveButton isSaved={item.is_saved} handleClick={saveTrack} />
        )}
        <T.TrackDuration>
          {formatDuration(item.duration_ms, "track")}
        </T.TrackDuration>
        <TrackMenu
          variant="user-top"
          track={item}
          timeRange={timeRange}
          artistId={item.artists}
          albumId={item.album.id}
          isSaved={item.is_saved}
        />
      </T.TrackOptions>
    </T.TopTrack>
  );
};

const GenreTrack = ({ item }: GenreTrackProps) => {
  const payload = { track: item, isSaved: item.is_saved };
  const saveTrack = TrackHooks.useSaveGenreTrack(payload);

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
        <TrackSaveButton isSaved={item.is_saved} handleClick={saveTrack} />
        <T.TrackDuration>
          {formatDuration(item.duration_ms, "track")}
        </T.TrackDuration>
        <TrackMenu
          variant="genre"
          track={item}
          artistId={item.artists}
          albumId={item.album.id}
          isSaved={item.is_saved}
        />
      </T.TrackOptions>
    </T.Track>
  );
};

export default TrackComponent;
