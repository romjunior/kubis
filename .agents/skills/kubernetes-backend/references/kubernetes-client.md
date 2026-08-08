# `@kubernetes/client-node`

Use esta referência ao implementar clients Kubernetes no processo principal do Electron. A biblioteca é voltada ao uso no Node.js e pode ser chamada a partir de JavaScript. Consulte a [documentação oficial](https://kubernetes-client.github.io/javascript/) e a [referência de acesso à API do Kubernetes](https://kubernetes.io/docs/tasks/administer-cluster/access-cluster-api/) para detalhes e compatibilidade.

## Instalação e configuração

Instale a dependência no projeto que executará o processo principal:

```bash
npm install @kubernetes/client-node
```

Carregue a configuração local com `KubeConfig`. `loadFromDefault()` localiza o `kubeconfig` padrão, compatível com o usado pelo `kubectl`.

```js
const k8s = require('@kubernetes/client-node');

function createKubernetesClients() {
  const kubeConfig = new k8s.KubeConfig();
  kubeConfig.loadFromDefault();

  return {
    coreApi: kubeConfig.makeApiClient(k8s.CoreV1Api),
    appsApi: kubeConfig.makeApiClient(k8s.AppsV1Api),
    networkingApi: kubeConfig.makeApiClient(k8s.NetworkingV1Api),
    customObjectsApi: kubeConfig.makeApiClient(k8s.CustomObjectsApi),
  };
}
```

Não carregue a configuração no renderer ou no preload. Para selecionar um contexto, faça a mudança e a criação dos clients no processo principal, depois descarte os clients anteriores de forma controlada.

## APIs por recurso

| Recurso | Client recomendado |
| --- | --- |
| Pods, Services, ConfigMaps, Namespaces | `CoreV1Api` |
| Deployments, StatefulSets, DaemonSets, ReplicaSets | `AppsV1Api` |
| Ingresses e NetworkPolicies | `NetworkingV1Api` |
| Recursos customizados (CRDs) | `CustomObjectsApi` |

Crie somente os clients requeridos pelo caso de uso. Encapsule-os em adapters específicos, como `KubernetesPodClient`, em vez de passá-los diretamente aos services.

## Operações e respostas

As versões atuais usam parâmetros de objeto. Por exemplo:

```js
const response = await coreApi.listNamespacedPod({ namespace: 'default' });
const pods = response.items;
```

Não devolva `pods` diretamente à UI. Mapeie os campos necessários para um DTO estável. Em operações de escrita, use o método adequado da API, valide o payload, autorize o usuário e solicite confirmação no fluxo de interface antes de invocar o client.

## Contexto, RBAC e credenciais

- Use o contexto selecionado pelo usuário sem alterar o arquivo `kubeconfig` original.
- Restrinja cada contexto por RBAC ao menor conjunto de verbos e recursos necessário.
- Não registre objetos de configuração, headers nem erros brutos quando puderem conter credenciais.
- Trate `401` como autenticação inválida, `403` como permissão RBAC insuficiente, `404` como recurso ausente e `409` como conflito; preserve erros de rede e indisponibilidade como falhas recuperáveis.
- Recrie os clients ao trocar de contexto. A documentação da biblioteca alerta que credenciais são armazenadas em cache por nome de usuário e podem colidir entre kubeconfigs; evite compartilhar configuração mutável entre contextos.
