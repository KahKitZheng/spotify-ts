import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainViewWrapper from "./MainViewWrapper";
import BottomTabs from "./navigation/BottomTabs";

import HomePage from "../pages/home";
import PageNotFound from "../pages/404";
import SearchPage from "../pages/search";
import LibraryPage from "../pages/library";
import PlaylistPage from "../pages/playlist";
import AlbumPage from "../pages/album";
import ArtistPage from "../pages/artist";
import RecentTracksPage from "../pages/recent-tracks";
import { TopArtistsPage, TopTracksPage } from "../pages/top-items/";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <MainViewWrapper>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/playlist/:id" element={<PlaylistPage />} />
          <Route path="/album/:id" element={<AlbumPage />} />
          <Route path="/artist/:id" element={<ArtistPage />} />
          <Route path="/top-artists" element={<TopArtistsPage />} />
          <Route path="/top-tracks" element={<TopTracksPage />} />
          <Route path="/genre/recently-played" element={<RecentTracksPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </MainViewWrapper>
      <BottomTabs />
    </BrowserRouter>
  );
};

export default AppRouter;
