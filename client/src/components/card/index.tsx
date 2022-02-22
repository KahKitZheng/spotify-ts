import React from "react";
import styled from "styled-components";

type Props = {
  imgSource: string;
  title?: string;
  undertitle: string;
};

const Card = (props: Props) => {
  return (
    <CardWrapper>
      <CardCover src={props.imgSource} alt="" />
      <CardTitle>{props.title}</CardTitle>
      <CardUndertitle>{props.undertitle}</CardUndertitle>
    </CardWrapper>
  );
};
const CardWrapper = styled.div`
  background-color: #1b1b26;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const CardCover = styled.img`
  aspect-ratio: 1 / 1;
  object-fit: cover;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const CardTitle = styled.p`
  display: block;
  margin-top: 16px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-weight: 600;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.white};
`;

const CardUndertitle = styled.small`
  display: block;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

  @supports (-webkit-line-clamp: 2) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: initial;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
`;

export default Card;
