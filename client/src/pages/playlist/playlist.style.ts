import styled from "styled-components";
import { MEDIA } from "../../styles/media";

export const PlaylistDiscovery = styled.section`
  position: relative;
  margin: 64px 0 32px;
`;

export const PlaylistDiscoveryHeaderWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

export const PlaylistDiscoveryName = styled.h2`
  font-size: 20px;
  line-height: 1.2;

  @media (min-width: ${MEDIA.tablet}) {
    font-size: revert;
  }
`;

export const TracklistWrapper = styled.div`
  min-height: 640px;
`;

export const ToggleDiscovery = styled.button<{ $hide?: boolean }>`
  display: ${({ $hide }) => $hide && "none"};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.white};
  border: 0;
  margin-left: 16px;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 14px;
  cursor: pointer;

  @media (max-width: ${MEDIA.tablet}) {
    display: none;
  }
`;

export const RefreshButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 24px;
  margin-right: 10px;
`;

export const RefreshButton = styled.button`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.white};
  border: 0;
  text-transform: uppercase;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.1s ease-in;
`;

export const SearchInput = styled.input`
  margin-top: 12px;
  padding: 4px 8px;
  width: 100%;
  max-width: 400px;
  border-radius: 4px;
  background-color: #222328;
  border: 0;
  color: ${({ theme }) => theme.font.text};

  :active,
  :focus {
    outline: 1px solid #464646;
  }
`;
