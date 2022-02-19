import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainViewWrapper from "./MainViewWrapper";
import BottomTabs from "./navigation/BottomTabs";

import HomePage from "../pages/home";
import SearchPage from "../pages/search";
import LibraryPage from "../pages/library";
import PageNotFound from "../pages/404";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <MainViewWrapper>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </MainViewWrapper>
      <BottomTabs />
    </BrowserRouter>
  );
};

export default AppRouter;
