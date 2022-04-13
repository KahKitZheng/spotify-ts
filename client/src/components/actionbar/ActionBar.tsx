import React from "react";
import styled from "styled-components";
import { MEDIA } from "../../styles/media";
import { IoIosPlay, IoIosPause } from "react-icons/io";
import { RiHeart3Line, RiHeart3Fill } from "react-icons/ri";
import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import * as playerSlice from "../../slices/playerSlice";

interface Props {
  uri: string;
  isSaved: boolean;
  isPlaylistOwner?: boolean;
  handleClick: () => void;
}

const ActionBar = (props: Props) => {
  const location = useLocation();

  const dispatch = useAppDispatch();
  const playback = useAppSelector(playerSlice.selectPlayback);
  const isPlayerPlaying = playback.is_playing;

  const handlePlayTrack = () => {
    if (props.uri === playback.context?.uri) {
      if (isPlayerPlaying) {
        dispatch(playerSlice.pausePlayback());
      } else {
        dispatch(playerSlice.startPlayback());
      }
    } else {
      dispatch(playerSlice.startPlayback({ context_uri: props.uri }));
    }
  };

  return (
    <ActionBarWrapper>
      <ButtonGroup>
        {location.pathname.slice(1, 7) === "artist" ? (
          <FollowButton>following</FollowButton>
        ) : (
          <SaveButton
            $isSaved={props.isSaved}
            onClick={() => props.handleClick()}
          >
            <span>{props.isSaved ? <RiHeart3Fill /> : <RiHeart3Line />}</span>
          </SaveButton>
        )}
      </ButtonGroup>
      <PlayButton onClick={handlePlayTrack}>
        {isPlayerPlaying ? (
          <IoIosPause />
        ) : (
          <span>
            <IoIosPlay />
          </span>
        )}
      </PlayButton>
    </ActionBarWrapper>
  );
};

const ActionBarWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;

  @media (min-width: ${MEDIA.tablet}) {
    flex-direction: row-reverse;
    justify-content: start;
    margin-top: 24px;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  border: 0;
`;

const PlayButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1ed760;
  color: black;
  border: 0;
  border-radius: 50%;
  padding: 10px;

  :hover {
    background-color: #23e266;
  }

  span {
    display: block;
    transform: translateX(2px);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;

  @media (min-width: ${MEDIA.tablet}) {
    margin-left: 20px;
  }
`;

const FollowButton = styled.button`
  background-color: transparent;
  color: ${({ theme }) => theme.font.text};
  border: 1px solid currentColor;
  border-radius: 4px;
  font-weight: 600;
  padding: 4px 12px;
  margin-right: 16px;

  :hover {
    color: ${({ theme }) => theme.colors.white};
  }
`;

const SaveButton = styled(Button)<{ $isSaved: boolean }>`
  background-color: transparent;
  color: ${({ $isSaved, theme }) =>
    $isSaved ? theme.colors.spotify : "currentColor"};
  margin-right: 16px;
  padding: 0;

  span {
    display: block;
    transform: translateY(2px);
  }
`;

export default ActionBar;
