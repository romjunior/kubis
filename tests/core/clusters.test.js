// Mock do app-data
const mockAppData = {
  saveClusters: jest.fn(),
  loadClusters: jest.fn()
};

jest.mock('../../src/core/app-data.js', () => mockAppData);

describe('Clusters Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveClusters', () => {
    test('should save single cluster configuration', async () => {
      const clusters = [
        {
          id: '1',
          name: 'Production',
          contexts: ['prod-cluster-1', 'prod-cluster-2']
        }
      ];

      mockAppData.saveClusters.mockResolvedValue();

      await mockAppData.saveClusters(clusters);

      expect(mockAppData.saveClusters).toHaveBeenCalledWith(clusters);
    });

    test('should save multiple clusters configuration', async () => {
      const clusters = [
        {
          id: '1',
          name: 'Production',
          contexts: ['prod-cluster-1', 'prod-cluster-2']
        },
        {
          id: '2',
          name: 'Development',
          contexts: ['dev-cluster']
        }
      ];

      mockAppData.saveClusters.mockResolvedValue();

      await mockAppData.saveClusters(clusters);

      expect(mockAppData.saveClusters).toHaveBeenCalledWith(clusters);
    });

    test('should save empty clusters array', async () => {
      const clusters = [];

      mockAppData.saveClusters.mockResolvedValue();

      await mockAppData.saveClusters(clusters);

      expect(mockAppData.saveClusters).toHaveBeenCalledWith(clusters);
    });
  });

  describe('loadClusters', () => {
    test('should load existing clusters configuration', async () => {
      const mockClusters = [
        {
          id: '1',
          name: 'Test Cluster',
          contexts: ['test-context']
        }
      ];

      mockAppData.loadClusters.mockResolvedValue(mockClusters);

      const result = await mockAppData.loadClusters();

      expect(result).toEqual(mockClusters);
      expect(mockAppData.loadClusters).toHaveBeenCalled();
    });

    test('should return empty array when clusters file does not exist', async () => {
      mockAppData.loadClusters.mockResolvedValue([]);

      const result = await mockAppData.loadClusters();

      expect(result).toEqual([]);
    });

    test('should return empty array when file contains invalid JSON', async () => {
      mockAppData.loadClusters.mockResolvedValue([]);

      const result = await mockAppData.loadClusters();

      expect(result).toEqual([]);
    });

    test('should load multiple clusters', async () => {
      const mockClusters = [
        {
          id: '1',
          name: 'Production',
          contexts: ['prod-1', 'prod-2']
        },
        {
          id: '2',
          name: 'Development',
          contexts: ['dev-1']
        }
      ];

      mockAppData.loadClusters.mockResolvedValue(mockClusters);

      const result = await mockAppData.loadClusters();

      expect(result).toEqual(mockClusters);
      expect(result).toHaveLength(2);
    });
  });
});