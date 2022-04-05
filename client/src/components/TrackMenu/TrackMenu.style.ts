import styled from "styled-components";
import { Link } from "react-router-dom";
import { MEDIA } from "../../styles/media";
import { overflowNoScrollbar, textOverflow } from "../../styles/utils";

export const TrackOptionsWrapper = styled.button`
  visibility: visible;
  background-color: transparent;
  color: ${({ theme }) => theme.font.text};
  border: 0;
  padding: 0 0 0 16px;
  font-weight: 600;
  cursor: pointer;

  @media (min-width: ${MEDIA.tablet}) {
    visibility: hidden;
  }
`;

export const OptionsList = styled.ul`
  background-color: #262a35;
  color: currentColor;
  box-shadow: 0 2px 4px 2px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  list-style: none;
  margin: 0;
  padding: 4px;
`;

export const PlaylistOptionList = styled(OptionsList)`
  max-height: 50vh;
  max-width: 200px;
  overflow: auto;
  ${overflowNoScrollbar};
`;

export const OptionItemWrapper = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${({ theme }) => theme.font.text};

  :hover {
    background-color: #20222c;
    color: ${({ theme }) => theme.colors.white};
  }
`;

export const OptionItemButton = styled.button<{ $borderSide?: string }>`
  background-color: transparent;
  color: currentColor;
  border: 0;
  padding: 12px;
  cursor: pointer;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  position: relative;
  text-overflow: ellipsis;

  ::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    ${({ $borderSide }) => $borderSide && ` ${$borderSide}: 0`};
    ${({ $borderSide }) =>
      $borderSide && ` border-${$borderSide}: 1px solid #394046`};
  }
`;

export const MoreOptionIcon = styled.span`
  display: inline-block;
  font-size: 24px;
`;

export const OptionLink = styled(Link)`
  color: ${({ theme }) => theme.font.text};
  display: inline-block;
  width: 100%;
  padding: 12px;
  ${textOverflow(1)};

  :hover {
    color: ${({ theme }) => theme.colors.white};
    text-decoration: none;
  }
`;
