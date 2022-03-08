import styled from "styled-components";

export const HeaderWrapper = styled.div<{ $bgGradient: string }>`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: -16px;
  padding: 32px 16px 16px;
  background: ${({ theme }) => theme.bg.main};
  background: ${({ theme, $bgGradient }) =>
    `linear-gradient(180deg, ${$bgGradient}, ${theme.bg.main} 90%)`};

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: end;
    justify-content: start;
  }
`;

export const Thumbnail = styled.img`
  height: 160px;
  width: 160px;
  object-fit: cover;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 32px;
  box-shadow: 0 0 32px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease-in-out;

  @media (min-width: 768px) {
    height: 200px;
    width: 200px;
    margin-left: revert;
    margin-right: 24px;
    margin-bottom: 0;
  }
`;

export const HeaderExtraInfo = styled.span`
  display: block;
  font-size: 14px;
  color: #e7e7e7;
`;

export const HeaderName = styled.h1`
  font-size: clamp(22px, 1rem + 2vw, 3rem);
  line-height: 1.2;
`;

export const HeaderStats = styled.p`
  font-size: 14px;
  margin-top: 4px;
  color: #e7e7e7;
`;
