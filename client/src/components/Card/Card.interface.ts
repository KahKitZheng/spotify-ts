import { NavigateFunction } from "react-router-dom";
import * as SpotifyObjects from "@/types/SpotifyObjects";

interface RecentlyPLayedBase {
  item: SpotifyObjects.PlayHistory;
  overflow?: boolean;
}

interface ArtistBase {
  item: SpotifyObjects.Artist;
  overflow?: boolean;
}

interface TrackBase {
  item: SpotifyObjects.Track;
  overflow?: boolean;
}

interface PlaylistBase {
  item: SpotifyObjects.SimplifiedPlaylist;
  overflow?: boolean;
}

interface AlbumBase {
  item: SpotifyObjects.SimplifiedAlbum;
  overflow?: boolean;
}

interface AlbumSavedBase {
  item: SpotifyObjects.SavedAlbum;
  overflow?: boolean;
}

interface AlbumDiscographyBase {
  item: SpotifyObjects.SimplifiedAlbum;
  overflow?: boolean;
}

interface RecentTracksVariant extends RecentlyPLayedBase {
  variant: "recent-tracks";
}

interface ArtistVariant extends ArtistBase {
  variant: "artist";
}

interface TrackVariant extends TrackBase {
  variant: "track";
}

interface PlaylistVariant extends PlaylistBase {
  variant: "playlist";
}

interface AlbumVariant extends AlbumBase {
  variant: "album";
}

interface AlbumSavedVariant extends AlbumSavedBase {
  variant: "album-saved";
}

interface AlbumDiscographyVariant extends AlbumDiscographyBase {
  variant: "album-discography";
}

export type CardProps =
  | RecentTracksVariant
  | ArtistVariant
  | TrackVariant
  | PlaylistVariant
  | AlbumVariant
  | AlbumSavedVariant
  | AlbumDiscographyVariant;

export interface RecentTracksCardProps extends RecentlyPLayedBase {
  to: NavigateFunction;
}

export interface ArtistCardProps extends ArtistBase {
  to: NavigateFunction;
}

export interface TrackCardProps extends TrackBase {
  to: NavigateFunction;
}

export interface PlaylistCardProps extends PlaylistBase {
  to: NavigateFunction;
}

export interface AlbumCardProps extends AlbumBase {
  to: NavigateFunction;
}

export interface AlbumSavedCardProps extends AlbumSavedBase {
  to: NavigateFunction;
}

export interface AlbumDiscographyCardProps extends AlbumDiscographyBase {
  to: NavigateFunction;
}
