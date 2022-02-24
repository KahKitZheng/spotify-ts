import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { textOverflow } from "../../styles/utils";
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { RootState } from "../../app/store";
import { useSelector } from "react-redux";
import { formatDuration, stringToHSL } from "../../utils";
import {
  countPlaylistDuration,
  getPlaylistWithOffset,
} from "../../slices/playlistSlice";
import {
  getPlaylist,
  selectPlaylist,
  selectPlaylistDuration,
} from "../../slices/playlistSlice";

const PlaylistPage = () => {
  const { id } = useParams();
  const [gradient, setGradient] = useState("");

  const dispatch = useAppDispatch();
  const playlist = useAppSelector(selectPlaylist);
  const playlistDuration = useAppSelector(selectPlaylistDuration);

  const offsetStatus = useSelector(
    (state: RootState) => state.playlist.offsetStatus
  );

  // Fetch playlist for initial render
  useEffect(() => {
    if (id) {
      dispatch(getPlaylist({ playlist_id: id }));
    }
  }, [dispatch, id]);

  // Fetch again if the tracklist is incomplete
  useEffect(() => {
    // Check if the tracklist is empty and can fetch batch of tracks to prevent spamming calls
    if (playlist.tracks?.items.length > 0 && playlist.tracks?.next !== null) {
      dispatch(countPlaylistDuration());

      // Making sure that only one request is dispatch to the API
      if (offsetStatus === "idle") {
        dispatch(getPlaylistWithOffset({ url: playlist.tracks?.next }));
      }
    }
  }, [
    dispatch,
    offsetStatus,
    playlist.tracks?.items.length,
    playlist.tracks?.next,
  ]);

  useEffect(() => {
    if (playlist.name) {
      setGradient(stringToHSL(playlist.name));
    }
  }, [playlist.name]);

  return (
    <div>
      <PlaylistHeader $bgGradient={gradient}>
        <PlaylistCover src={playlist.images && playlist.images[0].url} alt="" />
        <PlaylistOwner>
          By <span>{playlist.owner?.display_name}</span>
        </PlaylistOwner>
        <PlaylistName>{playlist.name?.split("/").join("/ ")}</PlaylistName>
        {playlist.description && (
          <PlaylistDescription
            dangerouslySetInnerHTML={{ __html: playlist.description }}
          />
        )}
        <PlaylistStats>
          {playlist.followers?.total.toLocaleString()} likes
          <Bull> &bull; </Bull>
          {playlist.tracks?.total} songs,{" "}
          {formatDuration(playlistDuration, "long")}
        </PlaylistStats>
      </PlaylistHeader>
      <TracklistWrapper>
        {playlist.tracks?.items.map((item, index) => {
          return "track" in item.track ? (
            <Track key={item.track.id + "-" + index}>
              <AlbumCover src={item.track.album?.images[0].url} alt="" />
              <TrackInfo>
                <TrackName>{item.track.name}</TrackName>
                <TrackArtists>
                  {item.track.explicit && <Explicit>E</Explicit>}
                  {item.track.artists.map((artist, i, arr) => (
                    <>
                      <a href="#" key={artist.id}>
                        {artist.name}
                      </a>
                      <span>{i !== arr.length - 1 ? ", " : ""}</span>
                    </>
                  ))}
                </TrackArtists>
              </TrackInfo>
            </Track>
          ) : null;
        })}
      </TracklistWrapper>
    </div>
  );
};

const PlaylistHeader = styled.div<{ $bgGradient: string }>`
  margin: -16px;
  padding: 16px;
  background: ${({ theme }) => theme.bg.main};
  background: ${({ theme, $bgGradient }) =>
    `linear-gradient(180deg, ${$bgGradient}, ${theme.bg.main} 90%)`};
`;

const PlaylistCover = styled.img`
  height: 160px;
  width: 160px;
  margin: 24px auto 32px;
  box-shadow: 0 0 32px rgba(0, 0, 0, 0.5);
`;

const PlaylistOwner = styled.p`
  font-size: 14px;

  span {
    font-weight: 600;
  }
`;

const PlaylistName = styled.h1`
  font-size: 22px;
  line-height: 1.2;
  margin-top: 4px;
`;

const PlaylistDescription = styled.p`
  font-size: 14px;
  margin-top: 8px;
  margin-bottom: 4px;
  opacity: 0.8;
`;

const PlaylistStats = styled.small`
  opacity: 0.8;
`;

const Bull = styled.span`
  margin-left: 4px;
  margin-right: 4px;
`;

const TracklistWrapper = styled.div`
  margin-top: 32px;
`;

const Track = styled.div`
  display: flex;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 16px;
`;
const AlbumCover = styled.img`
  aspect-ratio: 1 / 1;
  height: 48px;
  width: 48px;
  object-fit: cover;
`;

const TrackInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 16px;
`;

const TrackName = styled.p`
  color: ${({ theme }) => theme.font.title};
  ${textOverflow(1)};
`;

const TrackArtists = styled.p`
  line-height: 1.3;
  ${textOverflow(1)};

  a {
    color: #979da4;
  }
`;

const Explicit = styled.span`
  border-radius: 2px;
  background-color: #979da4;
  color: ${({ theme }) => theme.bg.main};
  font-weight: 600;
  font-size: 11px;
  display: inline-block;
  transform: translateY(-2px);
  margin-right: 6px;
  padding: 0 4px;
`;

export default PlaylistPage;
