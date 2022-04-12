import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { IoIosPlay, IoIosPause } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectPlayback, startPlayback } from "../../slices/playerSlice";

interface Props {
  variant: "track" | "artist" | "album" | "playlist";
  id: string;
}

type MouseEventType = React.MouseEvent<HTMLButtonElement, MouseEvent>;

const PlayCard = ({ variant, id }: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const dispatch = useAppDispatch();
  const playback = useAppSelector(selectPlayback);
  const isPlayerPlaying = playback.is_playing;
  const currentTrackId = playback.item?.id;
  const cardItemId = id.slice(-22);

  useEffect(() => {
    if (isPlayerPlaying && cardItemId === currentTrackId) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [cardItemId, currentTrackId, isPlayerPlaying]);

  const handlePlayTrack = (event: MouseEventType) => {
    event.stopPropagation();

    switch (variant) {
      case "track":
        dispatch(startPlayback({ uris: [id] }));
        break;
      case "artist":
        dispatch(startPlayback({ context_uri: `spotify:artist:${id}` }));
        break;
      case "album":
        dispatch(startPlayback({ context_uri: `spotify:album:${id}` }));
        break;
      case "playlist":
        dispatch(startPlayback({ context_uri: `spotify:playlist:${id}` }));
        break;
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
