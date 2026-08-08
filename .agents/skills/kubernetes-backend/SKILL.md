---
name: kubernetes-backend
description: Padronizar backends JavaScript que expõem endpoints, aplicam regras de negócio, acessam persistência ou integram clusters Kubernetes com @kubernetes/client-node. Use ao criar, alterar ou revisar controllers, services, clients, repositories, IPC seguro do Electron e operações Kubernetes no Kubis.
---

# Backend Kubernetes

Implemente casos de uso em três camadas e trate Kubernetes como uma integração externa. Mantenha transporte, domínio e infraestrutura independentes.

## Fluxo obrigatório

Organize cada caso de uso como `Controller → Service → Client ou Repository`.

| Camada | Responsabilidade | Não deve conter |
| --- | --- | --- |
| Controller | Validar DTOs, obter identidade da requisição, chamar o service e mapear resposta/erro para o transporte. | Regra de negócio, chamadas Kubernetes ou consultas de banco. |
| Service | Aplicar regras de negócio, autorização e orquestrar dependências. | Detalhes de HTTP, IPC, SQL ou SDK Kubernetes. |
| Client | Adaptar serviços externos, como a API Kubernetes. | Regras de domínio ou persistência local. |
| Repository | Ler e gravar dados de persistência. | Chamadas HTTP, Kubernetes ou regra de negócio. |

Use `Client` para recursos externos; use `Repository` somente para armazenamento controlado pela aplicação. Não renomeie um client Kubernetes como repository.

## Processo de implementação

1. Definir o DTO de entrada e a resposta sem expor objetos brutos do SDK.
2. Criar ou estender o service com uma responsabilidade de negócio clara.
3. Injetar no service um client ou repository com os métodos mínimos necessários.
4. Implementar a adaptação ao Kubernetes apenas no client.
5. Mapear erros conhecidos no limite da aplicação e testar controller, service e client separadamente.

Preferir composição por fábrica no ponto de inicialização:

```js
const podService = new PodService({ kubernetesClient, auditRepository });
const podController = new PodController({ podService });
```

## DRY e SOLID

- Manter uma única implementação para criação de `KubeConfig`, clients de API e normalização de erros Kubernetes.
- Dar a cada módulo uma responsabilidade; extrair apenas quando houver uma segunda necessidade real, não para criar camadas vazias.
- Depender de contratos pequenos, por exemplo `listPods` e `getPod`, em vez de um client genérico usado por toda a aplicação.
- Receber dependências no construtor ou em uma fábrica; não instanciar SDKs dentro de controllers ou services.
- Acrescentar novos recursos por novos métodos/adapters, preservando contratos existentes quando possível.
- Fazer services dependerem de interfaces comportamentais; testes devem fornecer fakes simples dessas dependências.

## Kubernetes no Electron

Executar `@kubernetes/client-node` exclusivamente no processo principal do Electron. O preload deve expor uma API mínima orientada a casos de uso; o renderer só envia DTOs e recebe dados já mapeados.

Nunca expor ao renderer, retornar em DTOs ou registrar em logs:

- conteúdo de `kubeconfig`, tokens, chaves privadas, certificados ou headers de autorização;
- instâncias de `KubeConfig` e clients da biblioteca;
- mensagens de erro que contenham credenciais ou configurações completas.

Exigir confirmação explícita e autorização antes de operações mutáveis. Preferir contextos RBAC com privilégio mínimo e separar operações de leitura das de escrita.

## Padrão de client

Consultar [references/kubernetes-client.md](references/kubernetes-client.md) antes de implementar ou alterar uma integração com a biblioteca.

O client deve esconder o SDK e devolver dados de aplicação:

```js
class KubernetesPodClient {
  constructor({ coreApi }) {
    this.coreApi = coreApi;
  }

  async listPods(namespace) {
    try {
      const response = await this.coreApi.listNamespacedPod({ namespace });
      return response.items.map((pod) => ({
        name: pod.metadata?.name,
        namespace: pod.metadata?.namespace,
        phase: pod.status?.phase,
      }));
    } catch (error) {
      throw mapKubernetesError(error, { operation: 'list pods', namespace });
    }
  }
}
```

Normalizar erros no adapter, preservando uma causa segura para diagnóstico. Distinguir falhas de autenticação, autorização, recurso inexistente, conflito e indisponibilidade; não converter tudo em `Error` genérico.

## Critérios de revisão

- Confirmar que o controller não acessa Kubernetes nem persistência.
- Confirmar que o service não importa Electron, HTTP ou `@kubernetes/client-node`.
- Confirmar que apenas clients importam o SDK e que cada acesso possui contexto/namespace explícito quando aplicável.
- Confirmar validação de DTO, autorização e testes de sucesso/falha antes de conectar o renderer.
