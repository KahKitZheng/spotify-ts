import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Paging, Category } from "../types/SpotifyObjects";
import { RootState } from "../app/store";

interface CategoriesState {
  categories: Paging<Category>;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: CategoriesState = {
  categories: {} as Paging<Category>,
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
      const { limit = 20 } = data;
      const response = await axios.get(`/browse/categories?limit=${limit}`);
      return response.data.categories;
    } else {
      const response = await axios.get(`/browse/categories`);
      return response.data.categories;
    }
  }
);

export const categoriesSlice = createSlice({
  name: "categories",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = action.payload;
      })
      .addCase(getCategories.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const selectCategories = (state: RootState) => {
  return state.categories.categories;
};

export default categoriesSlice.reducer;
