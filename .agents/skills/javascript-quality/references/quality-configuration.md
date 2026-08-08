# Configuração de qualidade do Kubis

Aplicar estas convenções ao configurar a qualidade do projeto. O renderer já usa Vite, React, JSDOM, Vitest e Testing Library em `vite.renderer.config.mjs` e `src/test/setup.js`.

## Dependências

Instalar as ferramentas como dependências de desenvolvimento:

```bash
npm install -D @vitest/coverage-v8 eslint @eslint/js globals eslint-plugin-react-hooks eslint-plugin-react-refresh prettier eslint-config-prettier
```

Usar `@vitest/coverage-v8`: o provider V8 é recomendado pela documentação do Vitest para runtimes Node/Chromium. Consultar a [documentação de cobertura do Vitest](https://vitest.dev/guide/coverage.html) antes de trocar de provider.

## Scripts

Adicionar ou manter estes scripts no `package.json`:

```json
{
  "test": "vitest run --config vite.renderer.config.mjs",
  "test:watch": "vitest --config vite.renderer.config.mjs",
  "test:coverage": "vitest run --coverage --config vite.renderer.config.mjs",
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "format:check": "prettier . --check",
  "format": "prettier . --write"
}
```

Não usar `prettier --write` em CI; `--check` retorna falha quando existir arquivo fora do formato. Consultar a [CLI do Prettier](https://prettier.io/docs/cli) para globs e opções.

## Vitest e cobertura

Acrescentar o bloco de cobertura à configuração `test` existente em `vite.renderer.config.mjs`:

```js
coverage: {
  provider: 'v8',
  reporter: ['text', 'html', 'lcov'],
  include: ['src/**/*.{js,jsx}'],
  exclude: [
    'src/**/*.test.{js,jsx}',
    'src/test/**',
    'src/main.js',
    'src/preload.js',
  ],
  thresholds: {
    lines: 80,
    functions: 80,
    branches: 80,
    statements: 80,
  },
}
```

Revisar exclusões conforme a superfície efetivamente testável aumenta. Ao adicionar testes para main/preload, removê-los da lista de exclusão e configurar o ambiente adequado, em vez de manter cobertura artificialmente alta.

## ESLint

Criar `eslint.config.js` como flat config, formato padrão do ESLint atual. Consultar a [documentação de configuração do ESLint](https://eslint.org/docs/latest/use/configure/) para mudanças de API.

Aplicar estes princípios:

- Ignorar `node_modules`, `out`, `coverage` e `.vite`.
- Aplicar `@eslint/js` recomendado a arquivos JavaScript e JSX.
- Declarar globals de browser no renderer, Node no processo principal/preload e Vitest nos testes.
- Habilitar as regras recomendadas de `eslint-plugin-react-hooks` e `eslint-plugin-react-refresh` para JSX.
- Colocar `eslint-config-prettier` por último, removendo conflitos de estilo com Prettier.

## Prettier

Criar `.prettierrc.json` com opções explícitas e uma `.prettierignore` que cubra os mesmos artefatos gerados ignorados pelo lint. Usar uma configuração mínima e estável; evitar opções cosméticas que não sejam uma preferência do projeto.

Exemplo inicial:

```json
{
  "singleQuote": true,
  "trailingComma": "all"
}
```

O lint encontra problemas de código; o Prettier aplica estilo. Não tentar fazer o ESLint substituir o formatador.
