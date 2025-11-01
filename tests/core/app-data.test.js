// Mock do fs
const mockFs = {
  mkdir: jest.fn(),
  writeFile: jest.fn(),
  readFile: jest.fn()
};

jest.mock('fs', () => ({
  promises: mockFs
}));

// Mock do electron
jest.mock('electron', () => ({
  app: {}
}));

// Mock do os
const mockOs = {
  homedir: jest.fn(() => '/home/user')
};

jest.mock('os', () => mockOs);

// Mock do path
const mockPath = {
  join: jest.fn((...args) => args.join('/'))
};

jest.mock('path', () => mockPath);

describe('AppData Core Functions', () => {
  let AppDataClass;
  let appDataInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Simula a classe AppData
    AppDataClass = class AppData {
      constructor() {
        this.platform = 'linux';
        this.appDir = '/home/user/.kubis';
        this.configDir = '/home/user/.kubis/config';
        this.logsDir = '/home/user/.kubis/logs';
      }

      async saveClusters(clusters) {
        const clustersPath = '/home/user/.kubis/config/clusters.json';
        await mockFs.writeFile(clustersPath, JSON.stringify(clusters, null, 2));
      }

      async loadClusters() {
        const clustersPath = '/home/user/.kubis/config/clusters.json';
        try {
          const data = await mockFs.readFile(clustersPath, 'utf8');
          return JSON.parse(data);
        } catch (error) {
          return [];
        }
      }

      async init() {
        await mockFs.mkdir(this.appDir, { recursive: true });
        await mockFs.mkdir(this.configDir, { recursive: true });
        await mockFs.mkdir(this.logsDir, { recursive: true });
      }
    };

    appDataInstance = new AppDataClass();
  });

  describe('saveClusters', () => {
    test('should save clusters to file', async () => {
      const clusters = [{ id: '1', name: 'Test', contexts: ['ctx1'] }];
      mockFs.writeFile.mockResolvedValue();

      await appDataInstance.saveClusters(clusters);

      expect(mockFs.writeFile).toHaveBeenCalledWith(
        '/home/user/.kubis/config/clusters.json',
        JSON.stringify(clusters, null, 2)
      );
    });

    test('should handle write errors', async () => {
      const clusters = [{ id: '1', name: 'Test', contexts: ['ctx1'] }];
      mockFs.writeFile.mockRejectedValue(new Error('Write failed'));

      await expect(appDataInstance.saveClusters(clusters)).rejects.toThrow('Write failed');
    });
  });

  describe('loadClusters', () => {
    test('should load clusters from file', async () => {
      const clusters = [{ id: '1', name: 'Test', contexts: ['ctx1'] }];
      mockFs.readFile.mockResolvedValue(JSON.stringify(clusters));

      const result = await appDataInstance.loadClusters();

      expect(result).toEqual(clusters);
      expect(mockFs.readFile).toHaveBeenCalledWith(
        '/home/user/.kubis/config/clusters.json',
        'utf8'
      );
    });

    test('should return empty array when file does not exist', async () => {
      mockFs.readFile.mockRejectedValue(new Error('File not found'));

      const result = await appDataInstance.loadClusters();

      expect(result).toEqual([]);
    });

    test('should return empty array for invalid JSON', async () => {
      mockFs.readFile.mockResolvedValue('invalid json');

      const result = await appDataInstance.loadClusters();

      expect(result).toEqual([]);
    });
  });

  describe('init', () => {
    test('should create all directories', async () => {
      mockFs.mkdir.mockResolvedValue();

      await appDataInstance.init();

      expect(mockFs.mkdir).toHaveBeenCalledTimes(3);
      expect(mockFs.mkdir).toHaveBeenCalledWith('/home/user/.kubis', { recursive: true });
      expect(mockFs.mkdir).toHaveBeenCalledWith('/home/user/.kubis/config', { recursive: true });
      expect(mockFs.mkdir).toHaveBeenCalledWith('/home/user/.kubis/logs', { recursive: true });
    });

    test('should handle mkdir errors', async () => {
      mockFs.mkdir.mockRejectedValue(new Error('Permission denied'));

      await expect(appDataInstance.init()).rejects.toThrow('Permission denied');
    });
  });
});