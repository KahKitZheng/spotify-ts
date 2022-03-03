import styled from "styled-components";
import { textOverflow } from "../../utils";
import { Button } from "../../../components/button";

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
  grid-template-columns: 10fr 100px;
  grid-template-areas: "track-info track-duration";
  grid-gap: 16px;
  width: 100%;
  padding: 8px;
  margin: -8px 0;

  :last-of-type {
    margin-bottom: 0;
  }

  :hover {
    background-color: #1a1c25;
  }

  :hover ${Button} {
    display: block;
  }
`;

export const OrderedTrack = styled(Track)`
  grid-template-columns: 24px 10fr 100px;
  grid-template-areas: "track-index track-info track-duration";
`;

export const PlaylistTrack = styled(Track)`
  grid-template-columns: 24px 10fr 100px;
  grid-template-areas: "track-index track-info track-duration";

  @media (min-width: 876px) {
    grid-template-columns: 24px 6fr 4fr 2fr 100px;
    grid-template-areas: "track-index track-info track-album track-date-added track-duration";
  }
`;

/**
 * Track Sections
 */
export const TrackIndex = styled.span`
  grid-area: track-index;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-left: 8px;
  font-size: 14px;
`;

export const TrackInfo = styled.div`
  display: flex;
  align-items: center;
  grid-area: track-info;
`;

export const TrackAlbum = styled.div`
  grid-area: track-album;
  display: flex;
  align-items: center;
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
  display: flex;
  align-items: center;
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
