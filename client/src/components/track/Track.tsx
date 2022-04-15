import React, { Fragment } from "react";
import PlayTrack from "../Play/PlayTrack";
import TrackSaveButton from "./TrackSaveButton";
import TrackMenu from "../TrackMenu/TrackMenu";
import * as T from "./Track.style";
import { Link } from "react-router-dom";
import { BiPlus } from "react-icons/bi";
import { MEDIA } from "../../styles/media";
import { formatDuration } from "../../utils";
import { useViewportWidth } from "../../hooks/useViewportWidth";
import * as topItemsSlice from "../../slices/topItemsSlice";
import * as SpotifyObjects from "../../types/SpotifyObjects";
import { usePlayingTrack } from "../../hooks/usePlayingTrack";
import {
  useSaveAlbumTrack,
  usePlayTrack,
  useSavePopularArtistTrack,
  useSavePlaylistTrack,
  useAddRecommendationPlaylistTrack,
  useSaveUserTopTrack,
  useSaveGenreTrack,
} from "./Track.hooks";

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

type LikedSongsVariant = {
  variant: "liked-songs";
  item: SpotifyObjects.SavedTrack;
  index: number;
  addedAt: string;
};

type TrackProps =
  | AlbumVariant
  | PopularArtistTracksVariant
  | PlaylistVariant
  | PlaylistAddTrackVariant
  | UserTopVariant
  | GenreVariant
  | LikedSongsVariant;

type AlbumTrackProps = Omit<AlbumVariant, "variant">;
type PopularArtistTrackProps = Omit<PopularArtistTracksVariant, "variant">;
type PlaylistTrackProps = Omit<PlaylistVariant, "variant">;
type PlaylistAddTrackProps = Omit<PlaylistAddTrackVariant, "variant">;
type UserTopTrackProps = Omit<UserTopVariant, "variant">;
type GenreTrackProps = Omit<GenreVariant, "variant">;
type LikedTrackProps = Omit<LikedSongsVariant, "variant">;

type MouseEventType = React.MouseEvent<HTMLButtonElement, MouseEvent>;

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
    case "liked-songs":
      return (
        <LikedTrack
          item={props.item}
          index={props.index}
          addedAt={props.addedAt}
        />
      );
  }
};

// Return comma separated artist links
const renderArtists = (list: SpotifyObjects.SimplifiedArtist[]) => {
  return list.map((artist, index, arr) => (
    <Fragment key={index}>
      <Link to={`/artist/${artist.id}`}>{artist.name}</Link>
      {index !== arr.length - 1 && <span>, </span>}
    </Fragment>
  ));
};

const AlbumTrack = ({ item }: AlbumTrackProps) => {
  const [isCurrentTrack, isCurrentTrackPlaying] = usePlayingTrack(item.uri);

  const savePayload = { track: item, isSaved: item.is_saved };
  const saveTrack = useSaveAlbumTrack(savePayload);

  const playPayload = { uris: [item.uri] };
  const [handleMobile, handleDesktop] = usePlayTrack(playPayload);

  const handleSaveTrack = (e: MouseEventType) => {
    e.stopPropagation();
    saveTrack();
  };

  return (
    <T.OrderedTrack onClick={handleMobile} onDoubleClick={handleDesktop}>
      <T.TrackIndex>
        <T.TrackIndexNumber
          $isPlayerTrack={isCurrentTrack}
          $isTrackPlaying={isCurrentTrackPlaying}
        >
          {item.track_number}
        </T.TrackIndexNumber>
        <PlayTrack uri={item.uri} handlePlay={handleDesktop} />
      </T.TrackIndex>
      <T.TrackInfo>
        <T.TrackDetails>
          <T.TrackName $isPlayerTrack={isCurrentTrack}>{item.name}</T.TrackName>
          <T.TrackArtists>
            {item.explicit && <T.ExplicitTrack>E</T.ExplicitTrack>}
            {renderArtists(item?.artists)}
          </T.TrackArtists>
        </T.TrackDetails>
      </T.TrackInfo>
      <T.TrackOptions>
        <TrackSaveButton
          isSaved={item.is_saved}
          handleClick={handleSaveTrack}
        />
        <T.TrackDuration>
          {formatDuration(item.duration_ms, "track")}
        </T.TrackDuration>
        <TrackMenu variant="album" track={item} />
      </T.TrackOptions>
    </T.OrderedTrack>
  );
};

