import styled from "styled-components";
import { textOverflow } from "../../utils";

export const TracklistWrapper = styled.div`
  margin-top: 20px;
`;

export const Track = styled.div`
  display: flex;
  align-items: center;

  :not(:first-of-type) {
    margin-top: 16px;
  }
`;
export const TrackAlbumCover = styled.img`
  aspect-ratio: 1 / 1;
  height: 48px;
  width: 48px;
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
