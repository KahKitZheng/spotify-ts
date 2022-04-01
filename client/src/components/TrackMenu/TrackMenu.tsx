import React, { useCallback, useEffect, useState } from "react";
import Tippy from "@tippyjs/react/headless";
import ArtistLinks from "./ArtistLinks";
import AlbumLink from "./AlbumLink";
import PlaylistOptions from "./PlaylistOptions";
import * as M from "./TrackMenu.style";
import * as SpotifyObjects from "../../types/SpotifyObjects";
import { MEDIA } from "../../styles/media";
import { BsThreeDots } from "react-icons/bs";
import { useScrollBlock } from "../../hooks/useScrollBlock";
import { useViewportWidth } from "../../hooks/useViewportWidth";
import { TimeRange } from "../../slices/topItemsSlice";
import * as TrackHooks from "../Track/Track.hooks";

type GenreMenuProps = {
  variant: "genre";
  track: SpotifyObjects.Track;
};

type UserTopMenuProps = {
  variant: "user-top";
  track: SpotifyObjects.Track;
  timeRange: TimeRange;
};

type PopularArtistTrackMenuProps = {
  variant: "artist-top";
  track: SpotifyObjects.Track;
};

type AlbumMenuProps = {
  variant: "album";
  track: SpotifyObjects.SimplifiedTrack;
};

type PlaylistMenuProps = {
  variant: "playlist";
  isPlaylistOwner: boolean;
  track: SpotifyObjects.Track;
  playlistId: string;
};

type Props =
  | PopularArtistTrackMenuProps
  | AlbumMenuProps
  | PlaylistMenuProps
  | GenreMenuProps
  | UserTopMenuProps;

const TrackMenu = (props: Props) => {
  const [visible, setVisible] = useState(false);
  const [blockScroll, allowScroll] = useScrollBlock();

  const isDesktop = useViewportWidth(+MEDIA.tablet.slice(0, -2));

  const show = () => {
    setVisible(true);
    blockScroll();
  };

  const hide = useCallback(() => {
    setVisible(false);
    allowScroll();
  }, [allowScroll]);

  // Hide the tippy popover if the window is smaller than desktop viewport
  useEffect(() => {
    !isDesktop && hide();
  }, [hide, isDesktop]);

  function getTrackMenuVariant() {
    switch (props.variant) {
      case "artist-top":
        return <PopularArtistTrackMenu {...props} />;
      case "album":
        return <AlbumMenu {...props} />;
      case "playlist":
        return <PlaylistMenu {...props} />;
      case "genre":
        return <GenreMenu {...props} />;
      case "user-top":
        return <UserTopMenu {...props} />;
    }
  }

  return (
    <Tippy
      interactive={true}
      visible={visible}
      onClickOutside={hide}
      onDestroy={hide}
      placement="left"
      render={getTrackMenuVariant}
    >
      <M.TrackOptionsWrapper onClick={visible ? hide : show}>
        <BsThreeDots />
      </M.TrackOptionsWrapper>
    </Tippy>
  );
};

const PopularArtistTrackMenu = ({ track }: PopularArtistTrackMenuProps) => {
  const payload = { track, isSaved: track.is_saved };
  const saveTrack = TrackHooks.useSavePopularArtistTrack(payload);

  return (
    <M.OptionsList>
      <M.OptionItemWrapper>
        <M.OptionItemButton $borderSide="bottom">
          Add to queue
        </M.OptionItemButton>
      </M.OptionItemWrapper>

      {track.album.id !== undefined && <AlbumLink albumId={track.album.id} />}

      <M.OptionItemWrapper>
        <M.OptionItemButton $borderSide="top" onClick={saveTrack}>
          {track.is_saved
            ? `Remove from your liked songs`
            : `Save to your liked songs`}
        </M.OptionItemButton>
      </M.OptionItemWrapper>

      <PlaylistOptions />
    </M.OptionsList>
  );
};

const AlbumMenu = ({ track }: AlbumMenuProps) => {
  const payload = { track, isSaved: track.is_saved };
  const saveTrack = TrackHooks.useSaveAlbumTrack(payload);

  return (
    <M.OptionsList>
      <M.OptionItemWrapper>
        <M.OptionItemButton $borderSide="bottom">
          Add to queue
        </M.OptionItemButton>
      </M.OptionItemWrapper>

      {track.artists !== undefined && <ArtistLinks artistIds={track.artists} />}

      <M.OptionItemWrapper>
        <M.OptionItemButton $borderSide="top" onClick={saveTrack}>
          {track.is_saved
            ? `Remove from your liked songs`
            : `Save to your liked songs`}
        </M.OptionItemButton>
      </M.OptionItemWrapper>

      <PlaylistOptions />
    </M.OptionsList>
  );
};

const PlaylistMenu = ({ track, isPlaylistOwner }: PlaylistMenuProps) => {
  const savePayload = { track, isSaved: track.is_saved };
  const saveTrack = TrackHooks.useSavePlaylistTrack(savePayload);
  const removeTrack = TrackHooks.useRemovePlaylistTrack(track);

  return (
    <M.OptionsList>
      <M.OptionItemWrapper>
        <M.OptionItemButton $borderSide="bottom">
          Add to queue
        </M.OptionItemButton>
      </M.OptionItemWrapper>

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

      <PlaylistOptions />
    </M.OptionsList>
  );
};

const GenreMenu = ({ track }: GenreMenuProps) => {
  const payload = { track, isSaved: track.is_saved };
  const saveTrack = TrackHooks.useSaveGenreTrack(payload);

  return (
    <M.OptionsList>
      <M.OptionItemWrapper>
        <M.OptionItemButton $borderSide="bottom">
          Add to queue
        </M.OptionItemButton>
      </M.OptionItemWrapper>

      {track.artists !== undefined && <ArtistLinks artistIds={track.artists} />}

      {track.album.id !== undefined && <AlbumLink albumId={track.album.id} />}

      <M.OptionItemWrapper>
        <M.OptionItemButton $borderSide="top" onClick={saveTrack}>
          {track.is_saved
            ? `Remove from your liked songs`
            : `Save to your liked songs`}
        </M.OptionItemButton>
      </M.OptionItemWrapper>

      <PlaylistOptions />
    </M.OptionsList>
  );
};

const UserTopMenu = ({ track, timeRange }: UserTopMenuProps) => {
  const payload = { track, isSaved: track.is_saved, timeRange };
  const saveTrack = TrackHooks.useSaveUserTopTrack(payload);

  return (
    <M.OptionsList>
      <M.OptionItemWrapper>
        <M.OptionItemButton $borderSide="bottom">
          Add to queue
        </M.OptionItemButton>
      </M.OptionItemWrapper>

      {track.artists !== undefined && <ArtistLinks artistIds={track.artists} />}

      {track.album.id !== undefined && <AlbumLink albumId={track.album.id} />}

      <M.OptionItemWrapper>
        <M.OptionItemButton $borderSide="top" onClick={saveTrack}>
          {track.is_saved
            ? `Remove from your liked songs`
            : `Save to your liked songs`}
        </M.OptionItemButton>
      </M.OptionItemWrapper>

      <PlaylistOptions />
    </M.OptionsList>
  );
};

export default TrackMenu;
