import styled from 'styled-components';

export const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 16px;
`;

export const SwitchLabel = styled.span`
  font-size: 12px;
  color: #666;
  font-weight: 500;
`;

export const SwitchToggle = styled.div`
  position: relative;
  width: 50px;
  height: 24px;
  background: ${props => props.checked ? '#4caf50' : '#666'};
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.3s;
  border: 2px solid ${props => props.checked ? '#4caf50' : '#666'};

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.checked ? '26px' : '2px'};
    width: 16px;
    height: 16px;
    background: white;
    border-radius: 50%;
    transition: left 0.3s;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
`;

export const SwitchOption = styled.span`
  font-size: 11px;
  color: ${props => props.active ? '#fff' : '#bbb'};
  font-weight: ${props => props.active ? '600' : '400'};
`;