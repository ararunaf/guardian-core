# GAI-08B — Guardian SDK

## Versao

SDK Version: **1.0.0** (alinhada ao Version Manifest)

## Estrutura

```
sdk/
  public-api/       # unica superficie publica
  exports/
  contracts/
  interfaces/
  version/
  compatibility/
  guardian_sdk.ts
  products.ts
  index.ts
```

## Entrada recomendada

```ts
import {
  createGuardianSdkHandle,
  getGuardianPublicApi,
} from "@iaeasy/guardian-core/sdk";

const handle = createGuardianSdkHandle();
const api = getGuardianPublicApi();
```

## Responsabilidades

- Expor contratos e handles estaveis para adapters
- Isolar o Core de imports de produto
- Declarar targets de produto (`GUARDIAN_SDK_PRODUCT_TARGETS`)
- Validar readiness via Compatibility Layer

## Regras

- Adapters **nao** importam modulos internos fora do SDK / Public API
- Sem mudanca de comportamento de engines nesta sprint
- Dashboard continua READ ONLY

## Evento

`guardian.sdk.generated` (via Event Bus → Timeline)