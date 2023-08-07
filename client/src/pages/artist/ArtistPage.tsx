import React, { Fragment, useEffect, useState } from "react";
import Card from "@/components/Card";
import Track from "@/components/Track";
import ActionBar from "@/components/ActionBar";
import * as H from "@/styles/components/headers";
import * as S from "@/styles/components/section";
import * as T from "@/components/Track/Track.style";
import * as artistSlice from "@/slices/artistSlice";
import { CollectionGrid } from "@/components/Collection";
import { Link, useParams } from "react-router-dom";
import { ArtistPlaceholder } from "@/assets/placeholders";
import { extractTrackId, getHeaderHue } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUserCountry } from "@/slices/currentUserSlice";

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
      setGradient(getHeaderHue(artist?.name));
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
          <ArtistPlaceholder />
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
        uri={artist.uri}
      />

      {topTracks.tracks?.length > 0 && (
        <S.Section>
          <S.SectionName>Popular</S.SectionName>
          <T.TrackList>
            {topTracks.tracks?.slice(0, 5).map((track, index) => (
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
          <CollectionGrid>
            {albums?.map((album) => (
              <Card
                key={album.id}
                variant="album-discography"
                item={album}
                overflow
              />
            ))}
          </CollectionGrid>
        </S.Section>
      )}

      {singles?.length > 0 && (
        <S.Section>
          <S.SectionName>Singles and EPs</S.SectionName>
          <CollectionGrid>
            {singles?.map((album) => (
              <Card
                key={album.id}
                variant="album-discography"
                item={album}
                overflow
              />
            ))}
          </CollectionGrid>
        </S.Section>
      )}

      {appearsOn?.length > 0 && (
        <S.Section>
          <S.SectionName>Appears On</S.SectionName>
          <CollectionGrid>
            {appearsOn?.map((album) => (
              <Card
                key={album.id}
                variant="album-discography"
                item={album}
                overflow
              />
            ))}
          </CollectionGrid>
        </S.Section>
      )}

      {relatedArtists.artists?.length > 0 && (
        <S.Section>
          <S.SectionName>Fans also like</S.SectionName>
          <CollectionGrid>
            {relatedArtists.artists?.slice(0, 10).map((artist) => (
              <Card key={artist.id} variant="artist" item={artist} />
            ))}
          </CollectionGrid>
        </S.Section>
      )}
    </div>
  ) : null;
};

export default ArtistPage;
