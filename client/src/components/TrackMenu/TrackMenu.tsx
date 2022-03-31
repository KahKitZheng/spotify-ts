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
import {
  useSaveAlbumTrack,
  useSaveGenreTrack,
  useSavePlaylistTrack,
  useSavePopularArtistTrack,
  useSaveUserTopTrack,
} from "../Track/Track.hooks";

type GenreMenuProps = {
  variant: "genre";
  artistId: SpotifyObjects.SimplifiedArtist[];
  albumId: string;
  isSaved: boolean;
  track: SpotifyObjects.Track;
};

type UserTopMenuProps = {
  variant: "user-top";
  artistId: SpotifyObjects.SimplifiedArtist[];
  albumId: string;
  isSaved: boolean;
  track: SpotifyObjects.Track;
  timeRange: TimeRange;
};

type ArtistTopMenuProps = {
  variant: "artist-top";
  albumId: string;
  isSaved: boolean;
  track: SpotifyObjects.Track;
};

type AlbumMenuProps = {
  variant: "album";
  artistId: SpotifyObjects.SimplifiedArtist[];
  isSaved: boolean;
  track: SpotifyObjects.SimplifiedTrack;
};

type PlaylistMenuProps = {
  variant: "playlist";
  artistId: SpotifyObjects.SimplifiedArtist[];
  albumId: string;
  isSaved: boolean;
  isPlaylistOwner: boolean;
  track: SpotifyObjects.Track;
};

type Props =
  | ArtistTopMenuProps
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
        return <ArtistTopMenu {...props} />;
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

const ArtistTopMenu = (props: ArtistTopMenuProps) => {
  const { track, isSaved, albumId } = props;
  const saveTrack = useSavePopularArtistTrack({ track, isSaved });

  return (
    <M.OptionsList>
      <M.OptionItemWrapper>
        <M.OptionItemButton $borderSide="bottom">
          Add to queue
        </M.OptionItemButton>
      </M.OptionItemWrapper>

      {albumId !== undefined && <AlbumLink albumId={albumId} />}

      <M.OptionItemWrapper>
        <M.OptionItemButton $borderSide="top" onClick={saveTrack}>
          {isSaved
            ? `Remove from your liked songs`
            : `Save to your liked songs`}
        </M.OptionItemButton>
      </M.OptionItemWrapper>

      <PlaylistOptions />
    </M.OptionsList>
  );
};

const AlbumMenu = (props: AlbumMenuProps) => {
  const { track, isSaved, artistId } = props;
  const saveTrack = useSaveAlbumTrack({ track, isSaved });

  return (
    <M.OptionsList>
      <M.OptionItemWrapper>
        <M.OptionItemButton $borderSide="bottom">
          Add to queue
        </M.OptionItemButton>
      </M.OptionItemWrapper>

      {artistId !== undefined && <ArtistLinks artistIds={artistId} />}

      <M.OptionItemWrapper>
        <M.OptionItemButton $borderSide="top" onClick={saveTrack}>
          {isSaved
            ? `Remove from your liked songs`
            : `Save to your liked songs`}
        </M.OptionItemButton>
      </M.OptionItemWrapper>

      <PlaylistOptions />
    </M.OptionsList>
  );
};

const PlaylistMenu = (props: PlaylistMenuProps) => {
  const { track, isSaved, artistId, albumId, isPlaylistOwner } = props;
  const saveTrack = useSavePlaylistTrack({ track, isSaved });

  return (
    <M.OptionsList>
      <M.OptionItemWrapper>
        <M.OptionItemButton $borderSide="bottom">
          Add to queue
        </M.OptionItemButton>
      </M.OptionItemWrapper>

      {artistId !== undefined && <ArtistLinks artistIds={artistId} />}

      {albumId !== undefined && <AlbumLink albumId={albumId} />}

      <M.OptionItemWrapper>
        <M.OptionItemButton $borderSide="top" onClick={saveTrack}>
          {isSaved
            ? `Remove from your liked songs`
            : `Save to your liked songs`}
        </M.OptionItemButton>
      </M.OptionItemWrapper>

      {isPlaylistOwner && (
        <M.OptionItemWrapper>
          <M.OptionItemButton>Remove from this playlist</M.OptionItemButton>
        </M.OptionItemWrapper>
      )}

      <PlaylistOptions />
    </M.OptionsList>
  );
};

const GenreMenu = (props: GenreMenuProps) => {
  const { track, isSaved, artistId, albumId } = props;
  const saveTrack = useSaveGenreTrack({ track, isSaved });

  return (
    <M.OptionsList>
      <M.OptionItemWrapper>
        <M.OptionItemButton $borderSide="bottom">
          Add to queue
        </M.OptionItemButton>
      </M.OptionItemWrapper>

      {artistId !== undefined && <ArtistLinks artistIds={artistId} />}

      {albumId !== undefined && <AlbumLink albumId={albumId} />}

      <M.OptionItemWrapper>
        <M.OptionItemButton $borderSide="top" onClick={saveTrack}>
          {isSaved
            ? `Remove from your liked songs`
            : `Save to your liked songs`}
        </M.OptionItemButton>
      </M.OptionItemWrapper>

      <PlaylistOptions />
    </M.OptionsList>
  );
};

const UserTopMenu = (props: UserTopMenuProps) => {
  const { track, isSaved, timeRange, artistId, albumId } = props;
  const saveTrack = useSaveUserTopTrack({ track, isSaved, timeRange });

  return (
    <M.OptionsList>
      <M.OptionItemWrapper>
        <M.OptionItemButton $borderSide="bottom">
          Add to queue
        </M.OptionItemButton>
      </M.OptionItemWrapper>

      {artistId !== undefined && <ArtistLinks artistIds={artistId} />}

      {albumId !== undefined && <AlbumLink albumId={albumId} />}

      <M.OptionItemWrapper>
        <M.OptionItemButton $borderSide="top" onClick={saveTrack}>
          {isSaved
            ? `Remove from your liked songs`
            : `Save to your liked songs`}
        </M.OptionItemButton>
      </M.OptionItemWrapper>

      <PlaylistOptions />
    </M.OptionsList>
  );
};

export default TrackMenu;
