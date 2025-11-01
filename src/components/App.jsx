import { useState, useEffect } from 'react';
import { Container } from './styled/Container';
import Header from './Header';
import TabNavigation from './TabNavigation';
import TabContent from './TabContent';

export default function App() {
  const [contexts, setContexts] = useState([]);
  const [selectedContext, setSelectedContext] = useState('');
  const [activeTab, setActiveTab] = useState('pods');

  useEffect(() => {
    loadContexts();
  }, []);

  const loadContexts = async () => {
    try {
      const ctxList = await window.kubectlAPI.getContexts();
      setContexts(ctxList);
      if (ctxList.length > 0) {
        setSelectedContext(ctxList[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar contextos:', error);
    }
  };

  const handleContextChange = async (context) => {
    setSelectedContext(context);
    try {
      await window.kubectlAPI.setContext(context);
    } catch (error) {
      console.error('Erro ao alterar contexto:', error);
    }
  };

  return (
    <Container>
      <Header 
        contexts={contexts}
        selectedContext={selectedContext}
        onContextChange={handleContextChange}
      />
      <TabNavigation 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <TabContent 
        activeTab={activeTab}
        selectedContext={selectedContext}
      />
    </Container>
  );
}