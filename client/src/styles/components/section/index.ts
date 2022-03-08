import styled from "styled-components";
import { Link } from "react-router-dom";

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  margin-top: 32px;
`;

export const SectionName = styled.h2`
  width: fit-content;
`;

export const SectionLink = styled(Link)`
  font-weight: 700;
  font-size: 24px;
  width: fit-content;
`;
