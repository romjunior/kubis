import { Content } from './styled/Container';
import { Paper, EmptyState } from './styled/Paper';

const tabs = [
  { id: 'pods', label: '🟢 Pods' },
  { id: 'services', label: '🔗 Services' },
  { id: 'deployments', label: '🚀 Deployments' },
  { id: 'configmaps', label: '⚙️ ConfigMaps' },
  { id: 'secrets', label: '🔐 Secrets' },
  { id: 'nodes', label: '🖥️ Nodes' },
  { id: 'namespaces', label: '📁 Namespaces' }
];

export default function TabContent({ activeTab, selectedContext, isClusterMode, clusterContexts, selectedCluster }) {
  
  const hasActiveSelection = isClusterMode ? true : selectedContext;
  
  if (!hasActiveSelection) {
    return (
      <Content>
        <Paper>
          <EmptyState>
            <h3>{isClusterMode ? 'Nenhum cluster selecionado' : 'Nenhum contexto selecionado'}</h3>
            <p>{isClusterMode ? 'Selecione um cluster para visualizar os recursos' : 'Selecione um contexto do Kubernetes para visualizar os recursos'}</p>
          </EmptyState>
        </Paper>
      </Content>
    );
  }

  return (
    <Content>
      <Paper>
        <EmptyState>
          <h3>{tabs.find(t => t.id === activeTab)?.label}</h3>
          <p>Implementação em desenvolvimento...</p>
          {isClusterMode ? (
            <div>
              <p>Contextos do cluster:</p>
              {clusterContexts && clusterContexts.length > 0 ? (
                <ul>
                  {clusterContexts.map(ctx => (
                    <li key={ctx}><strong>{ctx}</strong></li>
                  ))}
                </ul>
              ) : selectedCluster ? (
                <p>Nenhum contexto encontrado para este cluster</p>
              ) : (
                <p>Selecione um cluster</p>
              )}
            </div>
          ) : (
            <p>Contexto ativo: <strong>{selectedContext}</strong></p>
          )}
        </EmptyState>
      </Paper>
    </Content>
  );
}