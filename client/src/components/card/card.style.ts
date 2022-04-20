import styled from "styled-components";
import { Link } from "react-router-dom";
import { textOverflow } from "../../styles/utils";
import { PlayCardIcon } from "../Play/PlayCard";

export const CardLink = styled(Link)`
  :hover,
  :focus,
  :active {
    text-decoration: none;
  }
`;

export const CardWrapper = styled.div<{ $isLikedSongs?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: ${({ $isLikedSongs }) =>
    $isLikedSongs ? "flex-end" : "flex-start"};
  height: 100%;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s cubic-bezier(0.47, 0, 0.745, 0.715);
  grid-column: ${({ $isLikedSongs }) => ($isLikedSongs ? "1 / 3" : "")};
  background-color: ${({ theme }) => theme.bg.card};
  background: ${({ theme, $isLikedSongs }) =>
    $isLikedSongs ? theme.bg.liked_songs : theme.bg.card};

  &:hover {
    cursor: pointer;
    background-color: #272c33;
  }

  :hover ${PlayCardIcon} {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const CardHeader = styled.div`
  position: relative;
  ${textOverflow(3)}
`;

export const CardCover = styled.img<{
  $isArtist?: boolean;
  $overflow?: boolean;
}>`
  aspect-ratio: 1 / 1;
  width: 100%;
  max-width: 10rem;
  min-width: ${({ $overflow }) =>
    $overflow && `calc(var(--column-width) - 32px)`};
  object-fit: cover;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  border-radius: ${({ $isArtist }) => ($isArtist ? "50%" : null)};
`;

export const CardCoverPlaceholder = styled.div<{ $overflow?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.bg.main};
  color: ${({ theme }) => theme.font.title};
  font-weight: 700;
  font-size: 64px;
  aspect-ratio: 1 / 1;
  width: 100%;
  min-width: ${({ $overflow }) =>
    $overflow && `calc(var(--column-width) - 32px)`};
  object-fit: cover;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
`;

export const CardTitle = styled(Link)`
  margin-top: 16px;
  font-weight: 700;
  font-size: 14px;
  width: fit-content;
  ${textOverflow(1)};
`;

export const CardDescription = styled.small`
  color: ${({ theme }) => theme.font.text};
  ${textOverflow(2)};

  a {
    color: currentColor;
  }
`;

export const CardArtistLink = styled(Link)`
  color: ${({ theme }) => theme.font.text};
  font-size: 14px;
  width: fit-content;
  ${textOverflow(1)};
`;

export const LikedSongsContentWrapper = styled.span`
  width: fit-content;
  color: ${({ theme }) => theme.colors.white};

  &:not(:first-child)::before {
    content: "\\2022";
    margin: 0 8px;
    height: 1rem;
    width: 1rem;
  }
`;

export const LikedSongsArtist = styled.span`
  color: ${({ theme }) => theme.colors.white};
`;

export const LikedSongsName = styled.span`
  opacity: 0.6;
`;

export const LikedSongsInfo = styled.div`
  position: relative;
`;

export const LikedSongsTitle = styled(CardTitle)`
  font-size: 1.75rem;
`;

export const LikedSongsDescription = styled(CardDescription)`
  color: ${({ theme }) => theme.colors.white};
`;
