# GAI-08B — Guardian Core Publication

## Objetivo

Publicar o Guardian Core como produto independente no repositorio `guardian-core`, com SDK, Public API, Adapter Layer, Plugin Model, Compatibility Layer e Version Manifest em **1.0.0**.

## Arquitetura oficial

```
SuperContab
  → guardian-supercontab-adapter
    → Guardian SDK
      → Guardian Core
```

## Repositorio

| Item | Valor |
|------|-------|
| Remoto | https://github.com/ararunaf/guardian-core |
| Local | `d:\Projetos\guardian-core` |
| Pacote | `@iaeasy/guardian-core@1.0.0` |
| Tag | `guardian-core-v1.0.0` |

## Versoes 1.0.0

Core · SDK · Compatibility · Schema · Plugin · Adapter

Build: `1.0.0+gai08b` · Certificacao: `GAI-08B`

## Escopo desta sprint

- Extracao fisica e publicacao do Core
- Documentacao, README, CHANGELOG, versionamento
- Adapter SuperContab conectado via SDK Public API
- Certificacao cruzada e GO para GAI-09

## Fora de escopo

- Novas funcionalidades de engines
- Patch Generator / Test Guardian / Deployment Guardian
- ML / LLM / auto-learning
- Mudanca de comportamento vs. Core congelado em GAI-08A

## Regras

- Dashboard permanece **READ ONLY**
- Timeline somente via Guardian Event Bus
- Produtos nao importam internos do Core — apenas SDK Public API
- Adapter e a unica ponte SuperContab ↔ Guardian