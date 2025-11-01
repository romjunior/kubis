import { useState, useEffect } from 'react';
import { Container } from './styled/Container';
import Header from './Header';
import TabNavigation from './TabNavigation';
import TabContent from './TabContent';
import contextManager from '../core/context-manager.js';

export default function App() {
  const [contexts, setContexts] = useState([]);
  const [selectedContext, setSelectedContext] = useState('');
  const [clusters, setClusters] = useState([]);
  const [selectedCluster, setSelectedCluster] = useState('');
  const [clusterContexts, setClusterContexts] = useState([]);
  const [isClusterMode, setIsClusterMode] = useState(false);
  const [activeTab, setActiveTab] = useState('pods');

  useEffect(() => {
    loadContexts();
    loadClusters();
  }, []);

  useEffect(() => {
    if (selectedCluster && isClusterMode) {
      loadClusterContexts(selectedCluster);
    }
  }, [selectedCluster, isClusterMode]);

  const loadContexts = async () => {
    try {
      const ctxList = await window.kubectlAPI.getContexts();
      setContexts(ctxList);
      if (ctxList.length > 0 && !isClusterMode) {
        setSelectedContext(ctxList[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar contextos:', error);
    }
  };

  const loadClusters = async () => {
    try {
      const savedClusters = await window.clustersAPI.getAll();
      setClusters(savedClusters);
    } catch (error) {
      console.error('Erro ao carregar clusters:', error);
    }
  };

  const loadClusterContexts = async (clusterName) => {
    try {
      console.log('Carregando contextos para cluster:', clusterName);
      const ctxList = await window.kubectlAPI.getContextsForCluster(clusterName);
      console.log('Contextos encontrados:', ctxList);
      setClusterContexts(ctxList);
      contextManager.setClusterContexts(ctxList);
    } catch (error) {
      console.error('Erro ao carregar contextos do cluster:', error);
    }
  };

  const handleContextChange = async (context) => {
    setSelectedContext(context);
    contextManager.setSelectedContext(context);
    try {
      await window.kubectlAPI.setContext(context);
    } catch (error) {
      console.error('Erro ao alterar contexto:', error);
    }
  };

  const handleClusterChange = (cluster) => {
    setSelectedCluster(cluster);
    contextManager.setSelectedCluster(cluster);
    setSelectedContext('');
    setClusterContexts([]);
    if (cluster) {
      loadClusterContexts(cluster);
    }
  };

  const handleModeChange = (clusterMode) => {
    setIsClusterMode(clusterMode);
    contextManager.setMode(clusterMode);
    setSelectedContext('');
    setSelectedCluster('');
    setClusterContexts([]);
    if (clusterMode) {
      loadClusters();
    }
  };

  return (
    <Container>
      <Header 
        contexts={contexts}
        selectedContext={selectedContext}
        onContextChange={handleContextChange}
        clusters={clusters}
        selectedCluster={selectedCluster}
        onClusterChange={handleClusterChange}
        clusterContexts={clusterContexts}
        isClusterMode={isClusterMode}
        onModeChange={handleModeChange}
      />
      <TabNavigation 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <TabContent 
        activeTab={activeTab}
        selectedContext={selectedContext}
        isClusterMode={isClusterMode}
        clusterContexts={clusterContexts}
        selectedCluster={selectedCluster}
      />
    </Container>
  );
}