const appData = require('../../src/core/app-data.js');
const fs = require('fs').promises;
const path = require('path');

// Mock do fs para testes
jest.mock('fs', () => ({
  promises: {
    mkdir: jest.fn(),
    writeFile: jest.fn(),
    readFile: jest.fn()
  }
}));

describe('Clusters Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should save clusters configuration', async () => {
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

    await appData.saveClusters(clusters);

    expect(fs.writeFile).toHaveBeenCalledWith(
      expect.stringContaining('clusters.json'),
      JSON.stringify(clusters, null, 2)
    );
  });

  test('should load clusters configuration', async () => {
    const mockClusters = [
      {
        id: '1',
        name: 'Test Cluster',
        contexts: ['test-context']
      }
    ];

    fs.readFile.mockResolvedValue(JSON.stringify(mockClusters));

    const result = await appData.loadClusters();

    expect(result).toEqual(mockClusters);
    expect(fs.readFile).toHaveBeenCalledWith(
      expect.stringContaining('clusters.json'),
      'utf8'
    );
  });

  test('should return empty array when clusters file does not exist', async () => {
    fs.readFile.mockRejectedValue(new Error('File not found'));

    const result = await appData.loadClusters();

    expect(result).toEqual([]);
  });
});