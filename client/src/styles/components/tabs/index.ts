import styled from "styled-components";
import { overflowNoScrollbar } from "../../utils";
import { Section } from "../section";

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const TabHeader = styled.ul`
  display: flex;
  list-style: none;
  position: fixed;
  z-index: 5;
  margin: -16px;
  padding: 16px;
  background-color: ${({ theme }) => theme.bg.main};
  border-bottom: 1px solid #21242f;
  width: 100%;
`;

export const Tab = styled.button<{ $isActive: boolean }>`
  background-color: ${({ $isActive }) =>
    $isActive ? "#21242f" : "transparent"};
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.font.title : "currentColor"};
  font-size: 14px;
  border: 0;
  border-radius: 4px;
  padding: 4px 16px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  :not(:first-of-type) {
    margin-left: 16px;
  }
`;

export const TabView = styled(Section)`
  flex: 2 1 auto;
  height: 100%;
  margin-bottom: -16px;
  padding-top: 16px;
  padding-bottom: 16px;
  ${overflowNoScrollbar}
  overflow-x: hidden;
`;
