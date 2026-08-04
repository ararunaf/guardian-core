# ADR-010 — Public API

- **Status:** Accepted
- **Date:** GAI-08C
- **Deciders:** Guardian Core architecture board / IA Easy
- **Tags:** public-api, exports, packaging, stability

## Context

Package consumers need one authoritative entry for what is supported. Even with an SDK facade (ADR-002), ambiguous exports across many subpaths create support burden and accidental breaking changes.

GAI-08B defined `GuardianPublicApi` / `GUARDIAN_PUBLIC_API_EXPORTS` and paths `@iaeasy/guardian-core/sdk` and `@iaeasy/guardian-core/public-api`. GAI-08C stabilizes that decision for enterprise use and independent certification.

## Decision

The **Public API** is the unique supported public entry of the Guardian Core package.

Decisions:

1. `GuardianPublicApi` (and the documented exports list) enumerates the supported surface.
2. `@iaeasy/guardian-core/public-api` and `@iaeasy/guardian-core/sdk` are the supported entry points; they must remain coherent.
3. Anything not listed in the public exports is non-public, even if TypeScript resolves it.
4. Public API version aligns with Core **1.0.0**; breaking export removals/renames require MAJOR.
5. Deprecations follow announce -> warn -> remove across majors.
6. GAI-08C does not expand Public API features; it documents and certifies the frozen surface.

Certification (`npm run cert:gai08c`) MUST verify Public API presence/consistency as part of independent gates.

## Consequences

### Positive

- Supportable enterprise contract.
- Safer refactors behind the facade.
- Clear docs for adapter/plugin authors.

### Negative / Trade-offs

- Requests for niche internals must go through explicit API design (MINOR/MAJOR).
- Maintaining dual entry paths requires continuous alignment checks.

### Compliance

- Publishing undocumented exports as “supported” without SemVer review violates this ADR.
- Product code importing non-public paths fails architecture review.

## References

- `docs/PUBLIC_API.md`
- `docs/GAI08B_PUBLIC_API.md`
- `docs/GAI08C_CERTIFICATION.md`
- ADR-001, ADR-002
