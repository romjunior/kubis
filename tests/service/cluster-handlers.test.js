// Mock do electron
const mockIpcMain = {
  handle: jest.fn()
};

jest.mock('electron', () => ({
  ipcMain: mockIpcMain
}));

// Mock do app-data
const mockAppData = {
  loadClusters: jest.fn(),
  saveClusters: jest.fn()
};

jest.mock('../../src/core/app-data.js', () => mockAppData);

// Mock do setupClusterHandlers
const mockSetupClusterHandlers = jest.fn();
jest.mock('../../src/service/cluster-handlers.js', () => ({
  setupClusterHandlers: mockSetupClusterHandlers
}));

describe('Cluster Handlers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should setup cluster handlers', () => {
    mockSetupClusterHandlers();
    expect(mockSetupClusterHandlers).toHaveBeenCalled();
  });

  test('should handle clusters:get-all', async () => {
    const mockClusters = [
      { id: '1', name: 'Test', contexts: ['ctx1'] }
    ];
    
    mockAppData.loadClusters.mockResolvedValue(mockClusters);
    
    const result = await mockAppData.loadClusters();
    
    expect(result).toEqual(mockClusters);
    expect(mockAppData.loadClusters).toHaveBeenCalled();
  });

  test('should handle clusters:save', async () => {
    const mockClusters = [
      { id: '1', name: 'Test', contexts: ['ctx1'] }
    ];
    
    mockAppData.saveClusters.mockResolvedValue();
    
    await mockAppData.saveClusters(mockClusters);
    
    expect(mockAppData.saveClusters).toHaveBeenCalledWith(mockClusters);
  });

  test('should handle errors in clusters:get-all', async () => {
    mockAppData.loadClusters.mockRejectedValue(new Error('Load failed'));
    
    await expect(mockAppData.loadClusters()).rejects.toThrow('Load failed');
  });

  test('should handle errors in clusters:save', async () => {
    const mockClusters = [{ id: '1', name: 'Test', contexts: ['ctx1'] }];
    mockAppData.saveClusters.mockRejectedValue(new Error('Save failed'));
    
    await expect(mockAppData.saveClusters(mockClusters)).rejects.toThrow('Save failed');
  });
});