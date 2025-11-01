import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ClusterModal from '../../src/components/ClusterModal';

// Mock das APIs
const mockClustersAPI = {
  getAll: jest.fn(),
  save: jest.fn()
};

const mockKubectlAPI = {
  getContexts: jest.fn()
};

// Mock do window
Object.defineProperty(window, 'clustersAPI', {
  value: mockClustersAPI,
  writable: true
});

Object.defineProperty(window, 'kubectlAPI', {
  value: mockKubectlAPI,
  writable: true
});

describe('ClusterModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockClustersAPI.getAll.mockResolvedValue([]);
    mockKubectlAPI.getContexts.mockResolvedValue(['context1', 'context2', 'context3']);
  });

  test('should not render when closed', () => {
    render(<ClusterModal isOpen={false} onClose={() => {}} />);
    
    expect(screen.queryByText('Gerenciar Clusters')).not.toBeInTheDocument();
  });

  test('should render when open', async () => {
    render(<ClusterModal isOpen={true} onClose={() => {}} />);
    
    expect(screen.getByText('Gerenciar Clusters')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nome do cluster')).toBeInTheDocument();
  });

  test('should load contexts and clusters on open', async () => {
    render(<ClusterModal isOpen={true} onClose={() => {}} />);
    
    await waitFor(() => {
      expect(mockKubectlAPI.getContexts).toHaveBeenCalled();
      expect(mockClustersAPI.getAll).toHaveBeenCalled();
    });
  });

  test('should display available contexts', async () => {
    render(<ClusterModal isOpen={true} onClose={() => {}} />);
    
    await waitFor(() => {
      expect(screen.getByText('context1')).toBeInTheDocument();
      expect(screen.getByText('context2')).toBeInTheDocument();
      expect(screen.getByText('context3')).toBeInTheDocument();
    });
  });

  test('should move context to selected when clicked', async () => {
    render(<ClusterModal isOpen={true} onClose={() => {}} />);
    
    await waitFor(() => {
      expect(screen.getByText('context1')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('context1'));
    
    // Verifica se o contexto aparece na coluna de selecionados
    const selectedColumn = screen.getByText('Contextos Selecionados').parentElement;
    expect(selectedColumn).toHaveTextContent('context1');
  });

  test('should create cluster with valid data', async () => {
    mockClustersAPI.save.mockResolvedValue(true);
    
    render(<ClusterModal isOpen={true} onClose={() => {}} />);
    
    await waitFor(() => {
      expect(screen.getByText('context1')).toBeInTheDocument();
    });
    
    // Preenche nome do cluster
    fireEvent.change(screen.getByPlaceholderText('Nome do cluster'), {
      target: { value: 'Test Cluster' }
    });
    
    // Seleciona um contexto
    fireEvent.click(screen.getByText('context1'));
    
    // Clica em criar
    fireEvent.click(screen.getByText('Criar Cluster'));
    
    await waitFor(() => {
      expect(mockClustersAPI.save).toHaveBeenCalledWith([
        expect.objectContaining({
          name: 'Test Cluster',
          contexts: ['context1']
        })
      ]);
    });
  });

  test('should not create cluster without name', async () => {
    render(<ClusterModal isOpen={true} onClose={() => {}} />);
    
    await waitFor(() => {
      expect(screen.getByText('context1')).toBeInTheDocument();
    });
    
    // Seleciona contexto mas não preenche nome
    fireEvent.click(screen.getByText('context1'));
    fireEvent.click(screen.getByText('Criar Cluster'));
    
    expect(mockClustersAPI.save).not.toHaveBeenCalled();
  });

  test('should not create cluster without contexts', async () => {
    render(<ClusterModal isOpen={true} onClose={() => {}} />);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Nome do cluster')).toBeInTheDocument();
    });
    
    // Preenche nome mas não seleciona contextos
    fireEvent.change(screen.getByPlaceholderText('Nome do cluster'), {
      target: { value: 'Test Cluster' }
    });
    fireEvent.click(screen.getByText('Criar Cluster'));
    
    expect(mockClustersAPI.save).not.toHaveBeenCalled();
  });

  test('should display existing clusters', async () => {
    const existingClusters = [
      {
        id: '1',
        name: 'Production',
        contexts: ['prod-1', 'prod-2']
      }
    ];
    
    mockClustersAPI.getAll.mockResolvedValue(existingClusters);
    
    render(<ClusterModal isOpen={true} onClose={() => {}} />);
    
    await waitFor(() => {
      expect(screen.getByText('Production')).toBeInTheDocument();
      expect(screen.getByText('prod-1')).toBeInTheDocument();
      expect(screen.getByText('prod-2')).toBeInTheDocument();
    });
  });

  test('should delete cluster', async () => {
    const existingClusters = [
      {
        id: '1',
        name: 'Test Cluster',
        contexts: ['test-1']
      }
    ];
    
    mockClustersAPI.getAll.mockResolvedValue(existingClusters);
    mockClustersAPI.save.mockResolvedValue(true);
    
    render(<ClusterModal isOpen={true} onClose={() => {}} />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Cluster')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Excluir'));
    
    await waitFor(() => {
      expect(mockClustersAPI.save).toHaveBeenCalledWith([]);
    });
  });

  test('should close modal when close button clicked', () => {
    const onClose = jest.fn();
    
    render(<ClusterModal isOpen={true} onClose={onClose} />);
    
    fireEvent.click(screen.getByText('×'));
    
    expect(onClose).toHaveBeenCalled();
  });
});