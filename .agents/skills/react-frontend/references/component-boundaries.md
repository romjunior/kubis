# Limites de componentes React

Use esta referência ao decidir onde um componente deve viver e quando extrair uma parte de uma tela.

## Escolha do local

| Caso | Local |
| --- | --- |
| Controle visual genérico, sem domínio | `src/components/ui/` |
| Layout global, tema ou shell da aplicação | `src/components/` ou `src/App.jsx` |
| Recurso Kubernetes ou comportamento de uma tela | `src/features/<feature>/components/` |
| Leitura/atualização de dados da feature | `src/features/<feature>/hooks/` |
| Chamada ao preload e mapeamento de DTO | `src/features/<feature>/api/` |

Não mova um componente de domínio para `components/ui` só porque ele é usado em duas telas. Promova-o somente se seu comportamento e suas props forem independentes de Kubernetes e do domínio.

## Sinais para extrair

Extraia um componente quando pelo menos uma condição se aplicar:

- Renderiza uma unidade reconhecível da interface, como linha, card, badge, menu, estado vazio ou dialog.
- Possui eventos, estado local, acessibilidade ou teste próprios.
- Aparece em mais de uma tela com a mesma semântica.
- Faz a página perder legibilidade por misturar responsabilidade de layout e detalhe visual.

Não extraia somente para reduzir linhas. Mantenha componentes muito pequenos junto ao pai quando não forem reutilizáveis e não tiverem comportamento próprio.

## Exemplo de composição

```jsx
function WorkloadsPage() {
  const { workloads, isLoading, error, refresh } = useWorkloads();

  if (isLoading) return <WorkloadsLoadingState />;
  if (error) return <ErrorState onRetry={refresh} />;
  if (workloads.length === 0) return <WorkloadsEmptyState />;

  return <WorkloadTable workloads={workloads} onRefresh={refresh} />;
}
```

`WorkloadsPage` coordena dados; `WorkloadTable` decide a tabela; `WorkloadRow` trata uma linha; `WorkloadStatusBadge` mapeia somente o estado visual. Evite tornar `WorkloadsPage` responsável por todos esses detalhes.

## Interfaces de dados

Padronize a API da feature em funções pequenas e orientadas ao caso de uso:

```js
export async function listWorkloads({ context, namespace }) {
  const result = await window.kubis.workloads.list({ context, namespace });
  return result.items.map(toWorkloadViewModel);
}
```

Centralize o uso de `window.kubis` nessa camada. Em componentes e hooks, dependa de `listWorkloads`, o que permite mockar a função sem simular o Electron inteiro.
