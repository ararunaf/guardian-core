# ADR-002 — SDK Publica

- **Status:** Accepted
- **Date:** GAI-08C
- **Deciders:** Guardian Core architecture board / IA Easy
- **Tags:** sdk, public-api, stability, semver

## Context

After extraction, consumers needed a stable way to bootstrap runtime handles, bind adapters, run compatibility checks, and read version/certification metadata. Exposing deep module paths (`runtime/*`, `engines/*`, internal registries) would freeze accidental internals as de-facto API and block refactors.

GAI-08B published the SDK package surface (`@iaeasy/guardian-core/sdk`) alongside Public API exports. Without a firm ADR, teams might:

- import internal files “just once”;
- treat every TypeScript export as public;
- break adapters on PATCH refactors.

We need a single **stable consumption surface** aligned with SemVer 1.0.0.

## Decision

The **Guardian SDK** is the supported programmatic facade over Core for adapters, harnesses, and (indirectly) products. Together with the Public API entry (`@iaeasy/guardian-core/public-api` / `GuardianPublicApi`), it is the **only** supported import surface for external code.

Decisions:

1. SDK version tracks Core at **1.0.0** for GAI-08C.
2. Documented SDK exports are SemVer-protected (breaking changes require MAJOR).
3. Undocumented deep imports are unsupported and may change without MAJOR.
4. SDK exposes contracts/interfaces needed for adapters, compatibility, version, and plugin declaration — not product business APIs.
5. Stabilization GAI-08C adds **no** new SDK features beyond documentation/certification alignment.

Typical SDK responsibilities:

- obtain runtime / public handle;
- `bindProductAdapter` / adapter runtime helpers;
- `runCompatibilityCheck` (or equivalent);
- read version/certification markers;
- types for manifests/descriptors where exported.

## Consequences

### Positive

- Clear support boundary for adapter authors.
- Enables independent certification without product repos.
- Allows internal Core refactors behind a stable facade.

### Negative / Trade-offs

- Some advanced diagnostics may require new explicit SDK exports (MINOR) instead of ad-hoc internals.
- Dual paths (`/sdk` and `/public-api`) must stay consistent (see ADR-010).

### Compliance

- Code review MUST reject product imports of Core internals.
- Deprecations follow announce -> warn -> remove across majors (`GAI08C_VERSIONING.md`).

## References

- `docs/SDK.md`
- `docs/PUBLIC_API.md`
- `docs/GAI08B_SDK.md`
- ADR-001, ADR-010
