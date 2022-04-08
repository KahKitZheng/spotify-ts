import React, { Fragment } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { textOverflow } from "../../styles/utils";
import { SimplifiedArtist } from "../../types/SpotifyObjects";
import { useAppSelector } from "../../app/hooks";
import { selectPlayback } from "../../slices/playerSlice";

const PlayerTrack = () => {
  const playback = useAppSelector(selectPlayback);
  const track = playback.item;
  const ID_LENGTH = 22;

  const renderArtists = (list: SimplifiedArtist[]) => {
    return list.map((artist, index, arr) => (
      <Fragment key={index}>
        <Link to={`/artist/${artist.uri.slice(artist.uri.length - ID_LENGTH)}`}>
          {artist.name}
        </Link>
        {index !== arr.length - 1 && <span>, </span>}
      </Fragment>
    ));
  };

  return track ? (
    <PlayerTrackWrapper>
      <PlayerTrackCover src={track.album.images[0].url.slice()} alt="" />
      <TrackInfo>
        <PlayerTrackName
          to={`/album/${track.album.uri.slice(
            track.album.uri.length - ID_LENGTH
          )}`}
        >
          {track.name}
        </PlayerTrackName>
        <PlayerTrackArtists>{renderArtists(track.artists)}</PlayerTrackArtists>
      </TrackInfo>
    </PlayerTrackWrapper>
  ) : (
    // Render empty div to prevent player grid-areas from shifting
    <div></div>
  );
};

const PlayerTrackWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const PlayerTrackCover = styled.img`
  aspect-ratio: 1;
  object-fit: cover;
  height: 54px;
  width: 54px;
`;

const TrackInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 16px;
`;

const PlayerTrackName = styled(Link)`
  font-size: 15px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.white};
  ${textOverflow(1)};
`;

const PlayerTrackArtists = styled.div`
  font-size: 12px;
  ${textOverflow(1)};

  a {
    color: ${({ theme }) => theme.font.text};
  }
`;

export default PlayerTrack;
