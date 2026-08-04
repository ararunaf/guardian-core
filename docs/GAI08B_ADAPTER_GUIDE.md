# GAI-08B — Adapter Guide

## Arquitetura

```
SuperContab
  → guardian-supercontab-adapter
    → Guardian SDK (Public API)
      → Guardian Core
```

## Adapter oficial

**Nome:** `guardian-supercontab-adapter`  
**Versao:** `1.0.0`  
**Registro:** `GuardianAdapterRegistry`

No Core product-agnostic: base em `adapters/base_adapter.ts` + `adapters/adapter_registry.ts`.  
A implementacao SuperContab permanece no lado do produto (bridge UKAL, providers binding).

## Responsabilidades do adapter

1. Inicializacao do produto no Guardian
2. Injecao de dependencias de produto (ex.: UKAL consult)
3. Configuracao e binding de providers
4. Bridge de eventos para o Event Bus
5. Registro no `GuardianAdapterRegistry` via `bindProductAdapter`

## Proibido no Core

- Regras de negocio SuperContab
- Imports `@/services/*` fora da camada de adapter do produto
- Logica de engines alterada pelo adapter

## Dashboard

Nao importa SuperContab diretamente. Consome apenas dados expostos via SDK / registry (READ ONLY).

## Checklist de conexao

- [x] Adapter registrado
- [x] Public API como unica entrada
- [x] Compatibility check OK
- [x] Sem dependencia direta Core ← SuperContab