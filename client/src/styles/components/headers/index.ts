import styled from "styled-components";

export const HeaderWrapper = styled.div<{ $bgGradient: string }>`
  margin: -16px;
  padding: 16px;
  background: ${({ theme }) => theme.bg.main};
  background: ${({ theme, $bgGradient }) =>
    `linear-gradient(180deg, ${$bgGradient}, ${theme.bg.main} 90%)`};
`;

export const Thumbnail = styled.img`
  height: 160px;
  width: 160px;
  margin: 24px auto 32px;
  box-shadow: 0 0 32px rgba(0, 0, 0, 0.5);
`;

export const HeaderName = styled.h1`
  font-size: 22px;
  line-height: 1.2;
  margin-top: 4px;
`;

export const HeaderStats = styled.p`
  opacity: 0.8;
  font-size: 14px;
  margin-bottom: 4px;
`;
