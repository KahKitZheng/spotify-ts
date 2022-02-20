import React from "react";
import styled from "styled-components";

type Props = {
  image: string;
  name: string;
  followerCount: number;
  followingCount: number;
  playlistCount: number;
};

const UserSummary = (props: Props) => {
  const { image, name, followerCount, followingCount, playlistCount } = props;

  return (
    <UserSummaryWrapper>
      <UserImage src={image} height={128} width={128} alt="" />
      <UserName>{name}</UserName>
      <UserStats>
        <StatItem>
          <StatValue>{followerCount}</StatValue> followers
        </StatItem>
        <StatItem>
          <StatValue>{followingCount}</StatValue> following
        </StatItem>
        <StatItem>
          <StatValue>{playlistCount}</StatValue> playlists
        </StatItem>
      </UserStats>
    </UserSummaryWrapper>
  );
};

const UserSummaryWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 16px;
  margin-bottom: 16px;
`;

const UserImage = styled.img`
  border-radius: 50%;
`;

const UserName = styled.h1`
  color: ${({ theme }) => theme.colors.white};
  margin-top: 16px;
`;

const UserStats = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StatItem = styled.p`
  text-transform: uppercase;
  margin-left: 8px;
  margin-right: 8px;
`;

const StatValue = styled.span`
  color: ${({ theme }) => theme.colors.white};
  font-weight: 700;
`;

export default UserSummary;
