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

export default function TabContent({ activeTab, selectedContext }) {
  if (!selectedContext) {
    return (
      <Content>
        <Paper>
          <EmptyState>
            <h3>Nenhum contexto selecionado</h3>
            <p>Selecione um contexto do Kubernetes para visualizar os recursos</p>
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
          <p>Contexto ativo: <strong>{selectedContext}</strong></p>
        </EmptyState>
      </Paper>
    </Content>
  );
}