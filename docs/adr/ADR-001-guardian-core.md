# ADR-001 — Guardian Core

- **Status:** Accepted
- **Date:** GAI-08C (Enterprise Stabilization)
- **Deciders:** Guardian Core architecture board / IA Easy
- **Tags:** core, product, versioning, multi-product

## Context

Guardian evolved inside product monorepos (notably SuperContab) as a cognitive engineering platform: runtime, contracts, event bus, registries, knowledge/memory/ontology, dashboard, and plugin infrastructure. As capabilities matured through GAI-00..GAI-08, coupling risk increased: product business rules could leak into the platform, and other products (future MedicFlow, etc.) could not reuse a frozen Core safely.

GAI-08A froze and extracted the Core. GAI-08B published an independent `guardian-core` repository at SemVer **1.0.0**. GAI-08C must lock the architectural identity of that product so downstream sprints (GAI-09+) extend it without rewriting boundaries.

Questions this ADR answers:

1. Is Guardian Core a library embedded in one product, or an independent multi-product platform?
2. What is in-scope for 1.0.0 versus deferred to later GAI sprints?
3. How do we keep Core free of product business rules while remaining useful?

## Decision

We accept **Guardian Core** as an **independent, product-agnostic enterprise platform** versioned at **1.0.0**, consumed only through the public stack:

```
Product -> guardian-*-adapter -> Guardian SDK (Public API) -> Guardian Core
```

In-scope for 1.0.0:

- SDK, Public API, Runtime, Registry, Contracts, Providers model
- Knowledge Platform, Engineering Memory, Engineering Ontology
- Dashboard (READ ONLY), Plugin infrastructure, Compatibility Layer, Version manifest

Out of scope for 1.0.0 / GAI-08C:

- Business plugins (Patch Generator, Test Guardian, Deployment Guardian, …)
- ML / LLM / auto-learning
- Product-specific rules (SuperContab, MedicFlow, …) inside Core modules
- New behavioral features during GAI-08C (stabilization and certification only)

Core MUST remain extractable, certifiable without SuperContab (`npm run cert:gai08c`), and SemVer-governed (`1.0.0+gai08c`, certification `GAI-08C`, tag `guardian-core-v1.0.0`).

## Consequences

### Positive

- Multiple products can adopt the same Core via adapters without forking engines.
- Certification and release docs can treat Core as a first-class product.
- Clear readiness gate for GAI-09 (Software Architecture Specialist).

### Negative / Trade-offs

- Product teams must invest in adapters instead of importing Core internals.
- Some convenient cross-imports from monorepo era are forbidden.
- Feature velocity for business plugins is deferred to GAI-09+.

### Compliance

- Violations (product rules in Core, direct Timeline writes, mutable Dashboard engines) fail architectural review and certification.
- Changes to this decision require a new ADR and SemVer evaluation (likely MAJOR if public boundaries move).

## References

- `docs/GAI08C_RELEASE.md`
- `docs/GAI08C_VERSIONING.md`
- `docs/ARCHITECTURE.md`
- ADR-002, ADR-003, ADR-010
