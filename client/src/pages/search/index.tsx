import React, { useEffect } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { getCategories, selectCategories } from "../../slices/categoriesSlice";
import { stringToHSL } from "../../utils";

const SearchPage = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);

  const categoriesStatus = useSelector(
    (state: RootState) => state.categories.status
  );

  useEffect(() => {
    if (categoriesStatus === "idle") {
      dispatch(getCategories({ limit: 50 }));
    }
  }, [dispatch]);

  console.log(categories);

  return (
    <div>
      <CategoriesGrid>
        {categories.items?.map((category) => (
          <CategoryCard key={category.id} bgColor={stringToHSL(category.name)}>
            <CategoryName>{category.name.split("/").join("/ ")}</CategoryName>
            <CategoryCover src={category.icons[0].url} alt="" />
          </CategoryCard>
        ))}
      </CategoriesGrid>
    </div>
  );
};

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 16px;
`;

const CategoryCard = styled.div<{ bgColor: string }>`
  border-radius: 4px;
  background-color: ${(props) => `${props.bgColor}`};
  position: relative;
  padding: 16px 12px;
  height: 5rem;
  overflow: hidden;
`;

const CategoryName = styled.div`
  font-weight: 700;
  line-height: 1.2;
  color: white;
  width: 60%;
`;

const CategoryCover = styled.img`
  height: 64px;
  width: 64px;
  position: absolute;
  bottom: -4px;
  right: -10px;
  transform: rotate(20deg);
  box-shadow: -2px 4px 4px rgba(0, 0, 0, 0.4);
`;

export default SearchPage;
