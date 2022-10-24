import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import { MEDIA } from "../../styles/media";
import { IoIosPlay, IoIosPause } from "react-icons/io";
import { RiHeart3Line, RiHeart3Fill } from "react-icons/ri";
import { useLocation } from "react-router-dom";
import { selectPlayback } from "../../slices/playerSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import * as playerSlice from "../../slices/playerSlice";

interface Props {
  uri: string;
  isSaved?: boolean;
  isPlaylistOwner?: boolean;
  handleClick?: () => void;
}

const ActionBar = ({ uri, isSaved, handleClick }: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const location = useLocation();
  const dispatch = useAppDispatch();
  const playback = useAppSelector(selectPlayback);
  const isPlayerPlaying = playback.is_playing;

  const checkIsPlaying = useCallback(() => {
    return isPlayerPlaying && uri === playback.context?.uri;
  }, [isPlayerPlaying, playback.context?.uri, uri]);

  useEffect(() => {
    checkIsPlaying() ? setIsPlaying(true) : setIsPlaying(false);
  }, [checkIsPlaying]);

  const handlePlayTrack = () => {
    if (uri === playback.context?.uri) {
      isPlayerPlaying
        ? dispatch(playerSlice.pausePlayback())
        : dispatch(playerSlice.startPlayback());
    } else {
      dispatch(playerSlice.startPlayback({ context_uri: uri }));
    }
  };

  return (
    <ActionBarWrapper>
      <PlayButton onClick={handlePlayTrack}>
        {isPlaying ? (
          <IoIosPause />
        ) : (
          <span>
            <IoIosPlay />
          </span>
        )}
      </PlayButton>
      <div>
        {isSaved !== undefined ? (
          location.pathname.slice(1, 7) === "artist" ? (
            <SaveButton
              $isSaved={isSaved}
              onClick={() => (handleClick !== undefined ? handleClick() : {})}
            >
              <FollowButton>{isSaved ? "following" : "follow"}</FollowButton>
            </SaveButton>
          ) : (
            <SaveButton
              $isSaved={isSaved}
              onClick={() => (handleClick !== undefined ? handleClick() : {})}
            >
              <span>{isSaved ? <RiHeart3Fill /> : <RiHeart3Line />}</span>
            </SaveButton>
          )
        ) : null}
      </div>
    </ActionBarWrapper>
  );
};

const ActionBarWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 16px;

  @media (min-width: ${MEDIA.tablet}) {
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
  margin-right: 16px;
  padding: 10px;

  :hover {
    background-color: #23e266;
  }

  span {
    display: block;
    transform: translateX(2px);
  }
`;

const FollowButton = styled.button`
  background-color: transparent;
  color: ${({ theme }) => theme.font.text};
  border: 1px solid currentColor;
  border-radius: 4px;
  font-weight: 600;
  font-size: 16px;
  padding: 4px 12px;

  :hover {
    color: ${({ theme }) => theme.colors.white};
  }
`;

const SaveButton = styled(Button)<{ $isSaved: boolean }>`
  background-color: transparent;
  color: ${({ $isSaved, theme }) =>
    $isSaved ? theme.colors.spotify : "currentColor"};
  padding: 0;

  span {
    display: block;
    transform: translateY(2px);
  }
`;

export default ActionBar;
