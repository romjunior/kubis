import styled from 'styled-components';

export const TabsContainer = styled.div`
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
`;

export const TabsList = styled.div`
  display: flex;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Tab = styled.button`
  min-width: 160px;
  padding: 12px 24px;
  border: none;
  background: ${props => props.active ? '#f5f5f5' : 'transparent'};
  color: ${props => props.active ? '#1976d2' : 'rgba(0, 0, 0, 0.6)'};
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  font-size: 14px;
  font-weight: ${props => props.active ? '500' : '400'};
  text-transform: uppercase;
  letter-spacing: 0.02857em;
  cursor: pointer;
  position: relative;
  white-space: nowrap;
  
  &:hover {
    background-color: #f5f5f5;
    color: #1976d2;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #1976d2;
    opacity: ${props => props.active ? '1' : '0'};
  }
`;