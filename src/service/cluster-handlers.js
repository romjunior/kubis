import { ipcMain } from 'electron';
import appData from '../core/app-data.js';
import { getClusters, getContextsForCluster } from './cluster-service.js';

export const setupClusterHandlers = () => {
  ipcMain.handle('clusters:get-all', async () => {
    return await appData.loadClusters();
  });

  ipcMain.handle('clusters:save', async (_, clusters) => {
    await appData.saveClusters(clusters);
    return true;
  });

  ipcMain.handle('kubectl:get-clusters', async () => {
    return await getClusters();
  });

  ipcMain.handle('kubectl:get-contexts-for-cluster', async (_, clusterName) => {
    return await getContextsForCluster(clusterName);
  });
};