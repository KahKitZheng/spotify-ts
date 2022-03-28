import React from "react";
import styled from "styled-components";
import { MEDIA } from "../../styles/media";
import { RiHeart3Line, RiHeart3Fill } from "react-icons/ri";

interface Props {
  handleClick: () => void;
  isSaved: boolean;
}

const TrackSaveButton = (props: Props) => {
  const { isSaved, handleClick } = props;

  return (
    <TrackSave $isSaved={isSaved} onClick={() => handleClick()}>
      {isSaved ? <RiHeart3Fill /> : <RiHeart3Line />}
    </TrackSave>
  );
};

export const TrackSave = styled.button<{ $isSaved: boolean }>`
  visibility: visible;
  color: ${({ $isSaved, theme }) => ($isSaved ? theme.colors.spotify : "currentColor")};
  background-color: transparent;
  border: 0;
  padding: 0;
  cursor: pointer;

  @media (min-width: ${MEDIA.tablet}) {
    visibility: ${({ $isSaved }) => ($isSaved ? "visible" : "hidden")};
  }
`;

export default TrackSaveButton;
