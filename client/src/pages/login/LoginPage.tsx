import React from "react";
import styled from "styled-components";
import { MEDIA } from "../../styles/media";
import { BsSpotify } from "react-icons/bs";

const LoginPage = () => {
  const SIGN_IN_URI =
    import.meta.env.NODE_ENV !== "production"
      ? "http://localhost:8888/login"
      : "https://spotify-ts-server.vercel.app/login";

  return (
    <LoginPageWrapper>
      <div>
        <Title>
          Spotify-TS <BsSpotify />
        </Title>
        <Description>
          Yet another Spotify clone on the web. The biggest difference is that
          it has almost all of the core features implemented. This includes
          playing songs with the Spotify Web Playback SDK, creating playlists,
          saving songs and etc. Furthermore it is created with both mobile and
          desktop viewport in mind.
        </Description>
        <TechnologyListWrapper>
          <TechnologyListTitle>
            This application is built with:
          </TechnologyListTitle>
          <TechnologyList>
            <TechnologyListItem>Create React App</TechnologyListItem>
            <TechnologyListItem>TypeScript</TechnologyListItem>
            <TechnologyListItem>Redux Toolkit</TechnologyListItem>
            <TechnologyListItem>styled-components</TechnologyListItem>
            <TechnologyListItem>Spotify Web API</TechnologyListItem>
            <TechnologyListItem>Spotify Web Playback SDK</TechnologyListItem>
          </TechnologyList>
        </TechnologyListWrapper>
      </div>
      <Footer>
        <div>
          <SignInLink href={SIGN_IN_URI}>login</SignInLink>
          <PermissionNote>
            *Permissions from this app can always be revoked from your{" "}
            <a href="https://www.spotify.com/us/account/overview/">
              Spotify account
            </a>
            .
          </PermissionNote>
        </div>
        <FooterLinks>
          <a href="">Made by Kah Kit Zheng</a>
          <a href="https://github.com/KahKitZheng/spotify-ts">Github</a>
        </FooterLinks>
      </Footer>
    </LoginPageWrapper>
  );
};

const LoginPageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  margin: auto;
  max-width: 700px;
  padding: 2rem;
  transition: all 0.4s ease;
  flex: 1;

  @media (min-width: ${MEDIA.tablet}) {
    padding: 4rem;
  }
`;

const Title = styled.h1`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  font-size: clamp(2rem, 3rem, 5vw);

  svg {
    margin-left: 12px;
    fill: ${({ theme }) => theme.colors.spotify};
  }
`;

const Description = styled.p`
  margin: 8px 0;
`;

const TechnologyListWrapper = styled.div`
  margin: 24px 0;
`;

const TechnologyListTitle = styled.h2`
  font-size: 18px;
`;

const TechnologyList = styled.ul`
  margin: 0;
  padding: 4px 28px 0;
`;

const TechnologyListItem = styled.li`
  font-size: 14px;
  padding: 2px 0;
`;

const SignInLink = styled.a`
  border: 0;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.spotify};
  color: ${({ theme }) => theme.colors.black};
  font-weight: 700;
  text-transform: uppercase;
  display: block;
  text-align: center;
  margin-top: 32px;
  padding: 6px 20px;

  :hover {
    text-decoration: none;
  }
`;

const PermissionNote = styled.small`
  display: block;
  width: 100%;
  color: #878b8d;
  border-top: 1px solid #434a4d;
  margin-top: 12px;
  padding: 8px;
  text-align: center;

  a {
    font-weight: 600;
  }
`;

const Footer = styled.footer`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const FooterLinks = styled.footer`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2rem;
  font-size: 14px;
`;

export default LoginPage;
