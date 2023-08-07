import React, { useEffect } from "react";
import Card from "@/components/Card";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { CollectionGrid } from "@/components/Collection";
import {
  getCategoryInfo,
  getCategoryPlaylist,
  selectCategory,
  selectCategoryInfo,
} from "../../slices/categoriesSlice";
import { selectCurrentUserCountry } from "../../slices/currentUserSlice";
import styled from "styled-components";

const CategoryPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const category = useSelector(selectCategory);
  const categoryInfo = useSelector(selectCategoryInfo);
  const userCountry = useSelector(selectCurrentUserCountry);

  useEffect(() => {
    if (id && userCountry) {
      dispatch(getCategoryInfo(id));
      dispatch(getCategoryPlaylist(id));
    }
  }, [dispatch, id, userCountry]);

  return id === categoryInfo.id ? (
    <div>
      <CategoryName>{categoryInfo.name}</CategoryName>
      <CollectionGrid>
        {category.playlists?.items.map((category, index) => (
          <Card key={index} variant="playlist" item={category} />
        ))}
      </CollectionGrid>
    </div>
  ) : null;
};

const CategoryName = styled.h1`
  font-size: 48px;
`;

export default CategoryPage;
