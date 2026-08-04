# GAI-08B — Repositorio Guardian Core

## Identidade

| Campo | Valor |
|-------|-------|
| Nome | `guardian-core` |
| Pacote NPM | `@iaeasy/guardian-core` |
| Versao | `1.0.0` |
| Remoto | https://github.com/ararunaf/guardian-core |
| Local | `d:\Projetos\guardian-core` |
| Tag | `guardian-core-v1.0.0` |
| Licenca | MIT |

## Origem

Extraido do monorepo SuperContabPro apos o freeze GAI-08A. O Core e product-agnostic: sem referencias a SuperContab no barrel publico.

## Estrutura raiz (resumo)

`runtime/` · `contracts/` · `events/` · `registry/` · `providers/` · `sdk/` · `public-api/` · `plugins/` · `adapters/` · `compatibility/` · `version/` · `dashboard/` · `timeline/` · engines (incident, diagnosis, …) · `engineering_*` · `docs/` · `tests/`

Aliases oficiais: `knowledge/` → Engineering Knowledge · `memory/` → Engineering Memory · `ontology/` → Engineering Ontology · `public-api/` → SDK Public API.

## Artefatos de publicacao

- `README.md` — produto e quick start
- `CHANGELOG.md` — 1.0.0 GAI-08B
- `VERSION.txt` — `1.0.0` (marker; pasta `version/` e o modulo)
- `LICENSE` · `CONTRIBUTING.md` · `SECURITY.md` · `CODEOWNERS`
- `package.json` — exports `.`, `./sdk`, `./public-api`

## Consumo pelo SuperContab

Dependencia via path local ou pacote publicado; integracao **somente** por `guardian-supercontab-adapter` + SDK Public API.