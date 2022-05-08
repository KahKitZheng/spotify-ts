import styled from "styled-components";
import { MEDIA } from "../../styles/media";
import { TrackSave } from "./TrackSaveButton";
import { TrackOptionsWrapper } from "../TrackMenu/TrackMenu.style";
import { textOverflow } from "../../styles/utils";
import { PlayTrackIcon } from "../Play/PlayTrack";

/////////////////////////////////////////
// Containers for collection of tracks //
/////////////////////////////////////////
export const TrackDisc = styled.div`
  margin-top: 16px;

  :not(:first-of-type) {
    margin-top: 48px;
  }
`;

export const TrackList = styled.div`
  margin-top: 8px;
`;

/////////////////
// Track parts //
/////////////////
export const TrackIndexNumber = styled.span<{
  $isTrackPlaying: boolean;
  $isPlayerTrack: boolean;
}>`
  position: absolute;
  right: 20px;
  top: 0;
  opacity: ${({ $isTrackPlaying }) => ($isTrackPlaying ? 0 : 1)};
  color: ${({ $isPlayerTrack, theme }) =>
    $isPlayerTrack ? theme.colors.spotify : "currentColor"};
  font-weight: 600;
`;

export const TrackAlbumWrapper = styled.div`
  position: relative;
`;

export const TrackAlbumCover = styled.img<{ $small?: boolean }>`
  aspect-ratio: 1 / 1;
  height: ${({ $small }) => ($small ? "32px" : "48px")};
  width: ${({ $small }) => ($small ? "32px" : "48px")};
  object-fit: cover;
  margin-right: 16px;
`;

export const TrackDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TrackName = styled.p<{ $isPlayerTrack: boolean }>`
  color: ${({ $isPlayerTrack, theme }) =>
    $isPlayerTrack ? theme.colors.spotify : theme.font.title};
  ${textOverflow(1)};
`;

export const TrackArtists = styled.p`
  font-size: 14px;
  line-height: 1.3;
  ${textOverflow(1)};

  a {
    color: ${({ theme }) => theme.font.text};
  }
`;

export const AddPlaylistTrackAlbum = styled.span`
  @media (min-width: ${MEDIA.laptop}) {
    display: none;
  }
`;

export const TrackDuration = styled.span`
  min-width: 44px;
  text-align: right;

  @media (max-width: ${MEDIA.tablet}) {
    display: none;
  }
`;

export const AddTrackToPlaylist = styled.button`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.white};
  border: 1px solid #4d5155;
  border-radius: 16px;
  margin-left: 16px;
  margin-right: 8px;
  padding: 4px 24px;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.1s ease-in;

  &:hover {
    transform: scale(1.1);
  }

  @media (max-width: ${MEDIA.tablet}) {
    padding: 4px;
  }
`;

export const ExplicitTrack = styled.span`
  border-radius: 2px;
  background-color: ${({ theme }) => theme.font.text};
  color: ${({ theme }) => theme.bg.main};
  font-weight: 600;
  font-size: 11px;
  display: inline-block;
  isolation: isolate;
  position: relative;
  width: fit-content;
  top: -1px;
  margin-right: 6px;
  padding: 0 4px;
`;

////////////////////
// Track Sections //
////////////////////
export const TrackIndex = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  grid-area: track-index;
  width: 32px;
  min-width: 32px;
  height: 16px;
  min-height: 16px;
  position: relative;

  @media (max-width: ${MEDIA.tablet}) {
    display: none;
  }
`;

export const TrackInfo = styled.div`
  display: flex;
  align-items: center;
  grid-area: track-info;
`;

export const TrackAlbum = styled.div`
  grid-area: track-album;
  width: fit-content;
  font-size: 14px;

  a {
    ${textOverflow(1)};
  }

  @media (max-width: ${MEDIA.tablet}) {
    display: none;
  }
`;

export const AddPlaylistTrackAlbumSection = styled.div`
  grid-area: playlist-add-track-album;

  @media (max-width: ${MEDIA.laptop}) {
    display: none;
  }
