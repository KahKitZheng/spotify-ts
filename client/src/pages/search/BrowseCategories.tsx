import React from "react";
import styled from "styled-components";
import { stringToHSL } from "../../utils";
import { useAppSelector } from "../../app/hooks";
import { selectCategories } from "../../slices/categoriesSlice";

const BrowseCategories = () => {
  const categories = useAppSelector(selectCategories);

  return (
    <>
      <h3>Browse all</h3>
      <CategoriesGrid>
        {categories.items?.map((category) => (
          <CategoryCard key={category.id} bgColor={stringToHSL(category.name)}>
            <CategoryName>{category.name.split("/").join("/ ")}</CategoryName>
            <CategoryCover src={category.icons[0].url} alt="" />
          </CategoryCard>
        ))}
      </CategoriesGrid>
    </>
  );
};

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 16px;
  margin-top: 8px;
`;

const CategoryCard = styled.div<{ bgColor: string }>`
  border-radius: 4px;
  background-color: ${(props) => `${props.bgColor}`};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
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

export default BrowseCategories;
