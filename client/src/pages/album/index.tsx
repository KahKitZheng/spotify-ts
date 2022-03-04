import React, { Fragment, useEffect, useState } from "react";
import styled from "styled-components";
import Card from "../../components/card";
import Track from "../../components/track";
import * as H from "../../styles/components/headers";
import * as T from "../../styles/components/track";
import * as S from "../../styles/components/section";
import { BsDisc } from "react-icons/bs";
import { CollectionOverflow } from "../../components/collection";
import { Link, useParams } from "react-router-dom";
import { formatDuration, stringToHSL } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import {
  countAlbumDuration,
  getAlbum,
  getAlbumDiscography,
  groupTracksByDisc,
  selectAlbum,
  selectAlbumDisc,
  selectAlbumDiscography,
  selectAlbumDuration,
  selectAlbumStatus,
} from "../../slices/albumSlice";

const AlbumPage = () => {
  const { id } = useParams();
  const [gradient, setGradient] = useState("");

  const dispatch = useDispatch();
  const album = useSelector(selectAlbum);
  const albumStatus = useSelector(selectAlbumStatus);
  const albumDuration = useSelector(selectAlbumDuration);
  const albumDisc = useSelector(selectAlbumDisc);
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
    if (albumStatus === "succeeded") {
      dispatch(groupTracksByDisc());
    }
  }, [albumStatus, dispatch]);

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
            {disc?.map((track, index) => (
              <Track
                key={track.id}
                variant="album"
                item={track}
                index={index}
              />
            ))}
          </T.TrackList>
        </T.TrackDisc>
      ))}

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
`;

const DiscoverMore = styled(S.SectionName)`
  font-size: 20px;
`;

export default AlbumPage;
