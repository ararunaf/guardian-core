# ADR-006 — Engineering Memory

- **Status:** Accepted
- **Date:** GAI-08C
- **Deciders:** Guardian Core architecture board / IA Easy
- **Tags:** memory, engineering, state, platform

## Context

Engineering Memory was introduced (GAI-05) to retain engineering-relevant state/history for Guardian workflows — distinct from ephemeral runtime caches and distinct from product databases (accounting ledgers, clinical records, etc.).

Without boundaries, Memory could become:

- a dumping ground for product PII/business entities;
- a writable side channel that bypasses Event Bus observability;
- an unstable internal store that adapters reach via deep imports.

GAI-08C needs Memory locked as a Core capability with public contracts and certification coverage.

## Decision

**Engineering Memory** is an official Core subsystem at version **1.0.0**.

Decisions:

1. Memory holds engineering-oriented records aligned with Guardian concerns (not product transactional systems of record).
2. Mutations/observations that matter to Timeline must be reflected via Event Bus policies — Memory is not a silent bypass for dashboard timelines.
3. External consumers interact through SDK/contracts; internals may evolve under SemVer rules.
4. Memory complements Knowledge (durable knowledge) and Ontology (semantic structure) without replacing them.
5. GAI-08C certifies Memory presence and independence from SuperContab; no new Memory features in this sprint.

## Consequences

### Positive

- Specialists in GAI-09+ can rely on a stable memory substrate.
- Independent certification can assert Memory without product DBs.
- Clearer data classification (engineering vs product SoR).

### Negative / Trade-offs

- Product teams must not expect Memory to replace their own persistence.
- Retention/GDPR-like policies for any stored content remain product/adapter responsibilities when bridging data.

### Compliance

- Storing mandatory product business entities solely in Core Memory is an architecture violation.
- Breaking Memory public contracts requires MAJOR.

## References

- ADR-005, ADR-007, ADR-008
- `docs/GAI08C_CERTIFICATION.md`
