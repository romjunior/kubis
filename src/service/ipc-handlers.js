import { ipcMain } from 'electron';
import { getContexts, getClusterInfo, setContext } from './kubectl.js';
import { getPods } from './pod-service.js';

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

  ipcMain.handle('kubectl:get-pods', async (_, isClusterMode, contexts, namespace) => {
    try {
      return await getPods(isClusterMode, contexts, namespace);
    } catch (error) {
      throw new Error(error.message || 'Erro ao buscar pods');
    }
  });
};