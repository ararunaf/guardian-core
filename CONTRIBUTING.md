# Contributing to Guardian Core

Thank you for helping keep Guardian Core the official engineering platform of IAeasy.

## Rules

1. Keep the Core product-agnostic — no SuperContab or product imports.
2. Adapters must consume only the Public API / SDK surface (`bindProductAdapter`, Public API exports).
3. Do not add Patch Generator, Test Guardian, Deployment Guardian, ML, LLM, or auto-learning in Core.
4. Preserve behavior unless a SemVer bump documents the change (see `docs/GAI08C_VERSIONING.md`).
5. Update `CHANGELOG.md`, `VERSION.txt` and `version/version_manifest.ts` for releases.
6. New adapters and plugins must pass Compatibility Layer checks.
7. Timeline writes only via Event Bus.
8. Dashboard remains READ ONLY.

## Development guides

- Adapter: `docs/GAI08C_ADAPTER_GUIDE.md`
- Plugin: `docs/GAI08C_PLUGIN_GUIDE.md`
- ADRs: `docs/adr/`

## Certification

Before opening a PR that touches Core surfaces, run:

```bash
npm run lint
npm run typecheck
npm test
npm run cert:gai08c
```

## Pull requests

- Prefer small, reviewable PRs.
- Do not change engine behavior in documentation/certification-only sprints.
- Link the relevant ADR when introducing architectural changes.