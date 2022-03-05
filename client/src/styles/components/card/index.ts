import styled from "styled-components";
import { Link } from "react-router-dom";
import { textOverflow } from "../../utils";

export const CardLink = styled(Link)`
  :hover,
  :focus,
  :active {
    text-decoration: none;
  }
`;

export const CardWrapper = styled.div`
  height: 100%;
  background-color: #1d1d25;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s cubic-bezier(0.47, 0, 0.745, 0.715);

  &:hover {
    cursor: pointer;
    background-color: #272c33;
  }
`;

export const CardCover = styled.img<{ $isArtist?: boolean }>`
  aspect-ratio: 1 / 1;
  width: 100%;
  min-width: calc(var(--column-width) - 32px);
  object-fit: cover;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  border-radius: ${({ $isArtist }) => $isArtist && "50%"};
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