`;

export const TrackDateAdded = styled.span`
  grid-area: playlist-date-added;
  font-size: 14px;
  text-align: right;

  @media (max-width: ${MEDIA.laptop}) {
    display: none;
  }
`;

export const TrackOptions = styled.div`
  grid-area: track-options;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 14px;
`;

///////////////////////////
// Track layout variants //
///////////////////////////
export const Track = styled.div`
  --track-section-index: 16px;
  --track-section-info: 1fr;
  --track-section-album: 120px;
  --track-section-playlist-add-track: 120px;
  --track-section-playlist-date-added: 120px;
  --track-section-options: 120px;

  display: grid;
  align-items: center;
  grid-template-columns: var(--track-section-info) var(--track-section-options);
  grid-template-areas: "track-info track-options";
  grid-gap: 16px;
  margin: 0 calc(var(--layout-padding) * -1);
  padding: 8px 16px;

  :hover {
    background-color: #1a1c25;
  }
  :hover ${TrackOptionsWrapper}, :hover ${TrackSave} {
    visibility: visible;
  }

  :hover ${PlayTrackIcon} {
    opacity: 1;
  }

  :hover ${TrackIndexNumber} {
    opacity: 0;
  }

  @media (min-width: ${MEDIA.tablet}) {
    margin: 0;

    --track-section-info: 6fr;
    --track-section-album: 5fr;
    --track-section-options: 160px;
  }
`;

export const UnOrderedTrack = styled(Track)<{ $isTrackPlaying?: boolean }>`
  ${TrackAlbumCover} {
    opacity: ${({ $isTrackPlaying }) => ($isTrackPlaying ? 0.2 : 1)};
  }

  :hover ${TrackAlbumCover} {
    opacity: 0.2;
  }
`;

export const OrderedTrack = styled(Track)`
  :hover ${TrackIndex} span {
    display: none;
  }

  @media (min-width: ${MEDIA.tablet}) {
    grid-template-columns:
      var(--track-section-index)
      var(--track-section-info)
      var(--track-section-options);
    grid-template-areas: "track-index track-info track-options";
  }
`;

export const TrackDiscInfo = styled(Track)`
  grid-template-columns: var(--track-section-index) var(--track-section-info);
  font-weight: 600;
  font-size: 18px;

  :hover {
    background-color: revert;
  }

  span {
    display: flex;
    justify-content: flex-end;
  }
`;

export const PlaylistTrack = styled(OrderedTrack)`
  @media (min-width: ${MEDIA.tablet}) {
    --track-section-info: 6fr;
    --track-section-album: 5fr;

    grid-template-areas: "track-index track-info track-album track-options";
    grid-template-columns:
      var(--track-section-index)
      var(--track-section-info)
      var(--track-section-album)
      var(--track-section-options);
  }

  @media (min-width: ${MEDIA.laptop}) {
    grid-template-areas: "track-index track-info track-album playlist-date-added track-options";
    grid-template-columns:
      var(--track-section-index)
      var(--track-section-info)
      var(--track-section-album)
      var(--track-section-playlist-date-added)
      var(--track-section-options);
  }
`;

export const PlaylistAddTrack = styled(UnOrderedTrack)`
  grid-template-areas: "track-info track-options";
  grid-template-columns: var(--track-section-info) var(--track-section-options);

  @media (max-width: ${MEDIA.tablet}) {
    ${TrackDuration},
    ${TrackAlbumCover} {
      display: none;
    }
  }

  @media (min-width: ${MEDIA.tablet}) {
    grid-template-areas: "track-info track-options";
    grid-template-columns: var(--track-section-info) var(
        --track-section-options
      );
  }

  @media (min-width: ${MEDIA.laptop}) {
    grid-template-areas: "track-info playlist-add-track-album track-options";
    grid-template-columns:
      var(--track-section-info)
      var(--track-section-playlist-date-added)
      var(--track-section-options);
  }
`;

export const TopTrack = styled(OrderedTrack)`
  @media (min-width: ${MEDIA.tablet}) {
    grid-template-areas: "track-index track-info track-album track-options";
    grid-template-columns:
      var(--track-section-index)
      var(--track-section-info)
      var(--track-section-album)
      var(--track-section-options);
  }
`;
