import { getClusters, getContextsForCluster } from '../../src/service/cluster-service.js';
import appData from '../../src/core/app-data.js';

jest.mock('../../src/core/app-data.js');

describe('cluster-service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getClusters', () => {
    it('should return empty array (using saved clusters)', async () => {
      const clusters = await getClusters();
      expect(Array.isArray(clusters)).toBe(true);
    });
  });

  describe('getContextsForCluster', () => {
    it('should return contexts for specific cluster from app-data', async () => {
      appData.loadClusters.mockResolvedValue([
        { id: '1', name: 'test-cluster', contexts: ['ctx1', 'ctx2'] }
      ]);

      const contexts = await getContextsForCluster('test-cluster');
      expect(contexts).toEqual(['ctx1', 'ctx2']);
    });

    it('should return empty array if cluster not found', async () => {
      appData.loadClusters.mockResolvedValue([]);

      const contexts = await getContextsForCluster('nonexistent');
      expect(contexts).toEqual([]);
    });
  });
});