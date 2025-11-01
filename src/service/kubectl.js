import * as k8s from '@kubernetes/client-node';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

export const getContexts = async () => {
  try {
    const contexts = kc.getContexts();
    return contexts.map(ctx => ctx.name);
  } catch (error) {
    return [];
  }
};

export const getClusterInfo = async (context) => {
  try {
    if (context) {
      kc.setCurrentContext(context);
    }
    
    const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
    const [nodes, namespaces] = await Promise.all([
      k8sApi.listNode(),
      k8sApi.listNamespace()
    ]);
    
    return {
      clusterInfo: `Cluster: ${kc.getCurrentCluster()?.name || 'Unknown'}`,
      nodes: nodes.body.items.map(node => node.metadata.name).join('\n'),
      namespaces: namespaces.body.items.map(ns => ns.metadata.name).join('\n')
    };
  } catch (error) {
    return { error: error.message };
  }
};

export const setContext = async (context) => {
  try {
    kc.setCurrentContext(context);
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
};