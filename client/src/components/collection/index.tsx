import React from "react";
import styled from "styled-components";

type Props = {
  title: string;
  children: React.ReactNode;
};

const Collection = (props: Props) => {
  return (
    <CollectionWrapper>
      <CollectionTitle>{props.title}</CollectionTitle>
      <CollectionGrid>{props.children}</CollectionGrid>
    </CollectionWrapper>
  );
};

const CollectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 32px;
`;

const CollectionTitle = styled.h2`
  margin-bottom: 8px;
`;

const CollectionGrid = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: repeat(10, minmax(11rem, 1fr));
  grid-gap: 16px;
  overflow-x: auto;
  margin-left: -16px;
  margin-right: -16px;
  padding: 4px 16px 8px;

  &::-webkit-scrollbar {
    width: 0;
  }
`;

export default Collection;
