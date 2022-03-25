import styled, { css } from "styled-components";
import { MEDIA } from "../../media";

export const HeaderWrapper = styled.div<{ $bgGradient: string }>`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: -16px;
  padding: 32px 16px 16px;
  background: ${({ theme }) => theme.bg.main};
  background: ${({ theme, $bgGradient }) =>
    `linear-gradient(180deg, ${$bgGradient}, ${theme.bg.main} 90%)`};

  @media (min-width: ${MEDIA.tablet}) {
    flex-direction: row;
    align-items: end;
    justify-content: start;
  }
`;

const ThumbnailBase = css`
  height: 160px;
  width: 160px;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 32px;
  box-shadow: 0 0 32px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease-in-out;

  @media (min-width: ${MEDIA.tablet}) {
    height: 200px;
    width: 200px;
    margin-left: revert;
    margin-right: 24px;
    margin-bottom: 0;
  }
`;

export const Thumbnail = styled.img<{ $isOwner?: boolean }>`
  ${ThumbnailBase}

  :hover {
    cursor: ${({ $isOwner }) => $isOwner && "pointer"};
  }
`;

export const ThumbnailPlaceholder = styled.span<{ $isOwner?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.bg.card_thumbnail_placeholder};
  color: ${({ theme }) => theme.font.title};
  font-weight: 700;
  font-size: 82px;
  ${ThumbnailBase};

  :hover {
    cursor: ${({ $isOwner }) => $isOwner && "pointer"};
  }
`;

export const HeaderExtraInfo = styled.span`
  display: block;
  font-size: 14px;
  color: #e7e7e7;
`;

export const HeaderName = styled.h1<{ $isOwner?: boolean }>`
  font-size: clamp(22px, 1rem + 2vw, 3rem);
  line-height: 1.2;

  :hover {
    cursor: ${({ $isOwner }) => $isOwner && "pointer"};
  }
`;

export const HeaderStats = styled.p`
  font-size: 14px;
  margin-top: 4px;
  color: #e7e7e7;
`;
