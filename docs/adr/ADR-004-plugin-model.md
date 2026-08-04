# ADR-004 — Plugin Model

- **Status:** Accepted
- **Date:** GAI-08C
- **Deciders:** Guardian Core architecture board / IA Easy
- **Tags:** plugins, lifecycle, compatibility, extensibility

## Context

Future Guardian capabilities (Architecture Specialist, Patch Generator, Test Guardian, Deployment Guardian, Engineering Director AI) should extend Core without forking it. Embedding those features as hardwired engines in 1.0.0 would:

- inflate Core before product-market fit of each specialist;
- bypass Compatibility gates;
- risk Dashboard/engine mutation from “helpful” plugins.

GAI-08B certified plugin **infrastructure** (model, registry, loader, descriptor, manifest, version, compatibility, metadata) with **zero** business plugins active. GAI-08C must freeze that model so GAI-09+ can activate plugins safely.

## Decision

Adopt a **declarative Plugin Model** with gated lifecycle:

```
declare -> register -> compatibility-check -> load -> start -> stop -> unload
```

Components (conceptual modules under `plugins/`):

- Plugin Model, Registry, Loader
- Descriptor, Manifest, Version, Compatibility, Metadata

Rules:

1. Plugins integrate through exported contracts / SDK — not Core internals.
2. Compatibility failure blocks load.
3. Plugins emit/consume Event Bus events; they do not write Timeline or mutate Dashboard engines directly.
4. **GAI-08C / 1.0.0:** infrastructure certified; **businessActivation remains false** for shipped plugins (count = 0).
5. Plugin Version surface is **1.0.0**.
6. Examples in docs may declare sample plugins for contract illustration without activating business specialists.

## Consequences

### Positive

- Extensibility roadmap (GAI-09+) without rewriting Core.
- Uniform version/compatibility policy with adapters.
- Safer multi-product deployments (only compatible plugins load).

### Negative / Trade-offs

- Specialist features unavailable until later sprints.
- Authors must maintain manifests/descriptors and ranges (`coreRange`, `sdkRange`).
- Debugging requires observing Event Bus + loader errors rather than ad-hoc engine hooks.

### Compliance

- Activating business plugins in 1.0.0 without SemVer/MINOR+ planning violates this ADR.
- Plugin PRs that mutate Core engines directly are rejected.

## References

- `docs/GAI08C_PLUGIN_GUIDE.md`
- `docs/PLUGINS.md`
- ADR-008, ADR-009
