import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Paging, Category } from "../types/SpotifyObjects";
import { RootState } from "../app/store";
import { GetCategoryPlaylistsResponse } from "../types/SpotifyResponses";

interface CategoriesState {
  categories: Paging<Category>;
  activeCategoryInfo: Category;
  activeCategory: GetCategoryPlaylistsResponse;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: CategoriesState = {
  categories: {} as Paging<Category>,
  activeCategoryInfo: {} as Category,
  activeCategory: {} as GetCategoryPlaylistsResponse,
  status: "idle",
};

interface fetchParams {
  country?: string;
  limit?: number;
  locale?: string;
  offset?: number;
}

export const getCategories = createAsyncThunk(
  "categories/getCategories",
  async (data?: fetchParams) => {
    if (data) {
      const { limit = 20, country } = data;
      const response = await axios.get(
        `/browse/categories?limit=${limit}&country=${country}`
      );
      return response.data.categories;
    } else {
      const response = await axios.get(`/browse/categories`);
      return response.data.categories;
    }
  }
);

export const getCategoryInfo = createAsyncThunk(
  "categories/getCategoryInfo",
  async (category_id: string) => {
    const response = await axios.get(`browse/categories/${category_id}`);
    return response.data;
  }
);

export const getCategoryPlaylist = createAsyncThunk(
  "categories/browseCategory",
  async (category_id: string) => {
    const response = await axios.get(
      `browse/categories/${category_id}/playlists?limit=${50}`
    );
    return response.data;
  }
);

export const categoriesSlice = createSlice({
  name: "categories",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCategories.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.categories = action.payload;
    });

    builder.addCase(getCategoryPlaylist.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.activeCategory = action.payload;
    });

    builder.addCase(getCategoryInfo.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.activeCategoryInfo = action.payload;
    });
  },
});

export const selectCategoriesStatus = (state: RootState) => {
  return state.categories.status;
};

export const selectCategories = (state: RootState) => {
  return state.categories.categories;
};

export const selectCategory = (state: RootState) => {
  return state.categories.activeCategory;
};

export const selectCategoryInfo = (state: RootState) => {
  return state.categories.activeCategoryInfo;
};

export default categoriesSlice.reducer;
