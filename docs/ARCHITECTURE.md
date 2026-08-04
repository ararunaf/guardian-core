# Architecture

## Official stack

```
Product (e.g. SuperContab)
  → guardian-*-adapter
    → Guardian SDK (Public API)
      → Guardian Core
```

## Core layers

Runtime → Contracts → Event Bus → Registry → Providers → Knowledge / Memory / Ontology → Dashboard (READ ONLY) → Plugins → Adapters (product side)

## Rules

- Products never import Core internals
- Timeline events only via Event Bus
- No engine behavior changes in publication releases without SemVer major