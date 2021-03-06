import React from "react";
import styled from "styled-components";
import { ArtistPlaceholder } from "../../assets/placeholders";
import { logout } from "../../spotify/auth";

type Props = {
  image: string;
  name: string;
  followerCount?: number;
  followingCount?: number;
  playlistCount?: number;
};

const UserSummary = (props: Props) => {
  const { image, name, followerCount, followingCount, playlistCount } = props;

  return (
    <UserSummaryWrapper>
      {image ? (
        <UserImage src={image} height={128} width={128} alt="" loading="lazy" />
      ) : (
        <ArtistPlaceholder />
      )}
      <UserName>{name}</UserName>
      <UserStats>
        <StatItem>
          <StatValue>{followerCount ? followerCount : 0}</StatValue> followers
        </StatItem>
        <StatItem>
          <StatValue>{followingCount ? followingCount : 0}</StatValue> following
        </StatItem>
        <StatItem>
          <StatValue>{playlistCount ? playlistCount : 0}</StatValue> playlists
        </StatItem>
      </UserStats>
      <LogoutButton onClick={logout}>Logout</LogoutButton>
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
  margin-top: 16px;
`;

const UserStats = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StatItem = styled.small`
  text-transform: uppercase;
  margin-left: 8px;
  margin-right: 8px;
`;

const StatValue = styled.span`
  color: ${({ theme }) => theme.colors.white};
  font-weight: 700;
`;

const LogoutButton = styled.button`
  background-color: transparent;
  border: 1px solid currentColor;
  border-radius: 20px;
  font-weight: 600;
  margin-top: 16px;
  padding: 2px 12px;
  color: ${({ theme }) => theme.font.text};
  transition: color 0.2s ease;

  :hover {
    color: ${({ theme }) => theme.colors.white};
  }
`;

export default UserSummary;
