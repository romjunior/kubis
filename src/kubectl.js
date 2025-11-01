import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

export const getContexts = async () => {
  try {
    const { stdout } = await execAsync('kubectl config get-contexts -o name');
    return stdout.trim().split('\n').filter(ctx => ctx);
  } catch (error) {
    return [];
  }
};

export const getClusterInfo = async (context) => {
  try {
    const contextFlag = context ? `--context=${context}` : '';
    const [clusterInfo, nodes, namespaces] = await Promise.all([
      execAsync(`kubectl cluster-info ${contextFlag}`),
      execAsync(`kubectl get nodes ${contextFlag} -o wide`),
      execAsync(`kubectl get namespaces ${contextFlag}`)
    ]);
    return {
      clusterInfo: clusterInfo.stdout,
      nodes: nodes.stdout,
      namespaces: namespaces.stdout
    };
  } catch (error) {
    return { error: error.message };
  }
};

export const setContext = async (context) => {
  try {
    await execAsync(`kubectl config use-context ${context}`);
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
};