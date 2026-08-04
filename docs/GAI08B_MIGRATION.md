# GAI-08B — Migracao SuperContab → guardian-core

## De / Para

| Antes (GAI-08A) | Depois (GAI-08B) |
|-----------------|------------------|
| Core hospedado no monorepo | Repositorio `guardian-core` independente |
| Versoes 0.8.0 (freeze) | Versoes **1.0.0** publicadas |
| Sem repo remoto dedicado | https://github.com/ararunaf/guardian-core |

## Passos de consumo no SuperContab

1. Dependencia `@iaeasy/guardian-core@1.0.0` (path local ou registry)
2. Remover imports diretos de internos do Core
3. Usar exclusivamente `guardian-supercontab-adapter`
4. Entrar via `@iaeasy/guardian-core/sdk` ou `/public-api`
5. Rodar Compatibility check na inicializacao
6. Confirmar Dashboard READ ONLY e Timeline via Event Bus

## Sem mudanca de comportamento

Engines, Knowledge Platform, Memory, Ontology, UKAL (via adapter), navegacao e composition root do SuperContab permanecem equivalentes ao freeze GAI-08A.

`NO_BEHAVIOR_CHANGE_DETECTED=true`

## Rollback

Manter tag `guardian-core-v1.0.0` e pin da dependencia; reverter o adapter para o path anterior se necessario. Sem migracao de schema de dados nesta sprint.