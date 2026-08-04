# Guardian Core

**Version:** 1.0.0  
**Product:** Guardian Core Enterprise (IAeasy)  
**Sprint:** GAI-08C — Stabilization & Publication  
**Status:** Official Enterprise Release

Independent, product-agnostic engineering intelligence platform for the IAeasy portfolio. SuperContab, MedicFlow-AI, AdFlow, LegalOpsPro, MindHub and future products consume Guardian exclusively through the **Guardian SDK Public API** and product adapters.

## Official architecture

```
Product (SuperContab | MedicFlow | AdFlow | …)
  → guardian-*-adapter
    → Guardian SDK (Public API)
      → Guardian Core 1.0.0
```

Adapters must never import Core internals. All access goes through the SDK Public API.

## What 1.0.0 includes

| Area | Status |
|------|--------|
| Runtime | Certified |
| Contracts | Certified |
| Event Bus | Certified |
| Registry | Certified |
| Providers | Certified |
| Knowledge Platform | Certified |
| Engineering Memory | Certified |
| Engineering Ontology | Certified |
| Dashboard (READ ONLY) | Certified |
| Plugin infrastructure | Certified (zero business plugins active) |
| Compatibility Layer | Certified |
| SDK + Public API | Certified 1.0.0 |
| Independent Certification Suite | Certified (GAI-08C) |

GAI-08C does **not** add features. It stabilizes, documents, versions and certifies the freeze published in GAI-08B.

## Structure

| Path | Role |
|------|------|
| `runtime/` | Guardian Runtime |
| `contracts/` | Public contracts |
| `events/` | Event Bus |
| `registry/` | Module / service registry |
| `providers/` | Product-agnostic providers |
| `knowledge/` | Alias → Engineering Knowledge Platform |
| `memory/` | Alias → Engineering Memory |
| `ontology/` | Alias → Engineering Ontology |
| `dashboard/` | Read-only dashboard |
| `plugins/` | Plugin model |
| `sdk/` | Guardian SDK |
| `public-api/` | Alias → SDK Public API |
| `compatibility/` | Compatibility Layer |
| `version/` | Version Manifest |
| `certification/` | Independent certification suite |
| `docs/` | Enterprise documentation + ADRs |
| `tests/` | Independent Core tests |

> On case-insensitive filesystems (Windows), the root version marker is `VERSION.txt` (content `1.0.0`) because `version/` is the module folder.

## Install

```bash
npm install @iaeasy/guardian-core@1.0.0
```

Local path (development):

```json
{ "@iaeasy/guardian-core": "file:../guardian-core" }
```

## Quick start (SDK)

```ts
import { createGuardianSdkHandle, getGuardianPublicApi } from "@iaeasy/guardian-core/sdk";

const handle = createGuardianSdkHandle();
const api = getGuardianPublicApi();
```

## Guides

- [Adapter Development Guide](docs/GAI08C_ADAPTER_GUIDE.md)
- [Plugin Development Guide](docs/GAI08C_PLUGIN_GUIDE.md)
- [Versioning Policy](docs/GAI08C_VERSIONING.md)
- [Release Notes](docs/GAI08C_RELEASE_NOTES.md)
- [Independent Certification](docs/GAI08C_CERTIFICATION.md)
- [ADR Index](docs/GAI08C_ADR_INDEX.md)
- [Contributing](CONTRIBUTING.md)

## Versioning

| Artifact | Version |
|----------|---------|
| Core | 1.0.0 |
| SDK | 1.0.0 |
| Compatibility | 1.0.0 |
| Schema | 1.0.0 |
| Plugin | 1.0.0 |
| Adapter | 1.0.0 |

Build: `1.0.0+gai08c` · Certification: `GAI-08C` · Tag: `guardian-core-v1.0.0`

## Quality gates

```bash
npm run lint
npm run typecheck
npm test
npm run cert:gai08c
```

## License

MIT