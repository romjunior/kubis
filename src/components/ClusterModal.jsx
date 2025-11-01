import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ModalOverlay, ModalContent, ModalHeader, ModalTitle, CloseButton } from './styled/Modal';

const Button = styled.button`
  background: #1976d2;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 8px;

  &:hover {
    background: #1565c0;
  }
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
`;

const ClusterCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  background: #f9f9f9;
`;

const ContextTag = styled.span`
  background: #e3f2fd;
  color: #1976d2;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  margin-right: 4px;
`;

const TwoColumnLayout = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

const Column = styled.div`
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 12px;
`;

const ColumnTitle = styled.h4`
  margin: 0 0 12px 0;
  text-align: center;
`;

const ContextList = styled.div`
  max-height: 200px;
  overflow-y: auto;
`;

const ContextItem = styled.div`
  padding: 6px 8px;
  margin: 2px 0;
  background: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  
  &:hover {
    background: #e0e0e0;
  }
`;

const TransferButtons = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  padding: 0 10px;
`;

const TransferButton = styled.button`
  background: #666;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  
  &:hover {
    background: #555;
  }
`;

const ClusterModal = ({ isOpen, onClose }) => {
  const [clusters, setClusters] = useState([]);
  const [contexts, setContexts] = useState([]);
  const [newClusterName, setNewClusterName] = useState('');
  const [selectedContexts, setSelectedContexts] = useState([]);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      const [clustersData, contextsData] = await Promise.all([
        window.clustersAPI.getAll(),
        window.kubectlAPI.getContexts()
      ]);
      setClusters(clustersData);
      setContexts(contextsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const createCluster = async () => {
    if (!newClusterName.trim() || selectedContexts.length === 0) return;

    const newCluster = {
      id: Date.now().toString(),
      name: newClusterName,
      contexts: selectedContexts
    };

    const updatedClusters = [...clusters, newCluster];
    setClusters(updatedClusters);
    await window.clustersAPI.save(updatedClusters);
    
    setNewClusterName('');
    setSelectedContexts([]);
  };

  const deleteCluster = async (clusterId) => {
    const updatedClusters = clusters.filter(c => c.id !== clusterId);
    setClusters(updatedClusters);
    await window.clustersAPI.save(updatedClusters);
  };

  const moveToSelected = (contextName) => {
    if (!selectedContexts.includes(contextName)) {
      setSelectedContexts(prev => [...prev, contextName]);
    }
  };

  const removeFromSelected = (contextName) => {
    setSelectedContexts(prev => prev.filter(c => c !== contextName));
  };

  const availableContexts = contexts.filter(ctx => !selectedContexts.includes(ctx));

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Gerenciar Clusters</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>
        
        <div style={{ marginBottom: '20px', padding: '12px', border: '1px solid #ddd', borderRadius: '6px' }}>
          <h4 style={{ margin: '0 0 12px 0' }}>Criar Novo Cluster</h4>
          <div style={{ marginBottom: '16px' }}>
            <Input
              type="text"
              placeholder="Nome do cluster"
              value={newClusterName}
              onChange={(e) => setNewClusterName(e.target.value)}
            />
          </div>
          
          <TwoColumnLayout>
            <Column>
              <ColumnTitle>Contextos Disponíveis</ColumnTitle>
              <ContextList>
                {availableContexts.map(context => (
                  <ContextItem key={context} onClick={() => moveToSelected(context)}>
                    {context}
                  </ContextItem>
                ))}
              </ContextList>
            </Column>
            
            <TransferButtons>
              <TransferButton onClick={() => {
                availableContexts.forEach(ctx => moveToSelected(ctx));
              }}>»</TransferButton>
              <TransferButton onClick={() => {
                selectedContexts.forEach(ctx => removeFromSelected(ctx));
              }}>«</TransferButton>
            </TransferButtons>
            
            <Column>
              <ColumnTitle>Contextos Selecionados</ColumnTitle>
              <ContextList>
                {selectedContexts.map(context => (
                  <ContextItem key={context} onClick={() => removeFromSelected(context)}>
                    {context}
                  </ContextItem>
                ))}
              </ContextList>
            </Column>
          </TwoColumnLayout>
          
          <Button onClick={createCluster}>Criar Cluster</Button>
        </div>

        <div>
          <h4>Clusters ({clusters.length})</h4>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {clusters.length === 0 ? (
              <p>Nenhum cluster configurado</p>
            ) : (
              clusters.map(cluster => (
                <ClusterCard key={cluster.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>{cluster.name}</strong>
                    <Button onClick={() => deleteCluster(cluster.id)}>Excluir</Button>
                  </div>
                  <div style={{ marginTop: '8px' }}>
                    {cluster.contexts.map(contextName => (
                      <ContextTag key={contextName}>{contextName}</ContextTag>
                    ))}
                  </div>
                </ClusterCard>
              ))
            )}
          </div>
        </div>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ClusterModal;