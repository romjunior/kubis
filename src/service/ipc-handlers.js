import { ipcMain } from 'electron';
import { getContexts, getClusterInfo, setContext } from './kubectl.js';

export const setupKubectlHandlers = () => {
  ipcMain.handle('kubectl:get-contexts', async () => {
    return await getContexts();
  });

  ipcMain.handle('kubectl:get-cluster-info', async (_, context) => {
    return await getClusterInfo(context);
  });

  ipcMain.handle('kubectl:set-context', async (_, context) => {
    return await setContext(context);
  });
};