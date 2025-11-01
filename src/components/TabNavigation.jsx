import { TabsContainer, TabsList, Tab } from './styled/Tabs';

const tabs = [
  { id: 'pods', label: '🟢 Pods' },
  { id: 'services', label: '🔗 Services' },
  { id: 'deployments', label: '🚀 Deployments' },
  { id: 'configmaps', label: '⚙️ ConfigMaps' },
  { id: 'secrets', label: '🔐 Secrets' },
  { id: 'nodes', label: '🖥️ Nodes' },
  { id: 'namespaces', label: '📁 Namespaces' }
];

export default function TabNavigation({ activeTab, onTabChange }) {
  return (
    <TabsContainer>
      <TabsList>
        {tabs.map(tab => (
          <Tab
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </Tab>
        ))}
      </TabsList>
    </TabsContainer>
  );
}