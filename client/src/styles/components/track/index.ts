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
  color: #979da4;
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
    color: #979da4;
  }
`;

export const ExplicitTrack = styled.span`
  border-radius: 2px;
  background-color: #979da4;
  color: ${({ theme }) => theme.bg.main};
  font-weight: 600;
  font-size: 11px;
  display: inline-block;
  transform: translateY(-2px);
  margin-right: 6px;
  padding: 0 4px;
`;
