jest.mock('@kubernetes/client-node', () => {
  const mockApi = {
    listPodForAllNamespaces: jest.fn(),
    listNamespacedPod: jest.fn()
  };

  const mockKubeConfig = {
    loadFromDefault: jest.fn(),
    getCurrentContext: jest.fn(),
    setCurrentContext: jest.fn(),
    makeApiClient: jest.fn(() => mockApi)
  };

  return {
    KubeConfig: jest.fn(() => mockKubeConfig),
    CoreV1Api: jest.fn()
  };
});

import { getPods, getPodsForContext, getPodsForMultipleContexts } from '../../src/service/pod-service.js';

const mockApi = {
  listPodForAllNamespaces: jest.fn(),
  listNamespacedPod: jest.fn()
};

beforeEach(() => {
  jest.clearAllMocks();
  const k8s = require('@kubernetes/client-node');
  const mockKubeConfig = new k8s.KubeConfig();
  mockKubeConfig.makeApiClient.mockReturnValue(mockApi);
});

describe('pod-service', () => {
  const mockPod = {
    metadata: {
      name: 'test-pod',
      namespace: 'default',
      creationTimestamp: new Date(Date.now() - 60000).toISOString()
    },
    status: {
      phase: 'Running',
      containerStatuses: [{ ready: true, restartCount: 0 }]
    },
    spec: {
      containers: [{ name: 'container1' }]
    }
  };

  describe('getPodsForContext', () => {
    it('should return pods for specific context', async () => {
      mockApi.listPodForAllNamespaces.mockResolvedValue({
        body: { items: [mockPod] }
      });

      const pods = await getPodsForContext('test-context');
      
      expect(pods).toHaveLength(1);
      expect(pods[0]).toMatchObject({
        name: 'test-pod',
        namespace: 'default',
        status: 'Running',
        context: 'test-context'
      });
    });

    it('should return pods for specific namespace', async () => {
      mockApi.listNamespacedPod.mockResolvedValue({
        body: { items: [mockPod] }
      });

      await getPodsForContext('test-context', 'default');
      
      expect(mockApi.listNamespacedPod).toHaveBeenCalledWith('default');
    });

    it('should handle errors gracefully', async () => {
      mockApi.listPodForAllNamespaces.mockRejectedValue(new Error('API Error'));

      const pods = await getPodsForContext('test-context');
      
      expect(pods).toEqual([]);
    });
  });

  describe('getPodsForMultipleContexts', () => {
    it('should return pods from multiple contexts', async () => {
      mockApi.listPodForAllNamespaces.mockResolvedValue({
        body: { items: [mockPod] }
      });

      const pods = await getPodsForMultipleContexts(['ctx1', 'ctx2']);
      
      expect(pods).toHaveLength(2);
    });
  });

  describe('getPods', () => {
    it('should return pods for cluster mode', async () => {
      mockApi.listPodForAllNamespaces.mockResolvedValue({
        body: { items: [mockPod] }
      });

      const pods = await getPods(true, ['ctx1', 'ctx2']);
      
      expect(pods).toHaveLength(2);
    });

    it('should return pods for single context mode', async () => {
      mockApi.listPodForAllNamespaces.mockResolvedValue({
        body: { items: [mockPod] }
      });

      const pods = await getPods(false, ['ctx1']);
      
      expect(pods).toHaveLength(1);
    });

    it('should return empty array for no contexts', async () => {
      const pods = await getPods(false, []);
      
      expect(pods).toEqual([]);
    });
  });
});