import { useState } from 'react';
import { AppBar, Title, Toolbar } from './styled/AppBar';
import { Select, Label } from './styled/Select';
import ClusterModal from './ClusterModal';
import styled from 'styled-components';

const ClusterButton = styled.button`
  background: #1976d2;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 12px;
  font-size: 12px;

  &:hover {
    background: #1565c0;
  }
`;

export default function Header({ contexts, selectedContext, onContextChange }) {
  const [showClusterModal, setShowClusterModal] = useState(false);

  return (
    <>
      <AppBar>
        <Title>🚢 Kubis</Title>
        <Toolbar>
          <Label>Contexto:</Label>
          <Select 
            value={selectedContext} 
            onChange={(e) => onContextChange(e.target.value)}
          >
            <option value="">Selecione um contexto</option>
            {contexts.map(ctx => (
              <option key={ctx} value={ctx}>{ctx}</option>
            ))}
          </Select>
          <ClusterButton onClick={() => setShowClusterModal(true)}>
            🏗️ Clusters
          </ClusterButton>
        </Toolbar>
      </AppBar>
      
      <ClusterModal 
        isOpen={showClusterModal}
        onClose={() => setShowClusterModal(false)}
      />
    </>
  );
}