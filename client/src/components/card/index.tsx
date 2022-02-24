import React from "react";
import styled from "styled-components";

type Props = {
  imgSource: string;
  title?: string;
  undertitle: string;
  isArtist?: boolean;
};

const Card = ({ imgSource, title, undertitle, isArtist = false }: Props) => {
  return (
    <CardWrapper>
      <CardCover src={imgSource} alt="" $isArtist={isArtist} />
      <CardTitle>{title}</CardTitle>
      <CardUndertitle dangerouslySetInnerHTML={{ __html: undertitle }} />
    </CardWrapper>
  );
};
const CardWrapper = styled.div`
  background-color: #1d1e2d;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s cubic-bezier(0.47, 0, 0.745, 0.715);

  &:hover {
    background-color: #33344d;
  }
`;

const CardCover = styled.img<{ $isArtist: boolean }>`
  aspect-ratio: 1 / 1;
  object-fit: cover;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  border-radius: ${({ $isArtist }) => $isArtist && "50%"};
`;

const CardTitle = styled.p`
  display: block;
  margin-top: 16px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-weight: 700;
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

  a {
    color: currentColor;
  }
`;

export default Card;
