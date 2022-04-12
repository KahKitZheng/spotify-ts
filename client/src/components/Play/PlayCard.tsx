import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { IoIosPlay, IoIosPause } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectPlayback, startPlayback } from "../../slices/playerSlice";

interface Props {
  variant: "track" | "artist" | "album" | "playlist";
  uri: string;
}

type MouseEventType = React.MouseEvent<HTMLButtonElement, MouseEvent>;

const PlayCard = ({ variant, uri }: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const dispatch = useAppDispatch();
  const playback = useAppSelector(selectPlayback);
  const isPlayerPlaying = playback.is_playing;

  const checkVariantUri = useCallback(() => {
    if (variant === "track") {
      return isPlayerPlaying && uri === playback.item?.uri;
    } else {
      return isPlayerPlaying && uri === playback.context?.uri;
    }
  }, [
    isPlayerPlaying,
    playback.context?.uri,
    playback.item?.uri,
    uri,
    variant,
  ]);

  useEffect(() => {
    checkVariantUri() ? setIsPlaying(true) : setIsPlaying(false);
  }, [checkVariantUri]);

  const handlePlayTrack = (event: MouseEventType) => {
    event.stopPropagation();

    if (variant === "track") {
      dispatch(startPlayback({ uris: [uri] }));
    } else {
      dispatch(startPlayback({ context_uri: uri }));
    }
  };

  return (
    <PlayCardIcon $isPlaying={isPlaying} onClick={(e) => handlePlayTrack(e)}>
      {isPlaying ? (
        <IoIosPause />
      ) : (
        <div>
          <IoIosPlay />
        </div>
      )}
    </PlayCardIcon>
  );
};

export const PlayCardIcon = styled.button<{ $isPlaying: boolean }>`
  background-color: #1ed760;
  color: black;
  font-size: 26px;
  border-radius: 50%;
  border: 0;
  box-shadow: 0 8px 8px rgba(0, 0, 0, 0.3);
  opacity: ${({ $isPlaying }) => ($isPlaying ? 1 : 0)};
  position: absolute;
  bottom: 8px;
  right: 8px;
  padding: 10px;
  transform: ${({ $isPlaying }) => ($isPlaying ? "0" : "8px")};
  transition: transform 0.3s ease, opacity 0.3s ease;

  div {
    transform: translateX(1px);
  }

  :hover {
    background-color: #1fdf62;
  }
`;

export default PlayCard;
