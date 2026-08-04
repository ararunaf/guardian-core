# Guardian Core

**Version:** 1.0.0  
**Product:** Guardian Core (IAeasy)  
**Sprint:** GAI-08B — Guardian Core Publication

Independent, product-agnostic engineering intelligence platform. SuperContab and other IAeasy products consume Guardian exclusively through the **Guardian SDK Public API** and product adapters.

## Architecture

```
Product (e.g. SuperContab)
  → guardian-*-adapter
    → Guardian SDK (Public API)
      → Guardian Core
```

Adapters must never import Core internals. All access goes through the SDK Public API.

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
| `docs/` | Product documentation |
| `tests/` | Core tests |

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

## SuperContab integration

Use `guardian-supercontab-adapter` only. See `docs/GAI08B_ADAPTER_GUIDE.md`.

## Versioning

| Artifact | Version |
|----------|---------|
| Core | 1.0.0 |
| SDK | 1.0.0 |
| Compatibility | 1.0.0 |
| Schema | 1.0.0 |
| Plugin | 1.0.0 |
| Adapter | 1.0.0 |

Tag: `guardian-core-v1.0.0`

## License

MIT