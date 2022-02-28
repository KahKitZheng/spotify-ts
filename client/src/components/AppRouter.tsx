import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainViewWrapper from "./MainViewWrapper";
import BottomTabs from "./navigation/BottomTabs";

import HomePage from "../pages/home";
import SearchPage from "../pages/search";
import LibraryPage from "../pages/library";
import PlaylistPage from "../pages/playlist";
import AlbumPage from "../pages/album";
import ArtistPage from "../pages/artist";
import RecentlyPlayedPage from "../pages/recently-played";
import PageNotFound from "../pages/404";

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
          <Route
            path="/genre/recently-played"
            element={<RecentlyPlayedPage />}
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </MainViewWrapper>
      <BottomTabs />
    </BrowserRouter>
  );
};

export default AppRouter;
