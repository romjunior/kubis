import contextManager from '../../src/core/context-manager.js';

describe('ContextManager', () => {
  beforeEach(() => {
    contextManager.isClusterMode = false;
    contextManager.selectedContext = '';
    contextManager.selectedCluster = '';
    contextManager.clusterContexts = [];
    contextManager.listeners = [];
  });

  it('should set cluster mode', () => {
    contextManager.setMode(true);
    expect(contextManager.isClusterMode).toBe(true);
  });

  it('should return active contexts in context mode', () => {
    contextManager.setSelectedContext('test-context');
    const activeContexts = contextManager.getActiveContexts();
    expect(activeContexts).toEqual(['test-context']);
  });

  it('should return cluster contexts in cluster mode', () => {
    contextManager.setMode(true);
    contextManager.setClusterContexts(['ctx1', 'ctx2']);
    const activeContexts = contextManager.getActiveContexts();
    expect(activeContexts).toEqual(['ctx1', 'ctx2']);
  });

  it('should notify listeners on changes', () => {
    const listener = jest.fn();
    contextManager.subscribe(listener);
    contextManager.setMode(true);
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({
      isClusterMode: true
    }));
  });
});