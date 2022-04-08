import React from "react";
import styled from "styled-components";
import MainViewWrapper from "./MainViewWrapper";
import Playerbar from "./Playerbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BottomTabs, Sidebar } from "./Navigation";
import { MEDIA } from "../styles/media";

import HomePage from "../pages/home";
import PageNotFound from "../pages/404";
import SearchPage from "../pages/search";
import LibraryPage from "../pages/library";
import PlaylistPage from "../pages/playlist";
import AlbumPage from "../pages/album";
import ArtistPage from "../pages/artist";
import RecentTracksPage from "../pages/recent-tracks";
import CategoryPage from "../pages/category";
import GenrePage from "../pages/genre";
import { TopArtistsPage, TopTracksPage } from "../pages/top-items/";

const AppRouter = () => (
  <BrowserRouter>
    <Layout>
      <Sidebar />
      <MainViewWrapper>
        <Routes>
          <Route path="*" element={<PageNotFound />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/playlist/:id" element={<PlaylistPage />} />
          <Route path="/album/:id" element={<AlbumPage />} />
          <Route path="/artist/:id" element={<ArtistPage />} />
          <Route path="/top-artists" element={<TopArtistsPage />} />
          <Route path="/top-tracks" element={<TopTracksPage />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/genre/:category/:artist" element={<GenrePage />} />
          <Route path="/genre/recently-played" element={<RecentTracksPage />} />
        </Routes>
      </MainViewWrapper>
      <BottomTabs />
      <Playerbar />
    </Layout>
  </BrowserRouter>
);

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr auto;
  grid-template-areas:
    "main main"
    "bottom bottom";
  height: 100%;

  @media (min-width: ${MEDIA.tablet}) {
    grid-template-columns: 260px 1fr;
    grid-template-areas:
      "sidebar main"
      "playbar playbar";
  }
`;

export default AppRouter;
