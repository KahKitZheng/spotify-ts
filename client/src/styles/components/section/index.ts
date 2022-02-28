import { Link } from "react-router-dom";
import styled from "styled-components";

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  margin-top: 32px;
`;

export const SectionName = styled.h2`
  margin-bottom: 8px;
  width: fit-content;
`;

export const SectionLink = styled(Link)`
  font-weight: 700;
  font-size: 24px;
  margin-bottom: 8px;
  width: fit-content;
`;
