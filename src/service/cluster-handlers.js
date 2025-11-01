import { ipcMain } from 'electron';
import appData from '../core/app-data.js';

export const setupClusterHandlers = () => {
  ipcMain.handle('clusters:get-all', async () => {
    return await appData.loadClusters();
  });

  ipcMain.handle('clusters:save', async (_, clusters) => {
    await appData.saveClusters(clusters);
    return true;
  });
};