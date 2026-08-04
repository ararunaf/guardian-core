# GAI-08B — Versioning

Manifesto: `version/version_manifest.ts`

| Campo | Valor |
|-------|-------|
| Core Version | 1.0.0 |
| SDK Version | 1.0.0 |
| Compatibility Version | 1.0.0 |
| Schema Version | 1.0.0 |
| Plugin Version | 1.0.0 |
| Adapter Version | 1.0.0 |
| Build Version | 1.0.0+gai08b |
| Certification Version | GAI-08B |
| frozen | true |
| extractable | true |

## Markers de publicacao

- `VERSION.txt` → `1.0.0`
- Tag Git → `guardian-core-v1.0.0`
- `package.json` → `"version": "1.0.0"`

## Politica

- Semantica SemVer
- Breaking changes de Public API exigem major
- GAI-08B nao introduz features — apenas publicacao do freeze GAI-08A

## Flags

`VERSIONING_READY=true` · `TAG_CREATED=true`