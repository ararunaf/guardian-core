# ADR-007 — Engineering Ontology

- **Status:** Accepted
- **Date:** GAI-08C
- **Deciders:** Guardian Core architecture board / IA Easy
- **Tags:** ontology, semantics, engineering, platform

## Context

Engineering Ontology (GAI-06) provides shared semantic structure for Guardian concepts — enabling consistent interpretation across Knowledge, Memory, plugins, and future specialists. If each product invented incompatible vocabularies inside Core, multi-product reuse would collapse.

Conversely, encoding SuperContab taxonomies as mandatory Core ontology would destroy product-agnosticism.

## Decision

**Engineering Ontology** is a Core subsystem at **1.0.0** that defines Guardian-level engineering semantics.

Decisions:

1. Ontology is product-agnostic; product taxonomies extend via adapters/providers or future plugin packs — not by forking Core ontology for one customer.
2. Knowledge and Memory SHOULD align terms with Ontology where shared meaning matters.
3. Public contracts expose only stable ontology surfaces; experimental vocabularies remain internal or versioned explicitly.
4. Ontology changes that break published semantics follow SemVer (additive MINOR; incompatible MAJOR).
5. GAI-08C performs stabilization/certification only — no ontology feature expansion.

## Consequences

### Positive

- Shared language for events, plugins, and specialists.
- Safer cross-product analytics later without rewriting Core.
- Certification can validate ontology module presence independently.

### Negative / Trade-offs

- Mapping product jargon to Guardian ontology requires adapter work.
- Governance needed to prevent uncontrolled ontology sprawl.

### Compliance

- PRs that hardcode a single product’s chart-of-accounts / clinical codes as required Core ontology are rejected.
- Consumers must not rely on undocumented ontology internals.

## References

- ADR-005, ADR-006
- `docs/ARCHITECTURE.md`
- `docs/GAI08C_RELEASE_NOTES.md`
