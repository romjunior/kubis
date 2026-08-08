---
name: react-frontend
description: Construir, alterar ou revisar interfaces React do Kubis com componentes pequenos e reutilizáveis, arquitetura por feature, hooks de dados, Tailwind, acessibilidade e integração segura com o Electron preload. Use ao criar telas, componentes, hooks, estados de UI, fluxos Kubernetes ou testes de interface.
---

# Frontend React do Kubis

Construir interfaces por feature, compor telas com componentes pequenos e manter acesso aos dados fora da UI. Usar os primitives existentes em `src/components/ui` antes de criar equivalentes.

## Estrutura por feature

Organizar novos domínios em `src/features/<feature>/`:

```text
features/workloads/
  WorkloadsPage.jsx
  components/
    WorkloadTable.jsx
    WorkloadRow.jsx
    WorkloadStatusBadge.jsx
    WorkloadActions.jsx
  hooks/
    useWorkloads.js
  api/
    workloads-api.js
  workloads.test.jsx
```

Usar `src/components/ui` somente para primitives genéricos, como `Button`, `Input`, `Sheet`, `Card` e `Badge`. Colocar componentes específicos do domínio na feature. Manter `App.jsx` como composição de layout e rotas, não como depósito de componentes e dados.

## Componentes pequenos e reutilizáveis

- Dar a cada componente uma única responsabilidade visível.
- Preferir composição a um componente monolítico com muitas props booleanas.
- Extrair um componente quando ele for reutilizado, possuir lógica própria ou tornar seu pai difícil de entender.
- Manter repetições locais até haver comportamento estável em mais de um lugar; não criar abstrações genéricas prematuras.
- Expor props orientadas ao domínio, como `pod`, `status` e `onRestart`; não vazar estado global, objetos de SDK ou dados de transporte.
- Usar `children`, slots e primitives existentes para variar layout; criar variantes com `cva` quando a variação for visual e estável.

Uma página deve orquestrar hooks, estados e componentes de domínio. Um componente de domínio deve renderizar e emitir eventos. Um primitive de UI deve fornecer acessibilidade e estilo reutilizável.

## Dados e Electron

Separar UI e transporte:

```text
Page → hook da feature → api da feature → preload API → Electron main
```

- Chamar a API exposta pelo preload apenas em módulos `api/` da feature.
- Fazer hooks controlarem `data`, `isLoading`, `error` e `refresh`; componentes recebem esses valores por props.
- Mapear DTOs do preload para modelos de UI antes de renderizar; não depender de objetos Kubernetes brutos.
- Nunca acessar `kubeconfig`, tokens, certificados, `@kubernetes/client-node` ou módulos Node no renderer.
- Exibir contexto e namespace Kubernetes ativos; exigir confirmação para operações destrutivas e atualizar dados após a conclusão.

## Estados de tela e acessibilidade

Implementar estados explícitos de carregamento, vazio, erro e conteúdo em toda tela que busca dados. Criar e reutilizar componentes de domínio como `LoadingState`, `EmptyState`, `ErrorState`, `ClusterSelector`, `NamespaceSelector` e `ConfirmActionDialog` quando houver comportamento compartilhado.

Usar elementos semânticos, labels, nomes acessíveis e foco gerenciado. Garantir navegação por teclado em menus, dialogs e ações de tabela. Anunciar erros e resultados de operações de forma compreensível; não depender apenas de cor ou ícone para comunicar status.

## Estilo e testes

Usar Tailwind e `cn` de `src/lib/utils.js`; não duplicar classes extensas quando um componente ou variante existente resolver o caso. Preservar suporte a tema claro/escuro fornecido por `ThemeProvider`.

Usar `$javascript-quality` ao criar ou alterar testes. Testar comportamento visível: estados de tela, acessibilidade, interação, callbacks e mensagens de erro. Simular o módulo `api/` da feature em testes de componentes e testar o hook separadamente quando possuir regras de estado relevantes.

## Critérios de revisão

- Confirmar que a feature não chama `window`, IPC ou SDK Kubernetes fora da camada `api/`.
- Confirmar que a página não acumula lógica de linha, badge, menu, dialog ou estado visual reutilizável.
- Confirmar que há estados de loading, vazio e erro quando dados assíncronos estiverem envolvidos.
- Confirmar acessibilidade por teclado, labels e foco para controles interativos.
- Confirmar reuso de primitives existentes e testes para o comportamento novo.
