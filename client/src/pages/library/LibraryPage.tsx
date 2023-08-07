import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "@/components/Card";
import RenderIfVisible from "react-render-if-visible";
import * as Tab from "@/styles/components/tabs";
import { MEDIA } from "@/styles/media";
import { BiPlus } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { LikedSongsCard } from "@/components/Card/Card";
import { CollectionGrid } from "@/components/Collection";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectCurrentUser } from "@/slices/currentUserSlice";
import * as savedArtists from "@/slices/userSavedArtistsSlice";
import * as savedAlbums from "@/slices/userSavedAlbumsSlice";
import * as savedPlaylists from "@/slices/userSavedPlaylistsSlice";
import * as savedTracksSlice from "@/slices/savedTracksSlice";

type collectionTabs = "playlists" | "artists" | "albums";

const LibraryPage = () => {
  const [activeTab, setActiveTab] = useState<collectionTabs>("playlists");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUser);
  const savedTracks = useAppSelector(savedTracksSlice.selectSavedTracks);
  const likedArtists = useAppSelector(savedArtists.selectSavedArtists);
  const likedArtistsStatus = useAppSelector(
    savedArtists.selectSavedArtistsStatus
  );
  const likedAlbums = useAppSelector(savedAlbums.selectSavedAlbums);
  const likedAlbumsStatus = useAppSelector(savedAlbums.selectSavedAlbumsStatus);
  const likedPlaylists = useAppSelector(savedPlaylists.selectUserPlaylists);
  const likedPlaylistsStatus = useAppSelector(
    savedPlaylists.selectPlaylistsStatus
  );

  // Fetch liked songs to create the liked songs card in playlist tab
  useEffect(() => {
    if (savedTracks.items?.length > 0) return;
    dispatch(savedTracksSlice.fetchSavedTracks({ limit: 5 }));
  }, [dispatch, savedTracks.items?.length]);

  // Fetch library data
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

  function createNewPlaylist() {
    dispatch(
      savedPlaylists.createPlaylist({ user_id: user.id, name: "New Playlist" })
    ).then((res) => navigate(`/playlist/${res.payload.id}`));
  }

  const lastArtistRef = useInfiniteScroll(
    likedArtistsStatus,
    likedArtists.artists?.next !== null,
    handleFetchArtistOffset
  );

  function handleFetchArtistOffset() {
    if (likedArtists.artists?.next === null) return;
    dispatch(
      savedArtists.getUserSavedArtistsWithOffset(likedArtists.artists?.next)
    );
  }

  const lastAlbumRef = useInfiniteScroll(
    likedAlbumsStatus,
    likedAlbums.next !== null,
    handleFetchAlbumOffset
  );

  function handleFetchAlbumOffset() {
    if (likedAlbums.next === null) return;
    dispatch(savedAlbums.getUserSavedAlbumsWithOffset(likedAlbums.next));
  }

  return (
    <Tab.PageWrapper>
      <Tab.TabHeader>
        <div>
          <Tab.Tab
            $isActive={activeTab === "playlists"}
            onClick={() => setActiveTab("playlists")}
          >
            Playlists
          </Tab.Tab>
          <Tab.Tab
            $isActive={activeTab === "artists"}
            onClick={() => setActiveTab("artists")}
          >
            Artists
          </Tab.Tab>
          <Tab.Tab
            $isActive={activeTab === "albums"}
            onClick={() => setActiveTab("albums")}
          >
            Albums
          </Tab.Tab>
        </div>
        <CreatePlaylist onClick={createNewPlaylist}>
          <BiPlus />
        </CreatePlaylist>
      </Tab.TabHeader>
      <Tab.TabView>
        {activeTab === "playlists" && (
          <CollectionGrid>
            <LikedSongsCard />
            {likedPlaylists.items?.map((playlist) => (
              <Card key={playlist.id} variant="playlist" item={playlist} />
            ))}
          </CollectionGrid>
        )}
        {activeTab === "artists" && (
          <CollectionGrid>
            {likedArtists.artists?.items.map((artist, index) => (
              <RenderIfVisible defaultHeight={200} key={index}>
                <div
                  ref={
                    likedArtists.artists.items?.length === index + 1
                      ? lastArtistRef
                      : null
                  }
                >
                  <Card variant="artist" item={artist} />
                </div>
              </RenderIfVisible>
            ))}
          </CollectionGrid>
        )}
        {activeTab === "albums" && (
          <CollectionGrid>
            {likedAlbums.items?.map((item, index) => (
              <RenderIfVisible defaultHeight={200} key={index}>
                <div
                  ref={
                    likedAlbums.items?.length === index + 1
                      ? lastAlbumRef
                      : null
                  }
                >
                  <Card key={item.album.id} variant="album-saved" item={item} />
                </div>
              </RenderIfVisible>
            ))}
          </CollectionGrid>
        )}
      </Tab.TabView>
    </Tab.PageWrapper>
  );
};

const CreatePlaylist = styled(Tab.Tab)`
  padding: 0;
  font-size: 20px;

  @media (min-width: ${MEDIA.tablet}) {
    display: none;
  }
`;

export default LibraryPage;
