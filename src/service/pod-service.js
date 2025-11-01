import * as k8s from '@kubernetes/client-node';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

export const getPodsForContext = async (context, namespace = '') => {
  const originalContext = kc.getCurrentContext();
  kc.setCurrentContext(context);
  
  const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
  const response = namespace 
    ? await k8sApi.listNamespacedPod(namespace)
    : await k8sApi.listPodForAllNamespaces();

  kc.setCurrentContext(originalContext);
  
  return response.items.map(pod => ({
    name: pod.metadata.name,
    namespace: pod.metadata.namespace,
    status: pod.status.phase,
    ready: `${pod.status.containerStatuses?.filter(c => c.ready).length || 0}/${pod.spec.containers.length}`,
    restarts: pod.status.containerStatuses?.reduce((sum, c) => sum + c.restartCount, 0) || 0,
    age: calculateAge(pod.metadata.creationTimestamp),
    context: context
  }));
};

export const getPodsForMultipleContexts = async (contexts, namespace = '') => {
  const podPromises = contexts.map(context => getPodsForContext(context, namespace));
  const results = await Promise.allSettled(podPromises);
  
  const errors = results.filter(result => result.status === 'rejected');
  if (errors.length === results.length) {
    throw new Error('Falha ao conectar com todos os contextos');
  }
  
  return results
    .filter(result => result.status === 'fulfilled')
    .flatMap(result => result.value);
};

export const getPods = async (isClusterMode, contexts, namespace = '') => {
  if (!contexts || contexts.length === 0) {
    throw new Error('Nenhum contexto selecionado');
  }
  
  return isClusterMode 
    ? await getPodsForMultipleContexts(contexts, namespace)
    : await getPodsForContext(contexts[0], namespace);
};

const calculateAge = (creationTimestamp) => {
  const now = new Date();
  const created = new Date(creationTimestamp);
  const diffMs = now - created;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diffDays > 0) return `${diffDays}d`;
  if (diffHours > 0) return `${diffHours}h`;
  return `${diffMinutes}m`;
};