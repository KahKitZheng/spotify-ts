import styled from "styled-components";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <PageWrapper>
      <Title>404</Title>
      <DescriptionWrapper>
        <Description>Page Not Found</Description>
        <ReturnLink to={`/`}>Return to home &#8594;</ReturnLink>
      </DescriptionWrapper>
    </PageWrapper>
  );
};

const PageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${({ theme }) => theme.colors.white};
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 900;
`;

const DescriptionWrapper = styled.div`
  margin-left: 16px;
  padding-left: 16px;
  border-left: 4px solid ${({ theme }) => theme.colors.white};
  font-weight: bold;
`;

const Description = styled.p`
  font-size: 24px;
  text-transform: uppercase;
`;

const ReturnLink = styled(Link)`
  color: mediumaquamarine;
  text-decoration: none;

  :hover {
    text-decoration: underline;
  }
`;

export default PageNotFound;
