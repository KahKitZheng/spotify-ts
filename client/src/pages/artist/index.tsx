import React, { Fragment, useEffect, useState } from "react";
import styled from "styled-components";
import Card from "../../components/card";
import * as H from "../../styles/components/headers";
import * as S from "../../styles/components/section";
import * as T from "../../styles/components/track";
import { Link, useParams } from "react-router-dom";
import { stringToHSL } from "../../utils";
import { CollectionOverflow } from "../../components/collection";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUserCountry } from "../../slices/currentUserSlice";
import {
  getArtist,
  getArtistAlbums,
  getArtistTopTracks,
  getRelatedArtists,
  selectArtist,
  selectArtistAlbum,
  selectArtistTopTracks,
  selectRelatedArtists,
} from "../../slices/artistSlice";

const ArtistPage = () => {
  const { id } = useParams();
  const [gradient, setGradient] = useState("");

  const dispatch = useDispatch();
  const country = useSelector(selectCurrentUserCountry);
  const artist = useSelector(selectArtist);
  const discography = useSelector(selectArtistAlbum);
  const topTracks = useSelector(selectArtistTopTracks);
  const relatedArtists = useSelector(selectRelatedArtists);

  const albums = discography.items?.filter(
    (album) => album.album_group === "album"
  );
  const singles = discography.items?.filter(
    (album) => album.album_group === "single"
  );
  const appearsOn = discography.items?.filter(
    (album) => album.album_group === "appears_on"
  );

  useEffect(() => {
    if (id) {
      dispatch(getArtist({ id }));
      dispatch(getArtistAlbums({ id }));
      dispatch(getRelatedArtists({ id }));
    }

    if (artist.name) {
      setGradient(stringToHSL(artist?.name));
    }
  }, [artist.name, dispatch, id]);

  useEffect(() => {
    function fetchTopTracks() {
      if (id && country !== undefined) {
        dispatch(getArtistTopTracks({ id, market: country }));
      }
      return null;
    }

    fetchTopTracks();
  }, [country, dispatch, id]);

  return id === artist.id ? (
    <div>
      <H.HeaderWrapper $bgGradient={gradient}>
        <H.Thumbnail src={artist.images && artist.images[0].url} alt="" />
        <H.HeaderName>{artist.name}</H.HeaderName>
        <small>{artist.followers?.total.toLocaleString()} followers</small>
        <H.HeaderStats>
          {artist.genres?.map((genre, index, arr) => (
            <Fragment key={genre}>
              <Link to={`/browse/categories/${genre}`}>{genre}</Link>
              {index !== arr.length - 1 && <span>, </span>}
            </Fragment>
          ))}
        </H.HeaderStats>
      </H.HeaderWrapper>

      <S.Section>
        <S.SectionName>Popular</S.SectionName>
        <TrackGrid>
          {topTracks.tracks?.map((track) => (
            <T.Track key={track.id}>
              <T.TrackAlbumCover
                src={track.album?.images[0].url}
                alt=""
                $small
              />
              <T.TrackInfo>
                <T.TrackName>{track.name}</T.TrackName>
              </T.TrackInfo>
            </T.Track>
          ))}
        </TrackGrid>
      </S.Section>

      <S.Section>
        <S.SectionName>Albums</S.SectionName>
        <CollectionOverflow colSize={albums?.length < 10 ? albums.length : 10}>
          {albums?.map((album) => (
            <Card
              key={album.id}
              imgSource={album.images && album.images[0].url}
              link={`/album/${album.id}`}
              title={album.name}
              undertitle={`
                ${album.release_date?.slice(0, 4)} 
                <span class="bull">&bull;</span>
                Album
              `}
            />
          ))}
        </CollectionOverflow>
      </S.Section>

      <S.Section>
        <S.SectionName>Singles and EPs</S.SectionName>
        <CollectionOverflow
          colSize={singles?.length < 10 ? singles.length : 10}
        >
          {singles?.map((album) => (
            <Card
              key={album.id}
              imgSource={album.images && album.images[0].url}
              link={`/album/${album.id}`}
              title={album.name}
              undertitle={`
                ${album.release_date?.slice(0, 4)} 
                <span class="bull">&bull;</span>
                ${album.total_tracks > 2 ? "EP" : "Single"}
              `}
            />
          ))}
        </CollectionOverflow>
      </S.Section>

      <S.Section>
        <S.SectionName>Appears On</S.SectionName>
        <CollectionOverflow
          colSize={appearsOn?.length < 10 ? appearsOn.length : 10}
        >
          {appearsOn?.map((album) => (
            <Card
              key={album.id}
              imgSource={album.images && album.images[0].url}
              link={`/album/${album.id}`}
              title={album.name}
              undertitle={`
                ${album.release_date?.slice(0, 4)} 
                <span class="bull">&bull;</span>
                Album
              `}
            />
          ))}
        </CollectionOverflow>
      </S.Section>

      <S.Section>
        <S.SectionName>Fans also like</S.SectionName>
        <CollectionOverflow
          colSize={
            relatedArtists.artists?.length < 10
              ? relatedArtists.artists?.length
              : 10
          }
        >
          {relatedArtists.artists?.map((artist) => (
            <Card
              key={artist.id}
              imgSource={artist.images && artist.images[0].url}
              link={`/artist/${artist.id}`}
              title={artist.name}
              undertitle="Artist"
              isArtist
            />
          ))}
        </CollectionOverflow>
      </S.Section>
    </div>
  ) : null;
};

const TrackGrid = styled.div`
  display: grid;
  grid-template-rows: repeat(5, 1fr);
  margin-top: 8px;

  ${T.Track}:nth-child(1n + 6) {
    display: none;
  }
`;

export default ArtistPage;
