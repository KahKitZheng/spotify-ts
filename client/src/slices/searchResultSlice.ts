import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { SearchResponse } from "../types/SpotifyResponses";
import { SearchType } from "../types/SpotifyObjects";
import { RootState } from "../app/store";

interface SearchResultState {
  searchResults: SearchResponse;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: SearchResultState = {
  searchResults: {} as SearchResponse,
  status: "idle",
};

interface fetchParams {
  q: string;
  type?: SearchType;
  include_external?: string;
  limit?: number;
  market?: string;
  offset?: number;
}

export const getAllSearchResults = createAsyncThunk(
  "searchResults/getAllSearchResults",
  async (data?: fetchParams) => {
    if (data) {
      const { q, type = "artist,album,track,playlist", limit = 20 } = data;
      const response = await axios.get(`/search?q=${q}&type=${type}&limit=${limit}`);
      return response.data;
    }
  }
);

export const searchResultSlice = createSlice({
  name: "searchResult",
  initialState: initialState,
  reducers: {
    startSearch: (state) => {
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllSearchResults.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.searchResults = action.payload;
    });
  },
});

export const selectSearchResultsStatus = (state: RootState) => {
  return state.searchResults.status;
};

export const selectSearchResults = (state: RootState) => {
  return state.searchResults.searchResults;
};

export const { startSearch } = searchResultSlice.actions;

export default searchResultSlice.reducer;
