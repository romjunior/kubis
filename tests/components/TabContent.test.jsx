import React from 'react';
import { render, screen } from '@testing-library/react';
import TabContent from '../../src/components/TabContent';

describe('TabContent Component', () => {
  test('should show empty state when no context selected', () => {
    render(<TabContent activeTab="pods" selectedContext="" />);

    expect(screen.getByText('Nenhum contexto selecionado')).toBeInTheDocument();
    expect(screen.getByText('Selecione um contexto do Kubernetes para visualizar os recursos')).toBeInTheDocument();
  });

  test('should render PodsList component for pods tab', () => {
    render(<TabContent activeTab="pods" selectedContext="test-context" />);

    expect(screen.getByText('Pods')).toBeInTheDocument();
  });

  test('should show correct tab label for non-pods tabs', () => {
    const tabs = [
      { id: 'services', label: '🔗 Services' },
      { id: 'deployments', label: '🚀 Deployments' },
      { id: 'configmaps', label: '⚙️ ConfigMaps' },
      { id: 'secrets', label: '🔐 Secrets' },
      { id: 'nodes', label: '🖥️ Nodes' },
      { id: 'namespaces', label: '📁 Namespaces' }
    ];

    tabs.forEach(tab => {
      const { rerender } = render(<TabContent activeTab={tab.id} selectedContext="test-context" />);
      
      expect(screen.getByText(tab.label)).toBeInTheDocument();
      
      rerender(<div />); // Clean up for next iteration
    });
  });

  test('should show development message for non-pods tabs', () => {
    render(<TabContent activeTab="services" selectedContext="my-cluster-context" />);

    expect(screen.getByText('my-cluster-context')).toBeInTheDocument();
    expect(screen.getByText('Implementação em desenvolvimento...')).toBeInTheDocument();
  });

  test('should handle null selectedContext', () => {
    render(<TabContent activeTab="pods" selectedContext={null} />);

    expect(screen.getByText('Nenhum contexto selecionado')).toBeInTheDocument();
  });

  test('should handle undefined selectedContext', () => {
    render(<TabContent activeTab="pods" selectedContext={undefined} />);

    expect(screen.getByText('Nenhum contexto selecionado')).toBeInTheDocument();
  });
});