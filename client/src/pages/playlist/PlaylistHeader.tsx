import React, { Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import * as H from "../../styles/components/headers";
import { formatDuration } from "../../utils";
import { useAppSelector } from "../../app/hooks";
import { Playlist } from "../../types/SpotifyObjects";
import { selectCurrentUserId } from "../../slices/currentUserSlice";
import { selectPlaylistDuration } from "../../slices/playlistSlice";

interface Props {
  bgGradient: string;
  playlist: Playlist;
  setModal: Dispatch<SetStateAction<boolean>>;
}

const PlaylistHeader = (props: Props) => {
  const { playlist, bgGradient, setModal } = props;

  const userId = useAppSelector(selectCurrentUserId);
  const playlistDuration = useAppSelector(selectPlaylistDuration);

  function handleShowModal() {
    playlist.owner.id === userId ? setModal(true) : setModal(false);
  }

  return (
    <H.HeaderWrapper $bgGradient={bgGradient}>
      {playlist.images[0] === undefined ? (
        <H.ThumbnailPlaceholder $isOwner={playlist.owner.id === userId} onClick={handleShowModal}>
          {playlist.name.slice(0, 1)}
        </H.ThumbnailPlaceholder>
      ) : (
        <H.Thumbnail
          src={playlist.images && playlist.images[0].url}
          onClick={handleShowModal}
          $isOwner={playlist.owner.id === userId}
          alt=""
        />
      )}
      <div>
        <H.HeaderExtraInfo>
          By <PlaylistOwner>{playlist.owner?.display_name}</PlaylistOwner>
        </H.HeaderExtraInfo>
        <H.HeaderName $isOwner={playlist.owner.id === userId} onClick={handleShowModal}>
          {playlist.name?.split("/").join("/ ")}
        </H.HeaderName>
        {playlist.description && (
          <PlaylistDescription dangerouslySetInnerHTML={{ __html: playlist.description }} />
        )}
        <H.HeaderStats>
          {playlist.followers?.total.toLocaleString()} likes
          <span className="bull">&bull;</span>
          {playlist.tracks?.items.length} songs, {formatDuration(playlistDuration, "playlist")}
        </H.HeaderStats>
      </div>
    </H.HeaderWrapper>
  );
};

const PlaylistOwner = styled.span`
  color: ${({ theme }) => theme.font.title};
  font-weight: 600;
`;

const PlaylistDescription = styled.p`
  font-size: 14px;
  margin-top: 8px;
  opacity: 0.8;
  color: #cecece;
`;

export default PlaylistHeader;
