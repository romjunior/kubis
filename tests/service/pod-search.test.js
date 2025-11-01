describe('Pod Search Functionality', () => {
  const mockPods = [
    { name: 'nginx-pod-1', namespace: 'default', status: 'Running' },
    { name: 'redis-pod-2', namespace: 'default', status: 'Running' },
    { name: 'mysql-pod-3', namespace: 'database', status: 'Pending' }
  ];

  it('should filter pods by name', () => {
    const searchTerm = 'nginx';
    const filtered = mockPods.filter(pod => 
      pod.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe('nginx-pod-1');
  });

  it('should be case insensitive', () => {
    const searchTerm = 'REDIS';
    const filtered = mockPods.filter(pod => 
      pod.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe('redis-pod-2');
  });

  it('should return empty array when no matches', () => {
    const searchTerm = 'nonexistent';
    const filtered = mockPods.filter(pod => 
      pod.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    expect(filtered).toHaveLength(0);
  });

  it('should return all pods when search term is empty', () => {
    const searchTerm = '';
    const filtered = mockPods.filter(pod => 
      pod.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    expect(filtered).toHaveLength(3);
  });
});