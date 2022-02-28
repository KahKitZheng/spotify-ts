import React from "react";
import styled from "styled-components";
import { textOverflow } from "../../styles/utils";
import { Link } from "react-router-dom";

type Props = {
  imgSource: string;
  title?: string;
  undertitle: string;
  isArtist?: boolean;
  link?: string;
};

const Card = (props: Props) => {
  const { imgSource, title, undertitle, isArtist = false, link } = props;

  return (
    <LinkWrapper to={link || ""}>
      <CardWrapper>
        <CardCover src={imgSource} alt="" $isArtist={isArtist} />
        <CardTitle>{title}</CardTitle>
        <CardUndertitle dangerouslySetInnerHTML={{ __html: undertitle }} />
      </CardWrapper>
    </LinkWrapper>
  );
};

const LinkWrapper = styled(Link)`
  :hover,
  :focus,
  :active {
    text-decoration: none;
  }
`;

const CardWrapper = styled.div`
  height: 100%;
  background-color: #1d1d25;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s cubic-bezier(0.47, 0, 0.745, 0.715);

  &:hover {
    background-color: #272c33;
  }
`;

const CardCover = styled.img<{ $isArtist: boolean }>`
  aspect-ratio: 1 / 1;
  width: 100%;
  object-fit: cover;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  border-radius: ${({ $isArtist }) => $isArtist && "50%"};
`;

const CardTitle = styled.p`
  display: block;
  margin-top: 16px;
  font-weight: 700;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.white};
  ${textOverflow(1)};
`;

const CardUndertitle = styled.small`
  display: block;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.font.text};
  ${textOverflow(2)};

  a {
    color: currentColor;
  }
`;

export default Card;
