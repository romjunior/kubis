import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import contextManager from '../core/context-manager.js';
import ErrorState from './ErrorState.jsx';

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  margin: 0;
  color: #333;
`;

const NamespaceSelect = styled.select`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const SearchInput = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
  width: 200px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Th = styled.th`
  background: #f5f5f5;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  border-bottom: 1px solid #ddd;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #eee;
`;

const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case 'Running': return '#d4edda';
      case 'Pending': return '#fff3cd';
      case 'Failed': return '#f8d7da';
      default: return '#e2e3e5';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'Running': return '#155724';
      case 'Pending': return '#856404';
      case 'Failed': return '#721c24';
      default: return '#383d41';
    }
  }};
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
`;

const PodsList = () => {
  const [pods, setPods] = useState([]);
  const [filteredPods, setFilteredPods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [namespace, setNamespace] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [contextState, setContextState] = useState(contextManager.getCurrentSelection());

  useEffect(() => {
    const unsubscribe = contextManager.subscribe(setContextState);
    return unsubscribe;
  }, []);

  useEffect(() => {
    loadPods();
  }, [contextState, namespace]);

  useEffect(() => {
    const filtered = pods.filter(pod => 
      pod.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPods(filtered);
  }, [pods, searchTerm]);

  const loadPods = async () => {
    if (!contextState.activeContexts.length) return;
    
    setLoading(true);
    setError(null);
    try {
      const result = await window.kubectlAPI.getPods(
        contextState.isClusterMode,
        contextState.activeContexts,
        namespace
      );
      setPods(result);
    } catch (error) {
      setError({
        title: 'Erro ao carregar pods',
        message: error.message || 'Não foi possível carregar a lista de pods'
      });
      setPods([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNamespaceChange = (e) => {
    setNamespace(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Container>
      <Header>
        <Title>Pods</Title>
        <div>
          <SearchInput 
            type="text"
            placeholder="Pesquisar por nome..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <NamespaceSelect value={namespace} onChange={handleNamespaceChange}>
            <option value="">Todos os namespaces</option>
            <option value="default">default</option>
            <option value="kube-system">kube-system</option>
          </NamespaceSelect>
        </div>
      </Header>

      {error ? (
        <ErrorState 
          title={error.title}
          message={error.message}
          onRetry={loadPods}
        />
      ) : loading ? (
        <LoadingMessage>Carregando pods...</LoadingMessage>
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <Th>Nome</Th>
                <Th>Namespace</Th>
                <Th>Status</Th>
                <Th>Ready</Th>
                <Th>Restarts</Th>
                <Th>Age</Th>
                {contextState.isClusterMode && <Th>Context</Th>}
              </tr>
            </thead>
            <tbody>
              {filteredPods.map((pod, index) => (
                <tr key={`${pod.context}-${pod.namespace}-${pod.name}`}>
                  <Td>{pod.name}</Td>
                  <Td>{pod.namespace}</Td>
                  <Td>
                    <StatusBadge status={pod.status}>
                      {pod.status}
                    </StatusBadge>
                  </Td>
                  <Td>{pod.ready}</Td>
                  <Td>{pod.restarts}</Td>
                  <Td>{pod.age}</Td>
                  {contextState.isClusterMode && <Td>{pod.context}</Td>}
                </tr>
              ))}
            </tbody>
          </Table>

          {filteredPods.length === 0 && pods.length > 0 && (
            <LoadingMessage>Nenhum pod encontrado com o termo "{searchTerm}"</LoadingMessage>
          )}

          {pods.length === 0 && (
            <LoadingMessage>Nenhum pod encontrado</LoadingMessage>
          )}
        </>
      )}
    </Container>
  );
};

export default PodsList;