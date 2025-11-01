class ContextManager {
  constructor() {
    this.isClusterMode = false;
    this.selectedContext = '';
    this.selectedCluster = '';
    this.clusterContexts = [];
    this.listeners = [];
  }

  setMode(isClusterMode) {
    this.isClusterMode = isClusterMode;
    this.notifyListeners();
  }

  setSelectedContext(context) {
    this.selectedContext = context;
    this.notifyListeners();
  }

  setSelectedCluster(cluster) {
    this.selectedCluster = cluster;
    this.notifyListeners();
  }

  setClusterContexts(contexts) {
    this.clusterContexts = contexts;
    this.notifyListeners();
  }

  getActiveContexts() {
    return this.isClusterMode ? this.clusterContexts : [this.selectedContext];
  }

  getCurrentSelection() {
    return {
      isClusterMode: this.isClusterMode,
      selectedContext: this.selectedContext,
      selectedCluster: this.selectedCluster,
      clusterContexts: this.clusterContexts,
      activeContexts: this.getActiveContexts()
    };
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.getCurrentSelection()));
  }
}

export default new ContextManager();