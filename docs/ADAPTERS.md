# Adapters

## Role

Bridge a product into Guardian without polluting Core with product code.

## Core modules

- `adapters/base_adapter.ts`
- `adapters/adapter_registry.ts` (`GuardianAdapterRegistry`)
- Public API: `bindProductAdapter`, `getGuardianAdapterRuntimeApi`

## Official product adapter

`guardian-supercontab-adapter` (lives with SuperContab; registers against Core registry).

Adapter version: **1.0.0**