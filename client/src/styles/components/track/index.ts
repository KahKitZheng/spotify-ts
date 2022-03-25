import styled from "styled-components";
import { MEDIA } from "../../media";
import { textOverflow } from "../../utils";
import { StyledLikeButton } from "../../../components/button";

// Containers for collection of tracks
export const TrackDisc = styled.div`
  margin-top: 16px;

  :not(:first-of-type) {
    margin-top: 48px;
  }
`;

export const TrackList = styled.div`
  display: grid;
  grid-template-columns: auto;
  gap: 16px;
  margin-top: 20px;
`;

/**
 * Track layout variants
 */
export const Track = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 10fr 80px;
  grid-template-areas: "track-info track-duration";
  grid-gap: 16px;
  margin: -8px;
  padding: 8px;

  :last-of-type {
    margin-bottom: 0;
  }

  :hover {
    background-color: #1a1c25;
  }

  :hover ${StyledLikeButton} {
    display: block;
  }
`;

export const OrderedTrack = styled(Track)`
  @media (min-width: ${MEDIA.mobile}) {
    grid-template-columns: 24px 10fr 80px;
    grid-template-areas: "track-index track-info track-duration";
  }
`;

export const TrackDiscInfo = styled(Track)`
  grid-template-columns: 24px 80px;
  grid-template-areas: "disc-icon disc-number";
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
    grid-template-columns: 24px 6fr 4fr 80px;
    grid-template-areas: "track-index track-info track-album track-duration";
  }

  @media (min-width: ${MEDIA.laptop}) {
    grid-template-columns: 24px 6fr 4fr 3fr 80px;
    grid-template-areas: "track-index track-info track-album track-date-added track-duration";
  }
`;

export const PlaylistAddTrack = styled(Track)`
  grid-template-columns: 1fr 160px;
  grid-template-areas: "track-info track-duration";

  @media (min-width: ${MEDIA.laptop}) {
    grid-template-columns: 6fr 4fr 160px;
    grid-template-areas: "track-info add-playlist-track-album track-duration";
  }
`;

export const TopTrack = styled(OrderedTrack)`
  @media (min-width: ${MEDIA.tablet}) {
    grid-template-columns: 24px 6fr 4fr 80px;
    grid-template-areas: "track-index track-info track-album track-duration";
  }
`;

/**
 * Track Sections
 */
export const TrackIndex = styled.span`
  display: none;

  @media (min-width: ${MEDIA.mobile}) {
    display: revert;
    grid-area: track-index;
    text-align: right;
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
  grid-area: add-playlist-track-album;

  @media (max-width: ${MEDIA.laptop}) {
    display: none;
  }
`;

export const TrackDateAdded = styled.span`
  grid-area: track-date-added;
  font-size: 14px;
  padding-left: 48px;

  @media (max-width: ${MEDIA.laptop}) {
    display: none;
  }
`;

export const TrackDuration = styled.div`
  grid-area: track-duration;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 14px;
  padding-right: 8px;
`;

/**
 * Track parts
 */
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

export const TrackName = styled.p`
  color: ${({ theme }) => theme.font.title};
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

export const AddTrackToPlaylist = styled.button`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.font.text};
  border-radius: 16px;
  margin-left: 32px;
  padding: 4px 24px;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.1s ease-in;

  &:hover {
    transform: scale(1.1);
  }
`;
