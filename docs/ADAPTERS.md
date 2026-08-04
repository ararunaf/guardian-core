# Adapters

## Role

Bridge a product into Guardian without polluting Core with product code.

## Official guide (GAI-08C)

**Full Adapter Development Guide:** [`GAI08C_ADAPTER_GUIDE.md`](./GAI08C_ADAPTER_GUIDE.md)

Related ADR: [`adr/ADR-003-adapter-pattern.md`](./adr/ADR-003-adapter-pattern.md)

## Core modules

- `adapters/base_adapter.ts`
- `adapters/adapter_registry.ts` (`GuardianAdapterRegistry`)
- Public API: `bindProductAdapter`, `getGuardianAdapterRuntimeApi`

## Official product adapter

`guardian-supercontab-adapter` (lives with SuperContab; registers against Core registry).

Adapter version: **1.0.0**
