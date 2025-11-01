import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('kubectlAPI', {
  getContexts: () => ipcRenderer.invoke('kubectl:get-contexts'),
  getClusterInfo: (context) => ipcRenderer.invoke('kubectl:get-cluster-info', context),
  setContext: (context) => ipcRenderer.invoke('kubectl:set-context', context)
});

contextBridge.exposeInMainWorld('clustersAPI', {
  getAll: () => ipcRenderer.invoke('clusters:get-all'),
  save: (clusters) => ipcRenderer.invoke('clusters:save', clusters)
});
