# Kubis - Regras do Projeto

## Arquitetura

### Stack Principal
- **Electron**: Framework desktop multiplataforma
- **React 19**: Interface do usuário com hooks modernos
- **Styled Components**: Estilização CSS-in-JS
- **Vite**: Build tool para desenvolvimento e produção
- **Electron Forge**: Empacotamento e distribuição

### Estrutura de Processos
- **Main Process** (`src/main.js`): Gerencia janelas e ciclo de vida
- **Renderer Process** (`src/renderer.jsx`): Interface React isolada
- **Preload Script** (`src/preload.js`): Comunicação segura entre processos

## Boas Práticas de Código

### Segurança Electron
- SEMPRE usar context isolation
- NUNCA habilitar nodeIntegration no renderer
- Comunicação via preload scripts apenas
- Validar todas as entradas do renderer

### Estrutura de Arquivos
```
src/
├── main.js          # Processo principal
├── preload.js       # Bridge segura
├── renderer.jsx     # Interface React
└── index.css        # Estilos globais
```

### React/JavaScript
- Usar hooks funcionais (useState, useEffect)
- Componentes funcionais apenas
- Props tipadas quando possível
- Styled Components para estilização
- Evitar inline styles e CSS tradicional
- Separar os componentes em arquivos diferentes e também criar componentes reutilizáveis

### Styled Components
- CSS-in-JS para componentes isolados
- Temas globais para consistência
- Props dinâmicas para estilos condicionais
- Nomenclatura: PascalCase com sufixo (ButtonPrimary, ContainerMain)

### Vite Configuration
- Três configs separadas: main, preload, renderer
- Hot reload habilitado em desenvolvimento
- Build otimizado para produção

## Padrões de Desenvolvimento

### Nomenclatura
- Arquivos: kebab-case (`my-component.jsx`)
- Componentes: PascalCase (`MyComponent`)
- Variáveis/funções: camelCase (`myFunction`)
- Constantes: UPPER_CASE (`API_URL`)

### Organização
- Um componente por arquivo
- Imports organizados: externos → internos → relativos
- Exports no final do arquivo

### Performance
- Lazy loading para componentes grandes
- Memoização quando necessário
- Evitar re-renders desnecessários

### Estrutura
- separação das funcionalidades em arquivos
- o que for essencial, estrutura da app e altamente reutilizável ficará no core o restante é no service
- no utils ficará somente funcões utilitárias
- obrigatório testes unitários do jest

## Kubernetes Integration

### Objetivo Principal
- Interface visual para kubectl
- Gerenciamento de recursos K8s
- Monitoramento em tempo real
- Editor de manifests YAML

### Funcionalidades Core
- Visualização de clusters
- Pods, Services, Deployments
- Logs de containers
- Terminal kubectl integrado

## Build e Deploy

### Comandos Padrão
- `npm start`: Desenvolvimento
- `npm run package`: Empacotamento
- `npm run make`: Instaladores

### Targets de Build
- Windows: Squirrel installer
- macOS: ZIP package
- Linux: DEB e RPM packages

## Licenciamento

### AGPL v3
- Copyleft forte obrigatório
- Código derivado deve ser AGPL v3
- Inclui uso via rede/SaaS
- Não permite versões proprietárias