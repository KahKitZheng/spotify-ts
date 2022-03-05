import styled from "styled-components";
import { textOverflow } from "../../utils";
import { Button } from "../../../components/button";

export const TrackDisc = styled.div`
  margin-top: 2rem;
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
  grid-template-areas: "track-info";
  grid-gap: 16px;
  margin: -8px;
  padding: 8px;

  :last-of-type {
    margin-bottom: 0;
  }

  :hover {
    background-color: #1a1c25;
  }

  :hover ${Button} {
    display: block;
  }

  @media (min-width: 500px) {
    grid-template-columns: 10fr 100px;
    grid-template-areas: "track-info track-duration";
  }
`;

export const TrackDiscInfo = styled(Track)`
  grid-template-columns: 24px 1fr;
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

export const OrderedTrack = styled(Track)`
  @media (min-width: 500px) {
    grid-template-columns: 24px 10fr 100px;
    grid-template-areas: "track-index track-info track-duration";
  }
`;

export const PlaylistTrack = styled(Track)`
  grid-template-columns: 24px 10fr 100px;
  grid-template-areas: "track-index track-info track-duration";

  @media (min-width: 876px) {
    grid-template-columns: 24px 6fr 4fr 2fr 100px;
    grid-template-areas: "track-index track-info track-album track-date-added track-duration";
  }
`;

export const TopTrack = styled(Track)`
  grid-template-columns: 24px 10fr 100px;
  grid-template-areas: "track-index track-info track-duration";

  @media (min-width: 876px) {
    grid-template-columns: 24px 6fr 4fr 100px;
    grid-template-areas: "track-index track-info track-album track-duration";
  }
`;

/**
 * Track Sections
 */
export const TrackIndex = styled.span`
  display: none;

  @media (min-width: 500px) {
    display: revert;
    grid-area: track-index;
    grid-template-columns: 24px 6fr 4fr 2fr 100px;
    grid-template-areas: "track-index track-info track-album track-date-added track-duration";
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

  @media (max-width: 876px) {
    display: none;
  }
`;

export const TrackDateAdded = styled.span`
  grid-area: track-date-added;
  font-size: 14px;
  padding-left: 48px;

  @media (max-width: 876px) {
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

  @media (max-width: 500px) {
    display: none;
  }
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
  font-size: 12px;
  line-height: 1.3;
  ${textOverflow(1)};

  a {
    color: ${({ theme }) => theme.font.text};
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
