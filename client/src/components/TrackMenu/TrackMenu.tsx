import React from "react";
import ArtistLinks from "./ArtistLinks";
import AlbumLink from "./AlbumLink";
import PlaylistOptions from "./PlaylistOptions";
import * as M from "./TrackMenu.style";
import * as TrackHooks from "../Track/Track.hooks";
import * as SpotifyObjects from "../../types/SpotifyObjects";
import { BsThreeDots } from "react-icons/bs";
import { NestedPopover } from "../Popover";
import { TimeRange } from "../../slices/topItemsSlice";

type GenreMenuVariant = {
  variant: "genre";
  track: SpotifyObjects.Track;
};

type UserTopMenuVariant = {
  variant: "user-top";
  track: SpotifyObjects.Track;
  timeRange: TimeRange;
};

type PopularArtistTrackMenuVariant = {
  variant: "artist-top";
  track: SpotifyObjects.Track;
};

type AlbumMenuVariant = {
  variant: "album";
  track: SpotifyObjects.SimplifiedTrack;
};

type PlaylistMenuVariant = {
  variant: "playlist";
  isPlaylistOwner: boolean;
  track: SpotifyObjects.Track;
  playlistId: string;
};

type Props =
  | PopularArtistTrackMenuVariant
  | AlbumMenuVariant
  | PlaylistMenuVariant
  | GenreMenuVariant
  | UserTopMenuVariant;

type PopoverProps = { close: () => void; labelId: string };
type PopularArtistTrackMenuProps = PopularArtistTrackMenuVariant & PopoverProps;
type AlbumMenuProps = AlbumMenuVariant & PopoverProps;
type PlaylistMenuProps = PlaylistMenuVariant & PopoverProps;
type GenreMenuProps = GenreMenuVariant & PopoverProps;
type UserTopMenuProps = UserTopMenuVariant & PopoverProps;

const TrackMenu = (props: Props) => {
  return (
    <NestedPopover
      render={({ close, labelId }) => {
        switch (props.variant) {
          case "artist-top":
            return (
              <PopularArtistTrackMenu
                {...props}
                close={close}
                labelId={labelId}
              />
            );
          case "album":
            return <AlbumMenu {...props} close={close} labelId={labelId} />;
          case "playlist":
            return <PlaylistMenu {...props} close={close} labelId={labelId} />;
          case "genre":
            return <GenreMenu {...props} close={close} labelId={labelId} />;
          case "user-top":
            return <UserTopMenu {...props} close={close} labelId={labelId} />;
        }
      }}
    >
      <M.TrackOptionsWrapper>
        <BsThreeDots />
      </M.TrackOptionsWrapper>
    </NestedPopover>
  );
};

const PopularArtistTrackMenu = (props: PopularArtistTrackMenuProps) => {
  const { track, labelId, close } = props;
  const payload = { track, isSaved: track.is_saved };
  const saveTrack = TrackHooks.useSavePopularArtistTrack(payload);

  return (
    <M.OptionsList id={labelId}>
      {track.album.id !== undefined && <AlbumLink albumId={track.album.id} />}

      <M.OptionItemWrapper>
        <M.OptionItemButton $borderSide="top" onClick={saveTrack}>
          {track.is_saved
            ? `Remove from your liked songs`
            : `Save to your liked songs`}
        </M.OptionItemButton>
      </M.OptionItemWrapper>

      <PlaylistOptions track={track} close={close} />
    </M.OptionsList>
  );
};

const AlbumMenu = ({ track, labelId, close }: AlbumMenuProps) => {
  const payload = { track, isSaved: track.is_saved };
  const saveTrack = TrackHooks.useSaveAlbumTrack(payload);

  return (
    <M.OptionsList id={labelId}>
      {track.artists !== undefined && <ArtistLinks artistIds={track.artists} />}

      <M.OptionItemWrapper>
        <M.OptionItemButton $borderSide="top" onClick={saveTrack}>
          {track.is_saved
            ? `Remove from your liked songs`
            : `Save to your liked songs`}
        </M.OptionItemButton>
      </M.OptionItemWrapper>

      <PlaylistOptions track={track} close={close} />
    </M.OptionsList>
  );
};

const PlaylistMenu = (props: PlaylistMenuProps) => {
  const { track, isPlaylistOwner, close, labelId } = props;
  const savePayload = { track, isSaved: track.is_saved };
  const saveTrack = TrackHooks.useSavePlaylistTrack(savePayload);
  const removeTrack = TrackHooks.useRemovePlaylistTrack(track);

  return (
    <M.OptionsList id={labelId}>
      {track.artists !== undefined && <ArtistLinks artistIds={track.artists} />}

      {track.album?.id !== undefined && <AlbumLink albumId={track.album?.id} />}

      <M.OptionItemWrapper>
        <M.OptionItemButton $borderSide="top" onClick={saveTrack}>
          {track.is_saved
            ? `Remove from your liked songs`
            : `Save to your liked songs`}
        </M.OptionItemButton>
      </M.OptionItemWrapper>

      {isPlaylistOwner && (
        <M.OptionItemWrapper>
          <M.OptionItemButton onClick={removeTrack}>
            Remove from this playlist
          </M.OptionItemButton>
        </M.OptionItemWrapper>
      )}

      <PlaylistOptions track={track} close={close} />
    </M.OptionsList>
  );
};

const GenreMenu = ({ track, labelId, close }: GenreMenuProps) => {
  const payload = { track, isSaved: track.is_saved };
  const saveTrack = TrackHooks.useSaveGenreTrack(payload);

  return (
    <M.OptionsList id={labelId}>
      {track.artists !== undefined && <ArtistLinks artistIds={track.artists} />}

      {track.album.id !== undefined && <AlbumLink albumId={track.album.id} />}

      <M.OptionItemWrapper>
        <M.OptionItemButton $borderSide="top" onClick={saveTrack}>
          {track.is_saved
            ? `Remove from your liked songs`
            : `Save to your liked songs`}
        </M.OptionItemButton>
      </M.OptionItemWrapper>

      <PlaylistOptions track={track} close={close} />
    </M.OptionsList>
  );
};

const UserTopMenu = (props: UserTopMenuProps) => {
  const { track, timeRange, labelId, close } = props;
  const payload = { track, isSaved: track.is_saved, timeRange };
  const saveTrack = TrackHooks.useSaveUserTopTrack(payload);

  return (
    <M.OptionsList id={labelId}>
      {track.artists !== undefined && <ArtistLinks artistIds={track.artists} />}

      {track.album.id !== undefined && <AlbumLink albumId={track.album.id} />}

      <M.OptionItemWrapper>
        <M.OptionItemButton $borderSide="top" onClick={saveTrack}>
          {track.is_saved
            ? `Remove from your liked songs`
            : `Save to your liked songs`}
        </M.OptionItemButton>
      </M.OptionItemWrapper>

      <PlaylistOptions track={track} close={close} />
    </M.OptionsList>
  );
};

export default TrackMenu;
