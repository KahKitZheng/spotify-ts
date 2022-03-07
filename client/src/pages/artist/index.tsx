import React, { Fragment, useEffect, useState } from "react";
import Card from "../../components/card";
import Track from "../../components/track";
import ActionBar from "../../components/actionbar";
import * as H from "../../styles/components/headers";
import * as S from "../../styles/components/section";
import * as T from "../../styles/components/track";
import { Link, useParams } from "react-router-dom";
import { extractTrackId, stringToHSL } from "../../utils";
import { CollectionOverflow } from "../../components/collection";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUserCountry } from "../../slices/currentUserSlice";
import {
  checkSavedPopularTracks,
  getArtist,
  getArtistAlbums,
  getArtistTopTracks,
  getRelatedArtists,
  removeSavedArtist,
  saveArtist,
  selectArtist,
  selectArtistAlbum,
  selectArtistStatus,
  selectArtistTopTracks,
  selectRelatedArtists,
} from "../../slices/artistSlice";

const ArtistPage = () => {
  const { id } = useParams();
  const [gradient, setGradient] = useState("");

  const dispatch = useDispatch();
  const country = useSelector(selectCurrentUserCountry);
  const artist = useSelector(selectArtist);
  const artistStatus = useSelector(selectArtistStatus);
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
      dispatch(getArtist(id));
      dispatch(getArtistAlbums({ id }));
      dispatch(getRelatedArtists(id));
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

  useEffect(() => {
    if (topTracks.tracks?.length > 0) {
      const list = topTracks.tracks;
      dispatch(checkSavedPopularTracks(extractTrackId(list)));
    }
  }, [artistStatus, dispatch, topTracks.tracks]);

  function handleOnclick(isSaved?: boolean) {
    isSaved
      ? dispatch(removeSavedArtist(artist.id))
      : dispatch(saveArtist(artist.id));
  }

  return id === artist.id ? (
    <div>
      <H.HeaderWrapper $bgGradient={gradient}>
        <H.Thumbnail src={artist.images && artist.images[0].url} alt="" />
        <H.HeaderName>{artist.name}</H.HeaderName>
        <small>{artist.followers?.total.toLocaleString()} followers</small>
        <H.HeaderStats>
          {artist.genres?.map((genre, index, arr) => (
            <Fragment key={genre}>
              <Link to={`/genre/${genre}/${artist.id}`}>{genre}</Link>
              {index !== arr.length - 1 && <span>, </span>}
            </Fragment>
          ))}
        </H.HeaderStats>
      </H.HeaderWrapper>

      <ActionBar
        isSaved={artist.is_saved}
        handleClick={() => handleOnclick(artist.is_saved)}
      />

      {topTracks.tracks?.length > 0 && (
        <S.Section>
          <S.SectionName>Popular</S.SectionName>
          <T.TrackList>
            {topTracks.tracks?.slice(0, 10).map((track, index) => (
              <Track
                key={track.id}
                variant="popular-tracks"
                item={track}
                index={index}
              />
            ))}
          </T.TrackList>
        </S.Section>
      )}

      {albums?.length > 0 && (
        <S.Section>
          <S.SectionName>Albums</S.SectionName>
          <CollectionOverflow>
            {albums?.slice(0, 10).map((album) => (
              <Card key={album.id} variant="album-discography" item={album} />
            ))}
          </CollectionOverflow>
        </S.Section>
      )}

      {singles?.length > 0 && (
        <S.Section>
          <S.SectionName>Singles and EPs</S.SectionName>
          <CollectionOverflow>
            {singles?.slice(0, 10).map((album) => (
              <Card key={album.id} variant="album-discography" item={album} />
            ))}
          </CollectionOverflow>
        </S.Section>
      )}

      {appearsOn?.length > 0 && (
        <S.Section>
          <S.SectionName>Appears On</S.SectionName>
          <CollectionOverflow>
            {appearsOn?.slice(0, 10).map((album) => (
              <Card key={album.id} variant="album-discography" item={album} />
            ))}
          </CollectionOverflow>
        </S.Section>
      )}

      {relatedArtists.artists?.length > 0 && (
        <S.Section>
          <S.SectionName>Fans also like</S.SectionName>
          <CollectionOverflow>
            {relatedArtists.artists?.slice(0, 10).map((artist) => (
              <Card key={artist.id} variant="artist" item={artist} />
            ))}
          </CollectionOverflow>
        </S.Section>
      )}
    </div>
  ) : null;
};

export default ArtistPage;
