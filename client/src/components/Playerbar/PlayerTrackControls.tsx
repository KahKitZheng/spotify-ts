import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  BiSkipPrevious,
  BiSkipNext,
  BiPlay,
  BiPause,
  BiShuffle,
} from "react-icons/bi";
import { MdRepeat, MdRepeatOne } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  pausePlayback,
  playNextTrack,
  playPreviousTrack,
  seekPosition,
  selectPlayback,
  selectPlaybackRepeat,
  selectPlaybackShuffle,
  setRepeat,
  setShuffle,
  startPlayback,
} from "@/slices/playerSlice";
import { formatDuration } from "../../utils";
import debounce from "lodash.debounce";

const PlayerTrackControls = () => {
  const dispatch = useAppDispatch();
  const playback = useAppSelector(selectPlayback);
  const isPlaying = playback.is_playing;
  const shuffleMode = useAppSelector(selectPlaybackShuffle);
  const repeatMode = useAppSelector(selectPlaybackRepeat);

  const [seeker, setSeeker] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (playback.progress_ms !== null) {
      setSeeker(playback.progress_ms);
    }

    if (playback.item?.duration_ms !== undefined) {
      setDuration(playback.item?.duration_ms);
    }
  }, [playback.item?.duration_ms, playback.progress_ms]);

  useEffect(() => {
    const interval = setInterval(() => {
      isPlaying ? setSeeker(seeker + 1000) : clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, seeker]);

  const setPlayState = () => {
    isPlaying ? dispatch(pausePlayback()) : dispatch(startPlayback());
  };

  const handlePreviousTrack = () => {
    if (seeker > 3000) {
      dispatch(seekPosition({ position_ms: 0 }));
    } else {
      dispatch(playPreviousTrack());
    }
  };

  const handleNextTrack = () => {
    dispatch(playNextTrack());
  };

  const handleShuffleMode = () => {
    dispatch(setShuffle({ shuffleState: !shuffleMode }));
  };

  const handleRepeatMode = () => {
    switch (repeatMode) {
      case 0:
        dispatch(setRepeat({ repeatState: "context" }));
        break;
      case 1:
        dispatch(setRepeat({ repeatState: "track" }));
        break;
      case 2:
        dispatch(setRepeat({ repeatState: "off" }));
        break;
      default:
        dispatch(setRepeat({ repeatState: "off" }));
        break;
    }
  };

  const debounceSeeker = debounce((seeker) => {
    dispatch(seekPosition({ position_ms: seeker }));
  }, 50);

  return (
    <PlayerTrackControlsWrapper>
      <ControlsWrapper>
        <ButtonIcon $active={shuffleMode} onClick={handleShuffleMode}>
          <BiShuffle />
        </ButtonIcon>
        <ButtonIcon $large onClick={handlePreviousTrack}>
          <BiSkipPrevious />
        </ButtonIcon>
        <PlayPauseWrapper $large onClick={setPlayState}>
          {isPlaying ? (
            <BiPause />
          ) : (
            <span>
              <BiPlay />
            </span>
          )}
        </PlayPauseWrapper>
        <ButtonIcon $large onClick={handleNextTrack}>
          <BiSkipNext />
        </ButtonIcon>
        <ButtonIcon
          $active={repeatMode === 1 || repeatMode === 2}
          onClick={handleRepeatMode}
        >
          {repeatMode === 2 ? <MdRepeatOne /> : <MdRepeat />}
        </ButtonIcon>
      </ControlsWrapper>
      <SeekerWrapper>
        <small>{formatDuration(seeker | 0, "track")}</small>
        <TrackProgress
          type="range"
          min={0}
          onChange={(e) => debounceSeeker(+e.target.value)}
          value={seeker | 0}
          max={duration | 0}
        />
        <small>{formatDuration(duration | 0, "track")}</small>
      </SeekerWrapper>
    </PlayerTrackControlsWrapper>
  );
};

const PlayerTrackControlsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const ControlsWrapper = styled.div`
  display: flex;
`;

const ButtonIcon = styled.button<{ $large?: boolean; $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  margin: 0 4px;
  width: fit-content;
  font-size: ${({ $large }) => ($large ? "28px" : "16px")};
  color: ${({ $active, theme }) => ($active ? "#17aa4b" : theme.font.text)};
  background-color: transparent;
  cursor: pointer;

  :hover {
    color: ${({ $active, theme }) =>
      $active ? theme.colors.spotify : theme.colors.white};
  }
`;

const PlayPauseWrapper = styled(ButtonIcon)`
  padding: 2px;
  border-radius: 50%;
  background-color: white;
  color: ${({ theme }) => theme.colors.black};
  transition: transform 0.15s ease-in-out;

  span {
    display: block;
    transform: translateX(2px);
  }

  :hover {
    color: ${({ theme }) => theme.colors.black};
    transform: scale(1.1);
  }
`;

const SeekerWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 530px;
  margin-top: 8px;
`;

const TrackProgress = styled.input.attrs({ type: "range" })`
  margin: 0 8px;
`;

export default PlayerTrackControls;