const PopularArtistTrack = ({ item, index = 1 }: PopularArtistTrackProps) => {
  const [isCurrentTrack, isCurrentTrackPlaying] = usePlayingTrack(item.uri);

  const savePayload = { track: item, isSaved: item.is_saved };
  const saveTrack = useSavePopularArtistTrack(savePayload);

  const playPayload = { uris: [item.uri] };
  const [handleMobile, handleDesktop] = usePlayTrack(playPayload);

  const handleSaveTrack = (e: MouseEventType) => {
    e.stopPropagation();
    saveTrack();
  };

  return (
    <T.OrderedTrack onClick={handleMobile} onDoubleClick={handleDesktop}>
      <T.TrackIndex>
        <T.TrackIndexNumber
          $isPlayerTrack={isCurrentTrack}
          $isTrackPlaying={isCurrentTrackPlaying}
        >
          {index !== undefined && index + 1}
        </T.TrackIndexNumber>
        <PlayTrack uri={item.uri} handlePlay={handleDesktop} />
      </T.TrackIndex>
      <T.TrackInfo>
        <T.TrackAlbumCover src={item.album?.images[0].url} alt="" $small />
        <T.TrackDetails>
          <T.TrackName $isPlayerTrack={isCurrentTrack}>{item.name}</T.TrackName>
          {item.explicit && <T.ExplicitTrack>E</T.ExplicitTrack>}
        </T.TrackDetails>
      </T.TrackInfo>
      <T.TrackOptions>
        <TrackSaveButton
          isSaved={item.is_saved}
          handleClick={handleSaveTrack}
        />
        <T.TrackDuration>
          {formatDuration(item.duration_ms, "track")}
        </T.TrackDuration>
        <TrackMenu variant="artist-top" track={item} />
      </T.TrackOptions>
    </T.OrderedTrack>
  );
};

const PlaylistTrack = (props: PlaylistTrackProps) => {
  const { index, item, addedAt } = props;
  const track = item.track as SpotifyObjects.Track;
  const trackUri = item.track.uri;
  const [isCurrentTrack, isCurrentTrackPlaying] = usePlayingTrack(trackUri);

  const savePayload = { track: track, isSaved: item.track.is_saved };
  const saveTrack = useSavePlaylistTrack(savePayload);

  const playPayload = { uris: [trackUri] };
  const [handleMobile, handleDesktop] = usePlayTrack(playPayload);

  const handleSaveTrack = (e: MouseEventType) => {
    e.stopPropagation();
    saveTrack();
  };

  return (
    <T.PlaylistTrack onClick={handleMobile} onDoubleClick={handleDesktop}>
      <T.TrackIndex>
        <T.TrackIndexNumber
          $isPlayerTrack={isCurrentTrack}
          $isTrackPlaying={isCurrentTrackPlaying}
        >
          {index !== undefined && index + 1}
        </T.TrackIndexNumber>
        <PlayTrack uri={trackUri} handlePlay={handleDesktop} />
      </T.TrackIndex>
      <T.TrackInfo>
        <T.TrackAlbumCover
          src={track.album?.images[0] && track.album?.images[0].url}
          alt=""
        />
        <T.TrackDetails>
          <T.TrackName $isPlayerTrack={isCurrentTrack}>
            {track.name}
          </T.TrackName>
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
        <TrackSaveButton
          isSaved={track.is_saved}
          handleClick={handleSaveTrack}
        />
        <T.TrackDuration>
          {formatDuration(track.duration_ms, "track")}
        </T.TrackDuration>
        <TrackMenu variant="playlist" track={track} />
      </T.TrackOptions>
    </T.PlaylistTrack>
  );
};

const PlaylistAddTrack = ({ item }: PlaylistAddTrackProps) => {
  const isDesktop = useViewportWidth(+MEDIA.tablet.slice(0, -2));
  const [isCurrentTrack, isCurrentTrackPlaying] = usePlayingTrack(item.uri);

  const savePayload = { track: item, isSaved: item.is_saved };
  const saveTrack = useAddRecommendationPlaylistTrack(savePayload);

  const playPayload = { uris: [item.uri] };
  const [handleMobile, handleDesktop] = usePlayTrack(playPayload);

  const handleSaveTrack = (e: MouseEventType) => {
    e.stopPropagation();
    saveTrack();
  };

  return (
    <T.PlaylistAddTrack
      onClick={handleMobile}
      onDoubleClick={handleDesktop}
      $isTrackPlaying={isCurrentTrackPlaying}
    >
      <T.TrackInfo>
        <T.TrackAlbumWrapper>
          <T.TrackAlbumCover src={item.album?.images[0].url} alt="" />
          <PlayTrack uri={item.uri} handlePlay={handleDesktop} $insideAlbum />
        </T.TrackAlbumWrapper>
        <T.TrackDetails>
          <T.TrackName $isPlayerTrack={isCurrentTrack}>{item.name}</T.TrackName>
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
        <T.AddTrackToPlaylist onClick={handleSaveTrack}>
          {isDesktop ? "Add" : <BiPlus />}
        </T.AddTrackToPlaylist>
      </T.TrackOptions>
    </T.PlaylistAddTrack>
  );
};

