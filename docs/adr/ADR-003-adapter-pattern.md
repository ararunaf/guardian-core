# ADR-003 — Adapter Pattern

- **Status:** Accepted
- **Date:** GAI-08C
- **Deciders:** Guardian Core architecture board / IA Easy
- **Tags:** adapter, registry, multi-product, providers

## Context

Guardian must serve multiple products without embedding their domain rules. SuperContab already connects through `guardian-supercontab-adapter`. Future products (e.g. MedicFlow) need the same extension point.

If products imported Core engines directly, we would re-create monorepo coupling: Core releases would break products, and product rules would pollute shared code. If Core contained per-product modules, extractability and independent certification would fail.

We need a mandatory integration pattern with registry, provider binding, and Event Bus connectivity.

## Decision

All product integration MUST use the **Adapter Pattern**:

```
Product -> guardian-<product>-adapter -> SDK/Public API -> Core
```

Canonical APIs:

- `bindProductAdapter`
- `GuardianAdapterRegistry`
- `getGuardianAdapterRuntimeApi` (and related SDK helpers)

Adapter responsibilities:

1. Initialize product context for Guardian.
2. Register providers belonging to the product.
3. Connect product signals to the Event Bus.
4. Pass Compatibility before considering binding valid.
5. Keep business rules in the product/adapter — never in Core engines.

Core provides only product-agnostic base/registry modules (e.g. `adapters/base_adapter.ts`, `adapters/adapter_registry.ts`) consumed via SDK. Official reference adapter: `guardian-supercontab-adapter` (lives with SuperContab). Documented fictional example: `guardian-medicflow-adapter` in `GAI08C_ADAPTER_GUIDE.md`.

Adapter Version surface for 1.0.0 is **1.0.0**.

## Consequences

### Positive

- True multi-product reuse of one Core.
- Independent `cert:gai08c` without SuperContab installed.
- Clear ownership: product teams own adapters; Core team owns contracts.

### Negative / Trade-offs

- Extra indirection versus direct imports.
- Adapters must be versioned and compatibility-checked.
- Shared “helpers” that are actually business rules must not be moved into Core.

### Compliance

- PRs that add product domain types/rules under Core are rejected.
- Dashboard remains READ ONLY and must not import product packages.

## References

- `docs/GAI08C_ADAPTER_GUIDE.md`
- `docs/ADAPTERS.md`
- ADR-001, ADR-008, ADR-009
