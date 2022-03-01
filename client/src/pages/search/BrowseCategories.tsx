import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { stringToHSL } from "../../utils";
import { useAppSelector } from "../../app/hooks";
import { selectCategories } from "../../slices/categoriesSlice";

const BrowseCategories = () => {
  const categories = useAppSelector(selectCategories);

  return (
    <CategoriesWrapper>
      <h3>Browse all</h3>
      <CategoriesGrid>
        {categories.items?.map((category) => (
          <Link key={category.id} to={`/category/${category.id}`}>
            <CategoryCard bgColor={stringToHSL(category.name)}>
              <CategoryName>{category.name.split("/").join("/ ")}</CategoryName>
              <CategoryCover src={category.icons[0].url} alt="" />
            </CategoryCard>
          </Link>
        ))}
      </CategoriesGrid>
    </CategoriesWrapper>
  );
};

const CategoriesWrapper = styled.div`
  margin-top: 16px;
`;

const CategoriesGrid = styled.div`
  --categoryRepeat: 2;
  --categoryWidth: calc((100% / var(--categoryRepeat)) - var(--categoryGap));
  --categoryGap: 16px;
  display: grid;
  grid-template-columns: repeat(
    var(--categoryRepeat),
    minmax(var(--categoryGap), 1fr)
  );

  grid-template-rows: 100%;
  grid-template-rows: auto;
  grid-gap: var(--categoryGap);
  margin-top: 8px;

  @media (min-width: 560px) {
    --categoryRepeat: 3;
  }

  @media (min-width: 760px) {
    --categoryRepeat: 4;
  }

  @media (min-width: 960px) {
    --categoryRepeat: 5;
  }

  @media (min-width: 1160px) {
    --categoryRepeat: 6;
  }

  @media (min-width: 1360px) {
    --categoryRepeat: 7;
  }

  @media (min-width: 1560px) {
    --categoryRepeat: 8;
  }
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
