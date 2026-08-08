---
name: javascript-quality
description: Criar, configurar ou revisar testes unitários, cobertura, lint e formatação em projetos JavaScript do Kubis. Use ao alterar testes Vitest/Testing Library, configurar cobertura V8, ESLint, Prettier, scripts de qualidade, componentes React, código Electron ou código JavaScript de produção.
---

# Qualidade JavaScript

Manter o ciclo de qualidade do Kubis com Vitest, Testing Library, cobertura V8, ESLint e Prettier. Executar verificações sem modificar arquivos; reservar comandos de correção para ações explícitas.

## Fluxo obrigatório

1. Identificar o comportamento público alterado e escrever ou atualizar o teste unitário correspondente.
2. Executar os testes relevantes; usar mocks para I/O, Electron, tempo, rede e SDKs externos.
3. Executar a cobertura e manter no mínimo 80% de `lines`, `functions`, `branches` e `statements`.
4. Executar lint e checagem de formatação.
5. Corrigir falhas de teste, lint ou formato antes de concluir; usar comandos `:fix` e `format` somente quando a alteração de arquivos for permitida.

Consultar [references/quality-configuration.md](references/quality-configuration.md) para dependências, scripts e configurações recomendadas.

## Testes unitários

- Testar comportamentos observáveis, estados, callbacks e contratos públicos; não testar detalhes de implementação.
- Usar Testing Library com queries acessíveis (`getByRole`, `getByLabelText`, `findByRole`) antes de recorrer a seletores de classe ou `data-testid`.
- Usar `userEvent` para interações e `await` para atualizações assíncronas.
- Limpar mocks e DOM entre testes; restaurar relógios falsos, listeners e variáveis de ambiente.
- Isolar cada teste: não depender da ordem de execução, rede, relógio real, filesystem ou credenciais.
- Usar snapshots apenas para estruturas pequenas e estáveis; preferir asserções semânticas para UI.

Para código do processo principal e preload, testar serviços e contratos de IPC como módulos JavaScript. Não iniciar uma janela Electron real em testes unitários.

## Cobertura

Configurar o provider `v8` e gerar relatórios `text`, `html` e `lcov`. Incluir explicitamente arquivos de `src/**/*.{js,jsx}` para que código ainda não importado também conte na cobertura.

Excluir testes, setup de testes, tipos de build e código gerado. Não usar exclusões ou comentários de ignore para ocultar código não testado; admitir uma exceção apenas para caminhos realmente inacessíveis e justificar no código.

Cobrir os dois lados de condicionais e os cenários de sucesso, entrada inválida e erro recuperável. Não elevar métricas adicionando testes sem asserções significativas.

## Lint e formatação

Usar ESLint com flat config em `eslint.config.js` e aplicar regras de JavaScript recomendado, React Hooks e React Refresh. Configurar ambientes apropriados por arquivo: browser no renderer, Node no main/preload e Vitest nos testes.

Usar Prettier somente para estilo. Manter suas regras de estilo em arquivo de configuração e desativar regras estilísticas conflitantes do ESLint com `eslint-config-prettier`.

Usar comandos de verificação em automação:

```text
npm run lint
npm run format:check
npm run test:coverage
```

Usar `npm run lint:fix` e `npm run format` apenas para corrigir localmente e revisar o diff resultante.

## Critérios de revisão

- Confirmar que cada comportamento novo ou corrigido possui teste de sucesso e de falha quando aplicável.
- Confirmar que mocks simulam o limite externo e não o módulo em teste.
- Confirmar que os quatro limites de cobertura são 80% ou maiores.
- Confirmar que `lint` e `format:check` não alteram arquivos e terminam com sucesso.
- Confirmar que formatação, regras e exclusões não incluem `node_modules`, `out`, `coverage` ou `.vite`.
