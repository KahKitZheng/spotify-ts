import React from "react";
import styled from "styled-components";
import { FiHeart } from "react-icons/fi";

interface Props {
  handleClick: () => void;
}

const LikeButton = (props: Props) => {
  return (
    <Button onClick={() => props.handleClick()}>
      <FiHeart />
    </Button>
  );
};

export const Button = styled.button`
  background-color: transparent;
  border: 0;
  color: currentColor;
  padding: 8px;
  margin-left: 8px;
  margin-right: 8px;
  cursor: pointer;
  display: none;

  :hover {
    color: ${({ theme }) => theme.colors.white};
  }
`;

export default LikeButton;
