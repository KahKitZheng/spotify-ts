import React, { Fragment, useEffect, useState } from "react";
import styled from "styled-components";
import Card from "../../components/card";
import * as H from "../../styles/components/headers";
import * as T from "../../styles/components/track";
import * as S from "../../styles/components/section";
import { CollectionOverflow } from "../../components/collection";
import { Link, useParams } from "react-router-dom";
import { formatDuration, stringToHSL } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import {
  countAlbumDuration,
  getAlbum,
  getAlbumDiscography,
  selectAlbum,
  selectAlbumDiscography,
  selectAlbumDuration,
} from "../../slices/albumSlice";

const AlbumPage = () => {
  const { id } = useParams();
  const [gradient, setGradient] = useState("");

  const dispatch = useDispatch();
  const album = useSelector(selectAlbum);
  const albumDuration = useSelector(selectAlbumDuration);
  const albumDiscography = useSelector(selectAlbumDiscography);

  useEffect(() => {
    if (id) {
      dispatch(getAlbum({ id }));
    }

    if (album.tracks?.items.length > 0) {
      dispatch(countAlbumDuration());
      setGradient(stringToHSL(album.name));
    }
  }, [album.name, album.tracks?.items.length, dispatch, id]);

  useEffect(() => {
    if (album.artists) {
      dispatch(getAlbumDiscography({ id: album.artists[0].id }));
    }
  }, [album, dispatch]);

  function renderCopyright(type: string, text: string) {
    if (type === "C") {
      return `© ${text}`;
    } else if (type === "P") {
      return `℗ ${text}`;
    }
  }

  return id === album.id ? (
    <div>
      <H.HeaderWrapper $bgGradient={gradient}>
        <H.Thumbnail src={album.images && album.images[0].url} alt="" />
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
      </H.HeaderWrapper>

      <T.TracklistWrapper>
        {album.tracks?.items.map((item) => (
          <T.Track key={item.id}>
            <T.TrackInfo>
              <T.TrackName>{item.name}</T.TrackName>
              <T.TrackArtists>
                {item.artists.map((artist, index, arr) => (
                  <Fragment key={artist.id}>
                    <Link to={`artist/${artist.id}`}>{artist.name}</Link>
                    {index !== arr.length - 1 && <span>, </span>}
                  </Fragment>
                ))}
              </T.TrackArtists>
            </T.TrackInfo>
          </T.Track>
        ))}
      </T.TracklistWrapper>

      <CopyrightWrapper>
        {album.copyrights.map((copyright, index) => (
          <Copyright key={index}>
            {renderCopyright(copyright.type, copyright.text)}
          </Copyright>
        ))}
      </CopyrightWrapper>

      {albumDiscography.items?.length > 0 && (
        <S.Section>
          <S.SectionName>More by {album.artists[0].name}</S.SectionName>
          <CollectionOverflow>
            {albumDiscography.items?.map((album) => (
              <Card key={album.id} variant="album" item={album} />
            ))}
          </CollectionOverflow>
        </S.Section>
      )}
    </div>
  ) : null;
};

const AlbumType = styled.span`
  font-size: 14px;
  text-transform: capitalize;
`;

const CopyrightWrapper = styled.div`
  margin-top: 32px;
`;

const Copyright = styled.small`
  display: block;
  color: #979da4;
`;

export default AlbumPage;
