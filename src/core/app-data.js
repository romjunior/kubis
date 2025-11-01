const { app } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const os = require('os');

class AppData {
  constructor() {
    this.platform = process.platform;
    this.appDir = this.getAppDataPath();
    this.configDir = path.join(this.appDir, 'config');
    this.logsDir = path.join(this.appDir, 'logs');
  }

  getAppDataPath() {
    switch (this.platform) {
      case 'win32':
        return path.join(os.homedir(), 'AppData', 'Roaming', 'kubis');
      case 'darwin':
        return path.join(os.homedir(), 'Library', 'Application Support', 'kubis');
      default: // linux
        return path.join(os.homedir(), '.kubis');
    }
  }

  async init() {
    await fs.mkdir(this.appDir, { recursive: true });
    await fs.mkdir(this.configDir, { recursive: true });
    await fs.mkdir(this.logsDir, { recursive: true });
  }

  getAppDir() {
    return this.appDir;
  }

  getConfigDir() {
    return this.configDir;
  }

  getLogsDir() {
    return this.logsDir;
  }

  getConfigPath(filename) {
    return path.join(this.configDir, filename);
  }

  getLogPath(filename) {
    return path.join(this.logsDir, filename);
  }

  async saveClusters(clusters) {
    const clustersPath = this.getConfigPath('clusters.json');
    await fs.writeFile(clustersPath, JSON.stringify(clusters, null, 2));
  }

  async loadClusters() {
    const clustersPath = this.getConfigPath('clusters.json');
    try {
      const data = await fs.readFile(clustersPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }
}

export default new AppData();