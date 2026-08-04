# ADR-005 — Engineering Knowledge Platform

- **Status:** Accepted
- **Date:** GAI-08C
- **Deciders:** Guardian Core architecture board / IA Easy
- **Tags:** knowledge, ekp, engineering, platform

## Context

Guardian’s value proposition includes capturing and organizing **engineering knowledge** — not merely running product workflows. Across GAI-04..GAI-08 the Engineering Knowledge Platform (EKP) was built and closed as part of the Core freeze.

Risks without an ADR:

- treating EKP as SuperContab documentation storage;
- allowing arbitrary product schemas to become Core schema without Compatibility;
- conflating Knowledge with Memory/Ontology responsibilities.

We need a durable decision that EKP is a Core capability at 1.0.0, product-agnostic, and accessed through public contracts.

## Decision

The **Engineering Knowledge Platform** is a first-class Core subsystem in Guardian 1.0.0.

Decisions:

1. EKP stores/serves engineering knowledge abstractions independent of any single product domain.
2. Product-specific knowledge ingestion happens via adapters/providers, not hardwired Core importers.
3. EKP collaborates with Engineering Memory (ADR-006) and Ontology (ADR-007) but remains a distinct concern.
4. Public access is mediated by SDK/Public API / contracts — not private module graphs.
5. GAI-08C does not add EKP features; it certifies presence/versioning for independent certification.
6. Knowledge surface participates in version matrix at **1.0.0**.

## Consequences

### Positive

- Shared knowledge substrate for all future Guardian specialists.
- Clear separation from product CMS/content stores.
- Certifiable in `cert:gai08c` without SuperContab corpora.

### Negative / Trade-offs

- Products must map their corpora through adapters/providers.
- Cross-cutting search/ML enrichment is deferred (not part of 1.0.0).

### Compliance

- Product document models must not be copied into Core as required types.
- Breaking EKP public contracts requires MAJOR SemVer.

## References

- `docs/ARCHITECTURE.md`
- `docs/GAI08C_RELEASE_NOTES.md`
- ADR-006, ADR-007
