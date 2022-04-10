import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "../../components/Card";
import * as Tab from "../../styles/components/tabs";
import { MEDIA } from "../../styles/media";
import { BiPlus } from "react-icons/bi";
import { CollectionGrid } from "../../components/Collection";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import * as savedArtists from "../../slices/userSavedArtistsSlice";
import * as savedAlbums from "../../slices/userSavedAlbumsSlice";
import * as savedPlaylists from "../../slices/userSavedPlaylistsSlice";
import { useNavigate } from "react-router-dom";
import { selectCurrentUser } from "../../slices/currentUserSlice";

type collectionTabs = "playlists" | "artists" | "albums";

const LibraryPage = () => {
  const [activeTab, setActiveTab] = useState<collectionTabs>("playlists");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUser);
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
            {likedPlaylists.items?.map((playlist) => (
              <Card key={playlist.id} variant="playlist" item={playlist} />
            ))}
          </CollectionGrid>
        )}
        {activeTab === "artists" && (
          <CollectionGrid>
            {likedArtists.artists?.items.map((artist) => (
              <Card key={artist.id} variant="artist" item={artist} />
            ))}
          </CollectionGrid>
        )}
        {activeTab === "albums" && (
          <CollectionGrid>
            {likedAlbums.items?.map((item) => (
              <Card key={item.album.id} variant="album-saved" item={item} />
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
