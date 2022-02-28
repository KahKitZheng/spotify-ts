import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import Card from "../../components/card";
import { CollectionGrid } from "../../components/collection";
import { overflowNoScrollbar } from "../../styles/utils";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { resetScroll } from "../../utils";
import {
  getUserSavedArtists,
  selectUserSavedArtists,
} from "../../slices/userSavedArtistsSlice";
import {
  getUserSavedAlbums,
  selectUserSavedAlbums,
} from "../../slices/userSavedAlbumsSlice";
import {
  getCurrentUserPlaylists,
  selectCurrentUserPlaylists,
} from "../../slices/currentUserPlaylistsSlice";

const LibraryPage = () => {
  const dispatch = useAppDispatch();
  const tabWrapper = useRef<HTMLDivElement>(null);

  const savedArtists = useAppSelector(selectUserSavedArtists);
  const savedArtistsStatus = useSelector(
    (state: RootState) => state.userSavedArtists.status
  );

  const savedAlbums = useAppSelector(selectUserSavedAlbums);
  const savedAlbumsStatus = useSelector(
    (state: RootState) => state.userSavedAlbums.status
  );

  const savedPlaylists = useAppSelector(selectCurrentUserPlaylists);
  const savedPlaylistsStatus = useSelector(
    (state: RootState) => state.currentUserPlaylists.status
  );

  useEffect(() => {
    if (savedArtistsStatus === "idle") {
      dispatch(getUserSavedArtists({ type: "artist" }));
    }
    if (savedAlbumsStatus === "idle") {
      dispatch(getUserSavedAlbums({ limit: 50 }));
    }
    if (savedPlaylistsStatus === "idle") {
      dispatch(getCurrentUserPlaylists({ limit: 50 }));
    }
  }, [dispatch, savedAlbumsStatus, savedArtistsStatus, savedPlaylistsStatus]);

  return (
    <TabsWrapper>
      <TabFilterList>
        <TabButton onClick={() => resetScroll(tabWrapper)}>Playlists</TabButton>
        <TabButton onClick={() => resetScroll(tabWrapper)}>Artists</TabButton>
        <TabButton onClick={() => resetScroll(tabWrapper)}>Albums</TabButton>
      </TabFilterList>
      <TabPanelWrapper ref={tabWrapper}>
        <TabPanel>
          <CollectionGrid>
            {savedPlaylists.items?.map((playlist) => (
              <Card key={playlist.id} variant="playlist" item={playlist} />
            ))}
          </CollectionGrid>
        </TabPanel>
        <TabPanel>
          <CollectionGrid>
            {savedArtists.artists?.items.map((artist) => (
              <Card key={artist.id} variant="artist" item={artist} />
            ))}
          </CollectionGrid>
        </TabPanel>
        <TabPanel>
          <CollectionGrid>
            {savedAlbums.items?.map((item) => (
              <Card key={item.album.id} variant="album-saved" item={item} />
            ))}
          </CollectionGrid>
        </TabPanel>
      </TabPanelWrapper>
    </TabsWrapper>
  );
};

const TabsWrapper = styled(Tabs)`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const TabFilterList = styled(TabList)`
  display: flex;
  list-style: none;
  margin-bottom: 16px;
  padding: 0;
`;

const TabButton = styled(Tab)`
  flex: 1;
  background-color: transparent;
  border: 1px solid #30353e;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.white};
  text-align: center;

  :not(:first-of-type) {
    margin-left: 8px;
  }

  &.react-tabs__tab--selected {
    font-weight: 600;
    color: white;
    border-color: #12ce66;
    background-color: #128454;
  }
`;

const TabPanelWrapper = styled.div`
  flex: 1;
  overflow: auto;
  margin-bottom: -16px;
  padding-bottom: 16px;
  ${overflowNoScrollbar}
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, calc(50% - 8px));
  grid-gap: 16px;
`;

export default LibraryPage;
