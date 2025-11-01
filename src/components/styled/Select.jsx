import styled from 'styled-components';

export const Select = styled.select`
  min-width: 200px;
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  font-size: 14px;
  outline: none;

  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }

  &:focus {
    border-color: #90caf9;
  }

  option {
    background-color: #1976d2;
    color: white;
  }
`;

export const Label = styled.label`
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.87);
`;