import { Fragment, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { textOverflow } from "@/styles/utils";
import { SimplifiedArtist } from "@/types/SpotifyObjects";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  checkCurrentSavedTrack,
  removeSavedCurrentTrack,
  saveCurrentTrack,
  selectCheckCurrentSavedTrack,
  selectCheckCurrentTrack,
  selectPlayback,
} from "@/slices/playerSlice";
import { RiHeart3Fill, RiHeart3Line } from "react-icons/ri";
import { TrackPlaceholder } from "@/assets/placeholders";

const PlayerTrack = () => {
  const dispatch = useAppDispatch();
  const currentTrack = useAppSelector(selectCheckCurrentTrack);
  const isCurrentTrackSaved = useAppSelector(selectCheckCurrentSavedTrack);
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

  const handleSaveTrack = () => {
    if (track === null) return;

    isCurrentTrackSaved.isSaved
      ? dispatch(removeSavedCurrentTrack(track.id))
      : dispatch(saveCurrentTrack(track.id));
  };

  useEffect(() => {
    const playbackTrack = playback.item?.id;

    if (playbackTrack && currentTrack.id !== playbackTrack) {
      dispatch(checkCurrentSavedTrack({ ids: playbackTrack }));
    }
  }, [currentTrack.id, dispatch, playback.item?.id]);

  return track ? (
    <PlayerTrackWrapper>
      {track.album.images.length > 0 ? (
        <PlayerTrackCover
          src={track.album.images[0].url}
          alt=""
          loading="lazy"
        />
      ) : (
        <PlaceholderTrackWrapper>
          <TrackPlaceholder transparent />
        </PlaceholderTrackWrapper>
      )}
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
      <SaveTrack
        onClick={handleSaveTrack}
        $isSaved={isCurrentTrackSaved.isSaved}
      >
        {isCurrentTrackSaved.isSaved ? <RiHeart3Fill /> : <RiHeart3Line />}
      </SaveTrack>
    </PlayerTrackWrapper>
  ) : (
    // Render empty div to prevent player grid-areas from shifting
    <PlayerTrackWrapper>
      <PlaceholderTrackWrapper>
        <TrackPlaceholder transparent />
      </PlaceholderTrackWrapper>
      <TrackInfo>
        <PlayerTrackName to={``}>...</PlayerTrackName>
        <PlayerTrackArtists>....</PlayerTrackArtists>
      </TrackInfo>
    </PlayerTrackWrapper>
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

const PlaceholderTrackWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 54px;
  width: 54px;
  scale: 0.4;
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

const SaveTrack = styled.button<{ $isSaved: boolean }>`
  color: ${({ $isSaved, theme }) =>
    $isSaved ? theme.colors.spotify : "currentColor"};
  background-color: transparent;
  border: 0;
  margin-left: 32px;
  margin-right: 16px;
  font-size: 20px;
  padding: 0;
  cursor: pointer;
  min-width: 23px;
`;

export default PlayerTrack;
