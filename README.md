# Kubis

Uma interface gráfica moderna para gerenciamento do Kubernetes, construída com Electron e React.

## 🎯 Objetivo

O Kubis é uma aplicação desktop que visa simplificar o gerenciamento de clusters Kubernetes através de uma interface intuitiva e moderna. O projeto oferece uma alternativa visual aos comandos kubectl, permitindo que desenvolvedores e administradores de sistema gerenciem recursos Kubernetes de forma mais eficiente.

## 🏗️ Arquitetura

### Stack Tecnológica
- **Electron**: Framework para aplicações desktop multiplataforma
- **React 19**: Biblioteca para construção da interface do usuário
- **Vite**: Build tool e bundler para desenvolvimento rápido
- **Electron Forge**: Toolchain para empacotamento e distribuição

### Estrutura do Projeto

```
kubis/
├── src/
│   ├── main.js          # Processo principal do Electron
│   ├── preload.js       # Script de preload para comunicação segura
│   ├── renderer.jsx     # Interface React (processo renderer)
│   └── index.css        # Estilos globais
├── .vite/               # Arquivos de build do Vite
├── forge.config.js      # Configuração do Electron Forge
├── package.json         # Dependências e scripts
├── vite.main.config.mjs    # Configuração Vite para processo principal
├── vite.preload.config.mjs # Configuração Vite para preload
└── vite.renderer.config.mjs # Configuração Vite para renderer
```

### Arquitetura Electron

O projeto segue a arquitetura padrão do Electron com três processos principais:

1. **Main Process** (`main.js`): Gerencia o ciclo de vida da aplicação e cria janelas
2. **Renderer Process** (`renderer.jsx`): Interface React que roda no contexto do navegador
3. **Preload Script** (`preload.js`): Ponte segura entre main e renderer processes

## 🚀 Funcionalidades Planejadas

- [ ] Visualização de clusters Kubernetes
- [ ] Gerenciamento de Pods, Services e Deployments
- [ ] Monitoramento de recursos em tempo real
- [ ] Editor de manifests YAML
- [ ] Logs de containers
- [ ] Terminal integrado para kubectl
- [ ] Múltiplos contextos de cluster

## 📦 Instalação e Desenvolvimento

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn
- kubectl configurado (para funcionalidades Kubernetes)

### Comandos Disponíveis

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm start

# Empacotar aplicação
npm run package

# Criar instalador (.deb)
npm run make-deb

# Criar todos os instaladores
npm run make
```

### Desenvolvimento

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Execute em modo desenvolvimento: `npm start`
4. A aplicação abrirá automaticamente com hot-reload ativado

## 🔧 Configuração

### Electron Forge

O projeto utiliza Electron Forge para:
- **Makers**: Criação de instaladores para diferentes plataformas
  - Windows: Squirrel
  - macOS: ZIP
  - Linux: DEB e RPM
- **Plugins**: Integração com Vite para build otimizado
- **Fuses**: Configurações de segurança do Electron

### Vite Integration

Três configurações Vite separadas:
- **Main**: Para o processo principal
- **Preload**: Para scripts de preload
- **Renderer**: Para a interface React

## 🛡️ Segurança

O projeto implementa as melhores práticas de segurança do Electron:
- Context isolation habilitado
- Node.js integration desabilitado no renderer
- Preload scripts para comunicação segura
- Fuses configurados para máxima segurança

## 📄 Licença

AGPL v3 License - veja o arquivo LICENSE para detalhes.

**Importante**: Este projeto usa AGPL v3, a licença mais restritiva disponível. Qualquer trabalho derivado deve ser AGPL v3, incluindo uso em serviços web/SaaS. Contribuições são bem-vindas, mas não é permitido criar versões proprietárias ou usar em serviços fechados.

## 👨‍💻 Autor

**Romualdo Junior**
- Email: romualdo.jrr@gmail.com

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor:
1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Abra um Pull Request

## 🗺️ Roadmap

- **v1.0**: Interface básica e conexão com clusters
- **v1.1**: Gerenciamento completo de recursos
- **v1.2**: Monitoramento e métricas
- **v2.0**: Funcionalidades avançadas e plugins