import React from "react";
import styled from "styled-components";
import { RiHeart3Line, RiHeart3Fill } from "react-icons/ri";

interface Props {
  handleClick: () => void;
  isSaved: boolean;
}

const LikeButton = (props: Props) => {
  return (
    <Button $isSaved={props.isSaved} onClick={() => props.handleClick()}>
      {props.isSaved ? <RiHeart3Fill /> : <RiHeart3Line />}
    </Button>
  );
};

export const Button = styled.button<{ $isSaved: boolean }>`
  display: ${({ $isSaved }) => ($isSaved ? "block" : "none")};
  color: ${({ $isSaved }) => ($isSaved ? "mediumaquamarine" : "currentColor")};
  background-color: transparent;
  border: 0;
  padding: 8px;
  margin-left: 8px;
  margin-right: 8px;
  cursor: pointer;

  :hover {
    display: block;
  }
`;

export default LikeButton;
