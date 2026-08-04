# ADR-009 — Compatibility Layer

- **Status:** Accepted
- **Date:** GAI-08C
- **Deciders:** Guardian Core architecture board / IA Easy
- **Tags:** compatibility, versioning, adapters, plugins, semver

## Context

With SDK, adapters, plugins, schemas, and Core evolving on SemVer tracks, silent mismatches cause runtime failures that look like product bugs. GAI-08B introduced/certified a Compatibility Layer under `compatibility/` that validates adapters, versions, plugins, contracts, and SDK readiness, emitting `guardian.compatibility.checked`.

Without mandating Compatibility as a gate, registries might load incompatible plugins/adapters and undermine the 1.0.0 stability promise.

## Decision

The **Compatibility Layer** is mandatory infrastructure at version **1.0.0**.

Decisions:

1. Adapters SHOULD run compatibility checks before/at `bindProductAdapter` success path.
2. Plugins MUST pass compatibility before Loader activation.
3. Checks cover relevant dimensions: Core/SDK/Schema/Plugin/Adapter versions and contract readiness.
4. Results are observable (return status + Event Bus event when available).
5. Incompatible components must not be activated; fail closed.
6. Compatibility Version surface is **1.0.0**; GAI-08C adds no new feature dimensions beyond stabilization/certification docs.
7. SemVer policy in `GAI08C_VERSIONING.md` defines what constitutes incompatible change.

## Consequences

### Positive

- Predictable multi-product upgrades.
- Certification can assert Compatibility independently of SuperContab.
- Clear operator signal when a plugin/adapter is out of range.

### Negative / Trade-offs

- Extra step in adapter/plugin bootstrap.
- False failures if version manifests drift — requires discipline in releases.
- Highly dynamic “any version” loading is intentionally disallowed.

### Compliance

- Bypassing Compatibility to force-load plugins/adapters is forbidden in supported deployments.
- Changing compatibility predicates in breaking ways requires MAJOR.

## References

- `docs/COMPATIBILITY.md`
- `docs/GAI08C_VERSIONING.md`
- `docs/GAI08C_CERTIFICATION.md`
- ADR-003, ADR-004
