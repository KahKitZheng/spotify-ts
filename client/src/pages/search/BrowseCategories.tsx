import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { stringToHSL } from "../../utils";
import { CollectionGrid } from "../../components/collection";
import { useAppSelector } from "../../app/hooks";
import { selectCategories } from "../../slices/categoriesSlice";

const BrowseCategories = () => {
  const categories = useAppSelector(selectCategories);

  return (
    <CategoriesWrapper>
      <CategoryTitle>Browse all</CategoryTitle>
      <CollectionGrid>
        {categories.items?.map((category) => (
          <CategoryCardWrapper key={category.id} to={`/category/${category.id}`}>
            <CategoryCard bgColor={stringToHSL(category.name)}>
              <CategoryName>{category.name.split("/").join("/ ")}</CategoryName>
              <CategoryCover src={category.icons[0].url} alt="" />
            </CategoryCard>
          </CategoryCardWrapper>
        ))}
      </CollectionGrid>
    </CategoriesWrapper>
  );
};

const CategoriesWrapper = styled.div`
  margin-top: 16px;
  padding-bottom: 16px;
`;

const CategoryCardWrapper = styled(Link)`
  :hover {
    text-decoration: none;
  }
`;

const CategoryTitle = styled.h3`
  margin-top: 16px;
  margin-bottom: 8px;
`;

const CategoryCard = styled.div<{ bgColor: string }>`
  border-radius: 8px;
  background-color: ${(props) => `${props.bgColor}`};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  position: relative;
  padding: 16px;
  height: 6rem;
  overflow: hidden;

  @media (min-width: 560px) {
    aspect-ratio: 1;
    height: 100%;
  }
`;

const CategoryName = styled.div`
  font-weight: 700;
  line-height: 1.2;
  color: white;
  width: 60%;
`;

const CategoryCover = styled.img`
  aspect-ratio: 1;
  max-height: 75%;
  position: absolute;
  bottom: 0;
  right: 0;
  transform: rotate(20deg) translate(14%, -2%);
  box-shadow: -2px 4px 4px rgba(0, 0, 0, 0.4);

  @media (min-width: 560px) {
    max-height: 55%;
  }
`;

export default BrowseCategories;
