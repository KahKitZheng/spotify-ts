import React, { Fragment, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import Card from "../../components/Card";
import Track from "../../components/Track";
import ActionBar from "../../components/ActionBar";
import * as H from "../../styles/components/headers";
import * as T from "../../components/Track/Track.style";
import * as S from "../../styles/components/section";
import { BsDisc } from "react-icons/bs";
import { CollectionOverflow } from "../../components/Collection";
import { Link, useParams } from "react-router-dom";
import { extractTrackId, formatDuration, stringToHSL } from "../../utils";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import * as albumSlice from "../../slices/albumSlice";

const AlbumPage = () => {
  const { id } = useParams();
  const [fetchOffset, setFetchOffset] = useState(0);
  const [gradient, setGradient] = useState(`hsl(0, 0%, 40%)`);

  const dispatch = useAppDispatch();
  const album = useAppSelector(albumSlice.selectAlbum);
  const albumStatus = useAppSelector(albumSlice.selectAlbumStatus);
  const albumDuration = useAppSelector(albumSlice.selectAlbumDuration);
  const albumDisc = useAppSelector(albumSlice.selectAlbumDisc);
  const albumDiscography = useAppSelector(albumSlice.selectAlbumDiscography);

  const fetchAlbumInfo = useCallback(() => {
    if (album.id !== id && id !== undefined) {
      dispatch(albumSlice.getAlbum({ id }));
    }
  }, [album.id, dispatch, id]);

  const fetchIsAlbumSaved = useCallback(() => {
    if (albumStatus === "succeeded") {
      dispatch(albumSlice.checkSavedAlbum(album.id));
    }
  }, [album.id, albumStatus, dispatch]);

  const fetchOffsetAlbumTracks = useCallback(() => {
    const albumItems = album.tracks?.items;
    const url = album.tracks?.next;
    const startIndex = fetchOffset;

    if (startIndex >= albumItems?.length && url !== null) {
      dispatch(albumSlice.getOffsetAlbumTracks({ startIndex, url }));
    }
  }, [album.tracks?.items, album.tracks?.next, dispatch, fetchOffset]);

  const fetchSavedAlbumTracks = useCallback(() => {
    const list = album.tracks?.items;
    const incrementBy = 50;
    const startIndex = fetchOffset;
    const endIndex = fetchOffset + incrementBy;

    if (startIndex < list?.length && startIndex < album.tracks?.total) {
      const ids = extractTrackId(list?.slice(startIndex, endIndex));
      dispatch(albumSlice.checkSavedAlbumTracks({ startIndex, ids })).then(() =>
        setFetchOffset(endIndex)
      );
    }
  }, [dispatch, fetchOffset, album.tracks?.items, album.tracks?.total]);

  const fetchRelatedAlbums = useCallback(() => {
    if (album.artists) {
      dispatch(albumSlice.getAlbumDiscography({ id: album.artists[0].id }));
    }
  }, [album.artists, dispatch]);

  const setAlbumDuration = useCallback(() => {
    if (album.tracks?.next === null) {
      dispatch(albumSlice.countAlbumDuration());
    }
  }, [album.tracks?.next, dispatch]);

  const setBgGradient = useCallback(() => {
    album.tracks?.items.length > 0
      ? setGradient(stringToHSL(album.name))
      : setGradient(`hsl(0, 0%, 40%)`);
  }, [album.name, album.tracks?.items.length]);

  useEffect(() => {
    if (id) {
      setFetchOffset(0);
    }
  }, [id]);

  useEffect(() => {
    fetchAlbumInfo();
    fetchIsAlbumSaved();
  }, [fetchAlbumInfo, fetchIsAlbumSaved]);

  useEffect(() => {
    fetchOffsetAlbumTracks();
  }, [fetchOffsetAlbumTracks]);

  useEffect(() => {
    fetchSavedAlbumTracks();
  }, [fetchSavedAlbumTracks]);

  useEffect(() => {
    fetchRelatedAlbums();
  }, [fetchRelatedAlbums]);

  useEffect(() => {
    setBgGradient();
    setAlbumDuration();
  }, [setAlbumDuration, setBgGradient]);

  function renderCopyright(type: string, text: string) {
    if (type === "C") {
      return `© ${text}`;
    } else if (type === "P") {
      return `℗ ${text}`;
    }
  }

  function handleSaveAlbumTrack(isSaved?: boolean) {
    isSaved
      ? dispatch(albumSlice.removeSavedAlbum(album.id))
      : dispatch(albumSlice.saveAlbum(album.id));
  }

  return id === album.id ? (
    <div>
      <H.HeaderWrapper $bgGradient={gradient}>
        <H.Thumbnail src={album.images && album.images[0].url} alt="" />
        <div>
          <AlbumType>{album.album_type}</AlbumType>
          <H.HeaderName>{album.name}</H.HeaderName>
          <H.HeaderStats>
            {album.artists?.map((artist, index, arr) => (
              <Fragment key={artist.id}>
                <Link to={`/artist/${artist.id}`}>{artist.name}</Link>
                <span>{index !== arr.length - 1 ? ", " : ""}</span>
              </Fragment>
            ))}
            <span className="bull">&bull;</span>
            <span>{album.release_date?.slice(0, 4)}</span>
            <span className="bull">&bull;</span>
            <span>{album.total_tracks} songs</span>
            <span className="bull">&bull;</span>
            <span>{formatDuration(albumDuration, "short")}</span>
          </H.HeaderStats>
        </div>
      </H.HeaderWrapper>

      <ActionBar
        isSaved={album.is_saved}
        handleClick={() => handleSaveAlbumTrack(album.is_saved)}
        uri={album.uri}
      />

      <div>
        {albumDisc?.map((disc, index) => (
          <T.TrackDisc key={index}>
            {albumDisc.length > 1 && (
              <T.TrackDiscInfo>
                <span>
                  <BsDisc />
                </span>
                <p>Disc {index + 1}</p>
              </T.TrackDiscInfo>
            )}
            <T.TrackList>
              {disc?.map((track) => (
                <Track key={track.id} variant="album" item={track} />
              ))}
            </T.TrackList>
          </T.TrackDisc>
        ))}
      </div>

      <CopyrightWrapper>
        {album.copyrights.map((copyright, index) => (
          <Copyright key={index}>
            {renderCopyright(copyright.type, copyright.text)}
          </Copyright>
        ))}
      </CopyrightWrapper>

      {albumDiscography.items?.length > 0 && (
        <S.Section>
          <DiscoverMore>More by {album.artists[0].name}</DiscoverMore>
          <CollectionOverflow>
            {albumDiscography.items?.map((album) => (
              <Card key={album.id} variant="album" item={album} overflow />
            ))}
          </CollectionOverflow>
        </S.Section>
      )}
    </div>
  ) : null;
};

const AlbumType = styled(H.HeaderExtraInfo)`
  text-transform: capitalize;
`;

const CopyrightWrapper = styled.div`
  margin-top: 32px;
`;

const Copyright = styled.small`
  display: block;
`;

const DiscoverMore = styled(S.SectionName)`
  font-size: 20px;
`;

export default AlbumPage;
