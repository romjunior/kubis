import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../../src/components/Header';

// Mock do ClusterModal
jest.mock('../../src/components/ClusterModal', () => {
  return function MockClusterModal({ isOpen, onClose }) {
    return isOpen ? (
      <div data-testid="cluster-modal">
        <button onClick={onClose}>Close Modal</button>
      </div>
    ) : null;
  };
});

describe('Header', () => {
  const defaultProps = {
    contexts: ['context1', 'context2', 'context3'],
    selectedContext: 'context1',
    onContextChange: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render header with title', () => {
    render(<Header {...defaultProps} />);
    
    expect(screen.getByText('🚢 Kubis')).toBeInTheDocument();
  });

  test('should render context selector', () => {
    render(<Header {...defaultProps} />);
    
    expect(screen.getByText('Contexto:')).toBeInTheDocument();
    expect(screen.getByDisplayValue('context1')).toBeInTheDocument();
  });

  test('should render all context options', () => {
    render(<Header {...defaultProps} />);
    
    const select = screen.getByDisplayValue('context1');
    expect(select).toBeInTheDocument();
    
    // Verifica se as opções estão presentes
    expect(screen.getByText('context1')).toBeInTheDocument();
    expect(screen.getByText('context2')).toBeInTheDocument();
    expect(screen.getByText('context3')).toBeInTheDocument();
  });

  test('should call onContextChange when context is selected', () => {
    const onContextChange = jest.fn();
    
    render(<Header {...defaultProps} onContextChange={onContextChange} />);
    
    const select = screen.getByDisplayValue('context1');
    fireEvent.change(select, { target: { value: 'context2' } });
    
    expect(onContextChange).toHaveBeenCalledWith('context2');
  });

  test('should render clusters button', () => {
    render(<Header {...defaultProps} />);
    
    expect(screen.getByText('🏗️ Clusters')).toBeInTheDocument();
  });

  test('should open cluster modal when clusters button clicked', () => {
    render(<Header {...defaultProps} />);
    
    const clustersButton = screen.getByText('🏗️ Clusters');
    fireEvent.click(clustersButton);
    
    expect(screen.getByTestId('cluster-modal')).toBeInTheDocument();
  });

  test('should close cluster modal', () => {
    render(<Header {...defaultProps} />);
    
    // Abre o modal
    const clustersButton = screen.getByText('🏗️ Clusters');
    fireEvent.click(clustersButton);
    
    expect(screen.getByTestId('cluster-modal')).toBeInTheDocument();
    
    // Fecha o modal
    const closeButton = screen.getByText('Close Modal');
    fireEvent.click(closeButton);
    
    expect(screen.queryByTestId('cluster-modal')).not.toBeInTheDocument();
  });

  test('should handle empty contexts array', () => {
    render(<Header {...defaultProps} contexts={[]} selectedContext="" />);
    
    expect(screen.getByText('Selecione um contexto')).toBeInTheDocument();
  });

  test('should handle no selected context', () => {
    render(<Header {...defaultProps} selectedContext="" />);
    
    const select = screen.getByRole('combobox');
    expect(select.value).toBe('');
    expect(select).toBeInTheDocument();
  });
});