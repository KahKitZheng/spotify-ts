import React from "react";
import styled, { css } from "styled-components";
import { MEDIA } from "../../styles/media";
import { IoIosPlay } from "react-icons/io";
import { usePlayingTrack } from "../../hooks/usePlayingTrack";

interface Props {
  uri: string;
  handlePlay: () => void;
  $insideAlbum?: boolean;
}

const PlayTrack = ({ uri, handlePlay, $insideAlbum }: Props) => {
  const [isCurrentTrack, isCurrentTrackPlaying] = usePlayingTrack(uri);

  return (
    <PlayTrackIcon
      $isPlaying={isCurrentTrackPlaying}
      onClick={handlePlay}
      $insideAlbum={$insideAlbum}
    >
      {isCurrentTrackPlaying ? (
        <TrackPlaying
          src="https://open.spotifycdn.com/cdn/images/equaliser-animated-green.f93a2ef4.gif"
          alt=""
        />
      ) : (
        <PlayIconWrapper>
          <IoIosPlay />
        </PlayIconWrapper>
      )}
    </PlayTrackIcon>
  );
};

const InsideAlbumPlaying = css`
  position: absolute;
  top: 16px;
  left: 16px;
  font-size: 24px;
`;

const InsideAlbumHovering = css`
  position: absolute;
  top: 12px;
  left: 12px;
  font-size: 24px;
`;

export const PlayTrackIcon = styled.button<{
  $isPlaying: boolean;
  $insideAlbum?: boolean;
}>`
  opacity: ${({ $isPlaying }) => ($isPlaying ? 1 : 0)};
  background-color: transparent;
  color: currentColor;
  border: 0;
  padding: 0;
  width: 100%;
  position: absolute;
  top: 2px;
  right: 0;
  ${({ $insideAlbum, $isPlaying }) =>
    $insideAlbum
      ? $isPlaying
        ? InsideAlbumPlaying
        : InsideAlbumHovering
      : ""};

  @media (max-width: ${MEDIA.tablet}) {
    display: ${({ $isPlaying }) => ($isPlaying ? "block" : "none")};
  }
`;

const PlayIconWrapper = styled.div`
  transform: translateX(1px);
`;

const TrackPlaying = styled.img`
  object-position: center;
  object-fit: cover;
  transform: scale(0.8);
  height: 16px;
  width: 16px;
`;

export default PlayTrack;
