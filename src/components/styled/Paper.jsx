import styled from 'styled-components';

export const Paper = styled.div`
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 2px;
  padding: ${props => props.padding || '16px'};
  margin: ${props => props.margin || '0'};
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: rgba(0, 0, 0, 0.6);
  
  h3 {
    margin: 0 0 16px 0;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-size: 20px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.87);
  }

  p {
    margin: 8px 0;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-size: 14px;
    line-height: 1.43;
  }

  strong {
    color: #1976d2;
    font-weight: 500;
  }
`;