const UserTopTrack = ({ index, item, timeRange }: UserTopTrackProps) => {
  const [isCurrentTrack, isCurrentTrackPlaying] = usePlayingTrack(item.uri);

  const savePayload = { track: item, isSaved: item.is_saved, timeRange };
  const saveTrack = useSaveUserTopTrack(savePayload);

  const playPayload = { uris: [item.uri] };
  const [handleMobile, handleDesktop] = usePlayTrack(playPayload);

  const handleSaveTrack = (e: MouseEventType) => {
    e.stopPropagation();
    saveTrack();
  };

  return (
    <T.TopTrack onClick={handleMobile} onDoubleClick={handleDesktop}>
      <T.TrackIndex>
        <T.TrackIndexNumber
          $isPlayerTrack={isCurrentTrack}
          $isTrackPlaying={isCurrentTrackPlaying}
        >
          {index !== undefined && index + 1}
        </T.TrackIndexNumber>
        <PlayTrack uri={item.uri} handlePlay={handleDesktop} />
      </T.TrackIndex>
      <T.TrackInfo>
        <T.TrackAlbumCover src={item.album?.images[0].url} alt="" />
        <T.TrackDetails>
          <T.TrackName $isPlayerTrack={isCurrentTrack}>{item.name}</T.TrackName>
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
          <TrackSaveButton
            isSaved={item.is_saved}
            handleClick={handleSaveTrack}
          />
        )}
        <T.TrackDuration>
          {formatDuration(item.duration_ms, "track")}
        </T.TrackDuration>
        <TrackMenu variant="user-top" track={item} timeRange={timeRange} />
      </T.TrackOptions>
    </T.TopTrack>
  );
};

const GenreTrack = ({ item }: GenreTrackProps) => {
  const [isCurrentTrack, isCurrentTrackPlaying] = usePlayingTrack(item.uri);

  const savePayload = { track: item, isSaved: item.is_saved };
  const saveTrack = useSaveGenreTrack(savePayload);

  const playPayload = { uris: [item.uri] };
  const [handleMobile, handleDesktop] = usePlayTrack(playPayload);

  const handleSaveTrack = (e: MouseEventType) => {
    e.stopPropagation();
    saveTrack();
  };

  return (
    <T.UnOrderedTrack
      onClick={handleMobile}
      onDoubleClick={handleDesktop}
      $isTrackPlaying={isCurrentTrackPlaying}
    >
      <T.TrackInfo>
        <T.TrackAlbumWrapper>
          <T.TrackAlbumCover src={item.album?.images[0].url} alt="" />
          <PlayTrack uri={item.uri} handlePlay={handleDesktop} $insideAlbum />
        </T.TrackAlbumWrapper>
        <T.TrackDetails>
          <T.TrackName $isPlayerTrack={isCurrentTrack}>{item.name}</T.TrackName>
          <T.TrackArtists>
            {item.explicit && <T.ExplicitTrack>E</T.ExplicitTrack>}
            {renderArtists(item.artists)}
          </T.TrackArtists>
        </T.TrackDetails>
      </T.TrackInfo>
      <T.TrackOptions>
        <TrackSaveButton
          isSaved={item.is_saved}
          handleClick={handleSaveTrack}
        />
        <T.TrackDuration>
          {formatDuration(item.duration_ms, "track")}
        </T.TrackDuration>
        <TrackMenu variant="genre" track={item} />
      </T.TrackOptions>
    </T.UnOrderedTrack>
  );
};

const LikedTrack = ({ index, item, addedAt }: LikedTrackProps) => {
  const track = item.track as SpotifyObjects.Track;
  const trackUri = item.track.uri;
  const [isCurrentTrack, isCurrentTrackPlaying] = usePlayingTrack(trackUri);

  // const savePayload = { track: track, isSaved: item.track.is_saved };
  // const saveTrack = useSavePlaylistTrack(savePayload);

  const playPayload = { uris: [trackUri] };
  const [handleMobile, handleDesktop] = usePlayTrack(playPayload);

  const handleSaveTrack = (e: MouseEventType) => {
    e.stopPropagation();
    // saveTrack();
  };

  return (
    <T.PlaylistTrack onClick={handleMobile} onDoubleClick={handleDesktop}>
      <T.TrackIndex>
        <T.TrackIndexNumber
          $isPlayerTrack={isCurrentTrack}
          $isTrackPlaying={isCurrentTrackPlaying}
        >
          {index !== undefined && index + 1}
        </T.TrackIndexNumber>
        <PlayTrack uri={trackUri} handlePlay={handleDesktop} />
      </T.TrackIndex>
      <T.TrackInfo>
        <T.TrackAlbumCover
          src={track.album?.images[0] && track.album?.images[0].url}
          alt=""
        />
        <T.TrackDetails>
          <T.TrackName $isPlayerTrack={isCurrentTrack}>
            {track.name}
          </T.TrackName>
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
        <TrackSaveButton isSaved={true} handleClick={handleSaveTrack} />
        <T.TrackDuration>
          {formatDuration(track.duration_ms, "track")}
        </T.TrackDuration>
        <TrackMenu variant="playlist" track={track} />
      </T.TrackOptions>
    </T.PlaylistTrack>
  );
};

export default TrackComponent;
