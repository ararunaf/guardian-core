# GAI-08B — Certificacao Cruzada

## Objetivo

Validar que o Core publicado (repo `guardian-core`) e o SuperContab (via adapter) permanecem coerentes com o freeze GAI-08A.

## Matriz

| Verificacao | Resultado |
|-------------|-----------|
| Repositorio criado e versionado 1.0.0 | PASS |
| SDK + Public API publicaveis | PASS |
| Adapter SuperContab conectado | PASS |
| Plugin infra certificada (zero ativos) | PASS |
| Compatibility Layer | PASS |
| Sem mudanca de comportamento | PASS |
| Dashboard READ ONLY | PASS |
| Timeline via Event Bus | PASS |
| Build / Testes / tsc / Lint | PASS |
| Working tree limpa / Tag / GitHub | PASS |

## Eventos esperados (Event Bus)

1. `guardian.core.frozen` (herdado)
2. `guardian.sdk.generated`
3. `guardian.adapter.loaded`
4. `guardian.compatibility.checked`
5. `guardian.core.certified`

## Resultado

`CROSS_CERTIFICATION_PASSED=true` · `GO_OR_NO_GO=GO` · `READY_FOR_GAI09=true`