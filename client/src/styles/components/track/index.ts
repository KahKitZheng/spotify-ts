import styled from "styled-components";
import { textOverflow } from "../../utils";

export const TrackList = styled.div`
  margin-top: 20px;
`;

export const Track = styled.div`
  display: grid;
  grid-template-columns: 20px 9fr 1fr;
  grid-template-areas: "track-index track-info track-duration";
  grid-gap: 16px;
  width: 100%;
  margin-bottom: 16px;

  :last-of-type {
    margin-bottom: 0;
  }

  @media (min-width: 876px) {
    grid-template-columns: 20px 6fr 4fr 2fr 100px;
    grid-template-areas: "track-index track-info track-album track-date-added track-duration";
  }
`;

export const TrackAlbum = styled.div`
  display: flex;
  align-items: center;
  grid-area: track-album;
  font-size: 14px;
  padding-right: 64px;

  a {
    ${textOverflow(1)};
  }

  @media (max-width: 876px) {
    display: none;
  }
`;

export const TrackDateAdded = styled.span`
  display: flex;
  align-items: center;
  grid-area: track-date-added;
  font-size: 14px;

  @media (max-width: 876px) {
    display: none;
  }
`;

export const TrackIndex = styled.span`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  grid-area: track-index;
  width: 32px;
  padding-left: 8px;
  padding-right: 12px;
  font-size: 14px;
`;

export const TrackInfo = styled.div`
  display: flex;
  align-items: center;
  grid-area: track-info;
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

export const TrackDuration = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  grid-area: track-duration;
  font-size: 14px;
  padding-right: 8px;

  @media (max-width: 500px) {
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
  z-index: -1;
`;
