import React, { useEffect } from "react";
import Card from "../../components/card";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { CollectionGrid } from "../../components/collection";
import {
  getCategoryInfo,
  getCategoryPlaylist,
  selectCategory,
  selectCategoryInfo,
} from "../../slices/categoriesSlice";
import { selectCurrentUserCountry } from "../../slices/currentUserSlice";

const CategoryPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const category = useSelector(selectCategory);
  const categoryInfo = useSelector(selectCategoryInfo);
  const userCountry = useSelector(selectCurrentUserCountry);

  useEffect(() => {
    if (id && userCountry) {
      dispatch(getCategoryInfo({ category_id: id, country: userCountry }));
      dispatch(getCategoryPlaylist({ category_id: id, country: userCountry }));
    }
  }, [dispatch, id, userCountry]);

  return (
    <div>
      <h1>{categoryInfo.name}</h1>
      <CollectionGrid>
        {category.playlists?.items.map((category) => (
          <Card key={category.id} variant="category" item={category} />
        ))}
      </CollectionGrid>
    </div>
  );
};

export default CategoryPage;
