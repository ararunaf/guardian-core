# GAI-08B — Public API

## Principio

`GuardianPublicApi` / `GUARDIAN_PUBLIC_API_EXPORTS` e a **unica** entrada publica para produtos e adapters.

## Exports oficiais

| Export | Uso |
|--------|-----|
| `describeGuardianSdk` | Snapshot do SDK |
| `createGuardianSdkHandle` | Handle de runtime do SDK |
| `getGuardianPublicApi` | Superficie Public API |
| `describeGuardianVersionManifest` | Manifesto 1.0.0 |
| `runCompatibilityCheck` | Compatibility Layer |
| `describeGuardianCore` | Descricao do Core |
| `describeGuardianCoreFreeze` | Estado de freeze |
| `GuardianPluginRegistry` | Registry de plugins |
| `GuardianPluginLoader` | Loader de plugins |
| `GuardianAdapterRegistry` | Registry de adapters |
| `bindProductAdapter` | Bind de adapter de produto |
| `getGuardianAdapterRuntimeApi` | API de runtime para adapters |

## Import paths

```ts
import { getGuardianPublicApi } from "@iaeasy/guardian-core/sdk";
// ou
import { getGuardianPublicApi } from "@iaeasy/guardian-core/public-api";
```

## Proibido

- Importar engines, providers internos ou bridges SuperContab direto do Core
- Expor novos endpoints sem atualizar Compatibility + Version Manifest

## Certificacao

`PUBLIC_API_CERTIFIED=true` em GAI-08B.