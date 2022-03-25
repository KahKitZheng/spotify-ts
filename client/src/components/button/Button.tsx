import React from "react";
import styled from "styled-components";
import { MEDIA } from "../../styles/media";
import { RiHeart3Line, RiHeart3Fill } from "react-icons/ri";

interface Props {
  handleClick: () => void;
  isSaved: boolean;
}

const LikeButton = (props: Props) => {
  const { isSaved, handleClick } = props;

  return (
    <StyledLikeButton $isSaved={isSaved} onClick={() => handleClick()}>
      {isSaved ? <RiHeart3Fill /> : <RiHeart3Line />}
    </StyledLikeButton>
  );
};

export const StyledLikeButton = styled.button<{ $isSaved: boolean }>`
  display: block;
  color: ${({ $isSaved, theme }) =>
    $isSaved ? theme.colors.spotify : "currentColor"};
  background-color: transparent;
  border: 0;
  padding: 8px;
  margin-left: 8px;
  margin-right: 8px;
  cursor: pointer;

  @media (min-width: ${MEDIA.tablet}) {
    display: ${({ $isSaved }) => ($isSaved ? "block" : "none")};

    :hover {
      display: block;
    }
  }
`;

export default LikeButton;
