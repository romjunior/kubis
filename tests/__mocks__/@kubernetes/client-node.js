export class KubeConfig {
  constructor() {
    this.loadFromDefault = jest.fn();
    this.getClusters = jest.fn(() => []);
    this.getContexts = jest.fn(() => [
      { name: 'ctx1' },
      { name: 'ctx2' },
      { name: 'ctx3' }
    ]);
  }
}

export const CoreV1Api = jest.fn();