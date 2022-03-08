import React, { useState } from "react";
import styled from "styled-components";
import { IoIosPlay, IoIosPause, IoIosMore } from "react-icons/io";
import { RiHeart3Line, RiHeart3Fill } from "react-icons/ri";

interface Props {
  isSaved: boolean;
  handleClick: () => void;
}

const ActionBar = (props: Props) => {
  const [playing, setPlaying] = useState(false);

  return (
    <ActionBarWrapper>
      <ButtonGroup>
        <SaveButton
          $isSaved={props.isSaved}
          onClick={() => props.handleClick()}
        >
          <span>{props.isSaved ? <RiHeart3Fill /> : <RiHeart3Line />}</span>
        </SaveButton>
        <MoreButton onClick={() => console.log("test")}>
          <span>
            <IoIosMore />
          </span>
        </MoreButton>
      </ButtonGroup>
      {playing ? (
        <PlayButton>
          <IoIosPause />
        </PlayButton>
      ) : (
        <PlayButton>
          <span>
            <IoIosPlay />
          </span>
        </PlayButton>
      )}
    </ActionBarWrapper>
  );
};

const ActionBarWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 24px;

  @media (min-width: 768px) {
    flex-direction: row-reverse;
    justify-content: start;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  cursor: pointer;
  border: 0;
`;

const PlayButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1ed760;
  color: black;
  border-radius: 50%;
  padding: 10px;

  span {
    display: block;
    transform: translateX(2px);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: baseline;

  @media (min-width: 768px) {
    margin-left: 20px;
  }
`;

const SaveButton = styled(Button)<{ $isSaved: boolean }>`
  background-color: transparent;
  color: ${({ $isSaved }) => ($isSaved ? "#1ed760" : "currentColor")};
  margin-right: 16px;
  padding: 0;

  span {
    display: block;
    transform: translateY(2px);
  }
`;

const MoreButton = styled(Button)`
  background-color: transparent;
  color: currentColor;
  padding: 0;

  span {
    display: block;
    transform: translateY(2px);
  }
`;

export default ActionBar;
