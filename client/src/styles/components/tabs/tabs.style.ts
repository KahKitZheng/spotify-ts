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
  align-items: center;
  justify-content: space-between;
  list-style: none;
  margin: calc(var(--layout-padding) * -1) calc(var(--layout-padding) * -1);
  padding: 16px var(--layout-padding);
  background-color: ${({ theme }) => theme.bg.main};
  border-bottom: 1px solid #21242f;
`;

export const Tab = styled.button<{ $isActive?: boolean }>`
  background-color: ${({ $isActive }) =>
    $isActive ? "#21242f" : "transparent"};
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.font.title : "currentColor"};
  font-size: 14px;
  font-weight: 700;
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
  margin-bottom: calc(var(--layout-padding) * -1);
  margin-left: calc(var(--layout-padding) * -1);
  margin-right: calc(var(--layout-padding) * -1);
  padding: var(--layout-padding);
  ${overflowNoScrollbar}
  overflow-x: hidden;
`;
