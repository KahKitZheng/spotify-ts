import styled from "styled-components";
import { textOverflow } from "../../utils";

export const TrackList = styled.div`
  margin-top: 20px;
`;

export const Track = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;

  :last-of-type {
    margin-bottom: 0;
  }
`;

export const TrackIndex = styled.span`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 32px;
  padding-left: 8px;
  padding-right: 18px;
  font-size: 14px;
`;

export const TrackAlbumCover = styled.img<{ $small?: boolean }>`
  aspect-ratio: 1 / 1;
  height: ${({ $small }) => ($small ? "32px" : "48px")};
  width: ${({ $small }) => ($small ? "32px" : "48px")};
  object-fit: cover;
  margin-right: 16px;
`;

export const TrackInfo = styled.div`
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

export const ExplicitTrack = styled.span`
  border-radius: 2px;
  background-color: ${({ theme }) => theme.font.text};
  color: ${({ theme }) => theme.bg.main};
  font-weight: 600;
  font-size: 11px;
  display: inline-block;
  isolation: isolate;
  z-index: -1;
  position: relative;
  top: -1px;
  margin-right: 6px;
  padding: 0 4px;
`;
