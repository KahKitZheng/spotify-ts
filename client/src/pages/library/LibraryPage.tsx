import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "../../components/card";
import * as Tab from "../../styles/components/tabs";
import { BiPlus } from "react-icons/bi";
import { CollectionGrid } from "../../components/collection";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import * as savedArtists from "../../slices/userSavedArtistsSlice";
import * as savedAlbums from "../../slices/userSavedAlbumsSlice";
import * as savedPlaylists from "../../slices/userSavedPlaylistsSlice";
import { MEDIA } from "../../styles/media";

type collectionFilters = "playlists" | "artists" | "albums";

const LibraryPage = () => {
  const dispatch = useAppDispatch();
  const laptop = MEDIA.laptop.slice(0, -2);
  const [isDesktop, setDesktop] = useState(window.innerWidth > +laptop);
  const [filter, setFilter] = useState<collectionFilters>("playlists");

  const likedArtists = useAppSelector(savedArtists.selectSavedArtists);
  const likedArtistsStatus = useAppSelector(savedArtists.selectSavedArtistsStatus);

  const likedAlbums = useAppSelector(savedAlbums.selectSavedAlbums);
  const likedAlbumsStatus = useAppSelector(savedAlbums.selectSavedAlbumsStatus);

  const likedPlaylists = useAppSelector(savedPlaylists.selectUserPlaylists);
  const likedPlaylistsStatus = useAppSelector(savedPlaylists.selectPlaylistsStatus);

  function updateMedia() {
    setDesktop(window.innerWidth > +laptop);
  }

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });

  useEffect(() => {
    if (likedArtistsStatus === "idle") {
      dispatch(savedArtists.getUserSavedArtists({ type: "artist", limit: 50 }));
    }
    if (likedAlbumsStatus === "idle") {
      dispatch(savedAlbums.getUserSavedAlbums({ limit: 50 }));
    }
    if (likedPlaylistsStatus === "idle") {
      dispatch(savedPlaylists.getCurrentUserPlaylists({ limit: 50 }));
    }
  }, [dispatch, likedAlbumsStatus, likedArtistsStatus, likedPlaylistsStatus]);

  return (
    <Tab.PageWrapper>
      <Tab.TabHeader>
        <div>
          <Tab.Tab $isActive={filter === "playlists"} onClick={() => setFilter("playlists")}>
            Playlists
          </Tab.Tab>
          <Tab.Tab $isActive={filter === "artists"} onClick={() => setFilter("artists")}>
            Artists
          </Tab.Tab>
          <Tab.Tab $isActive={filter === "albums"} onClick={() => setFilter("albums")}>
            Albums
          </Tab.Tab>
        </div>
        <CreatePlaylist onClick={() => console.log("Create playlist")}>
          {isDesktop ? "Create Playlist" : <BiPlus />}
        </CreatePlaylist>
      </Tab.TabHeader>
      <Tab.TabView>
        <CollectionGrid>
          {likedPlaylists.items?.map((playlist) => (
            <Card key={playlist.id} variant="playlist" item={playlist} />
          ))}
        </CollectionGrid>
        <CollectionGrid>
          {likedArtists.artists?.items.map((artist) => (
            <Card key={artist.id} variant="artist" item={artist} />
          ))}
        </CollectionGrid>
        <CollectionGrid>
          {likedAlbums.items?.map((item) => (
            <Card key={item.album.id} variant="album-saved" item={item} />
          ))}
        </CollectionGrid>
      </Tab.TabView>
    </Tab.PageWrapper>
  );
};

const CreatePlaylist = styled(Tab.Tab)`
  color: ${({ theme }) => theme.colors.white};
`;

export default LibraryPage;
