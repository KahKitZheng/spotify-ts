import React, { Fragment, useEffect, useState } from "react";
import Card from "../../components/card";
import Track from "../../components/track";
import ActionBar from "../../components/actionbar";
import * as H from "../../styles/components/headers";
import * as S from "../../styles/components/section";
import * as T from "../../components/track/Track.style";
import { Link, useParams } from "react-router-dom";
import { extractTrackId, stringToHSL } from "../../utils";
import { CollectionOverflow } from "../../components/collection";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUserCountry } from "../../slices/currentUserSlice";
import * as artistSlice from "../../slices/artistSlice";

const ArtistPage = () => {
  const { id } = useParams();
  const [gradient, setGradient] = useState("");

  const dispatch = useDispatch();
  const country = useSelector(selectCurrentUserCountry);
  const artist = useSelector(artistSlice.selectArtist);
  const discography = useSelector(artistSlice.selectArtistAlbum);
  const topTracks = useSelector(artistSlice.selectArtistTopTracks);
  const relatedArtists = useSelector(artistSlice.selectRelatedArtists);

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
      dispatch(artistSlice.getArtist(id));
      dispatch(artistSlice.getArtistAlbums({ id }));
      dispatch(artistSlice.getRelatedArtists(id));
      dispatch(artistSlice.checkSavedArtist(id));
    }

    if (artist.name) {
      setGradient(stringToHSL(artist?.name));
    }
  }, [artist.name, dispatch, id]);

  useEffect(() => {
    function fetchTopTracks() {
      if (id && country !== undefined) {
        dispatch(artistSlice.getArtistTopTracks({ id, market: country }));
      }
      return null;
    }

    fetchTopTracks();
  }, [country, dispatch, id]);

  useEffect(() => {
    if (topTracks.tracks?.length > 0) {
      const list = topTracks.tracks;
      dispatch(artistSlice.checkSavedPopularTracks(extractTrackId(list)));
    }
  }, [dispatch, topTracks.tracks]);

  function handleOnclick(isSaved?: boolean) {
    isSaved
      ? dispatch(artistSlice.removeSavedArtist(artist.id))
      : dispatch(artistSlice.saveArtist(artist.id));
  }

  return id === artist.id ? (
    <div>
      <H.HeaderWrapper $bgGradient={gradient}>
        {artist.images[0] === undefined ? (
          <H.ThumbnailPlaceholder>
            {artist.name.slice(0, 1)}
          </H.ThumbnailPlaceholder>
        ) : (
          <H.Thumbnail src={artist.images[0].url} alt="" />
        )}

        <div>
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
        </div>
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
                variant="popular-artist-tracks"
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
              <Card
                key={album.id}
                variant="album-discography"
                item={album}
                overflow
              />
            ))}
          </CollectionOverflow>
        </S.Section>
      )}

      {singles?.length > 0 && (
        <S.Section>
          <S.SectionName>Singles and EPs</S.SectionName>
          <CollectionOverflow>
            {singles?.slice(0, 10).map((album) => (
              <Card
                key={album.id}
                variant="album-discography"
                item={album}
                overflow
              />
            ))}
          </CollectionOverflow>
        </S.Section>
      )}

      {appearsOn?.length > 0 && (
        <S.Section>
          <S.SectionName>Appears On</S.SectionName>
          <CollectionOverflow>
            {appearsOn?.slice(0, 10).map((album) => (
              <Card
                key={album.id}
                variant="album-discography"
                item={album}
                overflow
              />
            ))}
          </CollectionOverflow>
        </S.Section>
      )}

      {relatedArtists.artists?.length > 0 && (
        <S.Section>
          <S.SectionName>Fans also like</S.SectionName>
          <CollectionOverflow>
            {relatedArtists.artists?.slice(0, 10).map((artist) => (
              <Card key={artist.id} variant="artist" item={artist} overflow />
            ))}
          </CollectionOverflow>
        </S.Section>
      )}
    </div>
  ) : null;
};

export default ArtistPage;
