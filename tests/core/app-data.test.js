const path = require('path');
const os = require('os');

// Mock electron
jest.mock('electron', () => ({
  app: {}
}));

// Mock fs.promises
const mockMkdir = jest.fn();
jest.mock('fs', () => ({
  promises: {
    mkdir: mockMkdir
  }
}));

describe('AppData', () => {
  let AppDataClass;
  let appData;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Clear module cache to get fresh class
    delete require.cache[require.resolve('../../src/core/app-data.js')];
    const module = require('../../src/core/app-data.js');
    AppDataClass = module.constructor;
  });

  describe('getAppDataPath', () => {
    test('returns Windows path on win32', () => {
      appData = new AppDataClass();
      appData.platform = 'win32';
      
      const expected = path.join(os.homedir(), 'AppData', 'Roaming', 'kubis');
      expect(appData.getAppDataPath()).toBe(expected);
    });

    test('returns macOS path on darwin', () => {
      appData = new AppDataClass();
      appData.platform = 'darwin';
      
      const expected = path.join(os.homedir(), 'Library', 'Application Support', 'kubis');
      expect(appData.getAppDataPath()).toBe(expected);
    });

    test('returns Linux path on linux', () => {
      appData = new AppDataClass();
      appData.platform = 'linux';
      
      const expected = path.join(os.homedir(), '.kubis');
      expect(appData.getAppDataPath()).toBe(expected);
    });
  });

  describe('directory paths', () => {
    beforeEach(() => {
      appData = new AppDataClass();
    });

    test('returns correct config directory', () => {
      const expected = path.join(appData.getAppDir(), 'config');
      expect(appData.getConfigDir()).toBe(expected);
    });

    test('returns correct logs directory', () => {
      const expected = path.join(appData.getAppDir(), 'logs');
      expect(appData.getLogsDir()).toBe(expected);
    });
  });

  describe('file paths', () => {
    beforeEach(() => {
      appData = new AppDataClass();
    });

    test('returns correct config file path', () => {
      const filename = 'settings.json';
      const expected = path.join(appData.getConfigDir(), filename);
      expect(appData.getConfigPath(filename)).toBe(expected);
    });

    test('returns correct log file path', () => {
      const filename = 'app.log';
      const expected = path.join(appData.getLogsDir(), filename);
      expect(appData.getLogPath(filename)).toBe(expected);
    });
  });

  describe('init', () => {
    beforeEach(() => {
      appData = new AppDataClass();
    });

    test('creates all directories', async () => {
      mockMkdir.mockResolvedValue();

      await appData.init();

      expect(mockMkdir).toHaveBeenCalledTimes(3);
      expect(mockMkdir).toHaveBeenCalledWith(appData.getAppDir(), { recursive: true });
      expect(mockMkdir).toHaveBeenCalledWith(appData.getConfigDir(), { recursive: true });
      expect(mockMkdir).toHaveBeenCalledWith(appData.getLogsDir(), { recursive: true });
    });
  });
});