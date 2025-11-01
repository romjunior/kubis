import * as k8s from '@kubernetes/client-node';
import appData from '../core/app-data.js';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

export const getClusters = async () => {
  try {
    const clusters = kc.getClusters();
    return clusters.map(cluster => cluster.name);
  } catch (error) {
    return [];
  }
};

export const getContextsForCluster = async (clusterName) => {
  try {
    const clusters = await appData.loadClusters();
    
    const cluster = clusters.find(c => c.name === clusterName);
    if (!cluster || !cluster.contexts) {
      return [];
    }
    
    const k8sContexts = kc.getContexts();
    const k8sContextNames = k8sContexts.map(ctx => ctx.name);
    
    return cluster.contexts.filter(ctx => k8sContextNames.includes(ctx));
  } catch (error) {
    console.error('Erro ao carregar contextos do cluster:', error);
    return [];
  }
};