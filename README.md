# Kubis

O Kubis é um aplicativo desktop em desenvolvimento para oferecer uma interface visual e segura de gerenciamento de clusters Kubernetes.

Atualmente, o projeto contém a base da aplicação Electron com React, Vite e Tailwind CSS, além de uma interface inicial de dashboard. A comunicação com clusters Kubernetes ainda não está disponível. No MVP, ela será implementada com [`@kubernetes/client-node`](https://github.com/kubernetes-client/javascript) e ficará isolada no processo principal do Electron.

## Visão do MVP

O Kubis deverá permitir:

- selecionar e alternar entre contextos Kubernetes;
- visualizar recursos do cluster em uma interface gráfica;
- acompanhar o estado de workloads e outros objetos Kubernetes;
- executar operações administrativas de forma explícita e segura.

Esses recursos são objetivos do MVP e não representam funcionalidades já disponíveis na versão atual.

## Arquitetura planejada

```text
React (renderer) → API restrita do preload → processo principal do Electron
                                                     ↓
                                       @kubernetes/client-node
                                                     ↓
                                             Cluster Kubernetes
```

O renderer não deverá acessar diretamente o sistema de arquivos, o `kubeconfig` ou o cliente Kubernetes. O processo principal será responsável pela comunicação com o cluster, enquanto o preload exporá somente operações necessárias por meio de uma API restrita.

## Pré-requisitos

- Node.js em uma versão LTS compatível com o Electron 43;
- npm;
- para a futura integração: um `kubeconfig` válido e acesso ao cluster Kubernetes desejado.

## Instalação e desenvolvimento

Clone o repositório, instale as dependências e inicie a aplicação:

```bash
npm install
npm start
```

## Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `npm start` | Inicia a aplicação Electron em modo de desenvolvimento. |
| `npm test` | Executa os testes com Vitest. |
| `npm run test:watch` | Executa os testes em modo de observação. |
| `npm run package` | Gera o pacote da aplicação para a plataforma atual. |
| `npm run make` | Cria os instaladores configurados pelo Electron Forge. |
| `npm run lint` | Exibe o estado atual da configuração de linting. |

## Kubernetes e segurança

Na integração planejada, a autenticação usará o `kubeconfig` local e o contexto selecionado pelo usuário. Credenciais devem permanecer no ambiente local e nunca devem ser:

- commitadas no repositório;
- incluídas em exemplos, screenshots ou arquivos de configuração versionados;
- expostas ao renderer;
- registradas em logs.

Tokens, certificados e outros dados sensíveis também devem ser tratados exclusivamente no processo principal, com a menor superfície de acesso possível.

## Contribuindo

1. Crie uma branch para sua alteração.
2. Faça a implementação e adicione ou atualize os testes relevantes.
3. Execute `npm test` antes de abrir o pull request.
4. Descreva o comportamento alterado e eventuais impactos de segurança.

## Licença

Este projeto declara a licença MIT no `package.json`.
