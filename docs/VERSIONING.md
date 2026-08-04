# Versioning

Canonical SemVer policy for Guardian Core **1.0.0** (GAI-08C stabilization):

**Full policy:** [`GAI08C_VERSIONING.md`](./GAI08C_VERSIONING.md)

## Surfaces (all 1.0.0)

| Artifact | Version |
|----------|---------|
| Core | 1.0.0 |
| SDK | 1.0.0 |
| Compatibility | 1.0.0 |
| Schema | 1.0.0 |
| Plugin | 1.0.0 |
| Adapter | 1.0.0 |

- **Build:** `1.0.0+gai08c`
- **Certification:** `GAI-08C`
- **Tag:** `guardian-core-v1.0.0`

## SemVer summary

- **MAJOR** — breaking Public API / contracts
- **MINOR** — additive compatible features
- **PATCH** — compatible fixes
- **Deprecation:** announce -> warn -> remove (across majors)
- Stabilization releases (GAI-08C) introduce **no** new features and **no** breaking changes

Source of truth: `version/version_manifest.ts` and `VERSION.txt`.
