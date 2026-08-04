# GAI-08C — Politica de Versionamento (SemVer)

**Produto:** Guardian Core  
**Versao canonica:** `1.0.0`  
**Build:** `1.0.0+gai08c`  
**Certificacao:** `GAI-08C`  
**Tag Git:** `guardian-core-v1.0.0`  
**Fonte de verdade:** `version/version_manifest.ts` · `VERSION.txt` · `package.json`

Este documento e a politica oficial de versionamento a partir da estabilizacao GAI-08C.  
Resumo curto tambem em [`VERSIONING.md`](./VERSIONING.md).

---

## 1. Semantic Versioning (SemVer)

Guardian Core adota **Semantic Versioning 2.0.0** no formato:

```
MAJOR.MINOR.PATCH[+BUILD_METADATA]
```

Exemplo atual:

```
1.0.0+gai08c
```

| Componente | Significado |
|------------|-------------|
| **MAJOR** | Mudancas incompativeis na Public API / contratos publicos |
| **MINOR** | Novas capacidades compativeis (features additive) |
| **PATCH** | Correcoes compativeis (bugs, docs, hardening sem breaking) |
| **+BUILD** | Metadado de build/sprint (nao afeta compatibilidade SemVer) |

---

## 2. Definicoes MAJOR / MINOR / PATCH

### MAJOR (ex.: 1.x.x -> 2.0.0)

Incrementar quando houver **breaking change** em qualquer superficie publica:

- remocao ou renomeacao de export da Public API / SDK;
- alteracao de assinatura incompativel em contratos publicos;
- mudanca de semantica obrigatoria de eventos do Event Bus;
- incompatibilidade de schema de Manifest/Descriptor de plugins ou adapters;
- remocao de comportamento documentado como estavel.

### MINOR (ex.: 1.0.x -> 1.1.0)

Incrementar quando houver **adicao compativel**:

- novos exports opcionais na Public API;
- novos eventos do Event Bus (consumidores antigos ignoram);
- novos campos opcionais em manifests/schemas;
- novas capacidades de plugin infra sem exigir mudanca nos plugins existentes.

### PATCH (ex.: 1.0.0 -> 1.0.1)

Incrementar quando houver **correcao sem breaking**:

- bugfix em runtime/registry/compatibility;
- melhorias de performance sem mudanca de contrato;
- atualizacao documental / certificacao / hardening interno.

### Build metadata (`+gai08c`)

- Identifica sprint/build interno.
- **Nao** altera precedencia SemVer entre `1.0.0` e `1.0.0+gai08c`.
- Usado em certificados e artefatos de release.

---

## 3. Regras de Compatibilidade

1. Consumidores (adapters, produtos, plugins) devem depender apenas da **Public API / SDK**.
2. Compatibilidade e validada pela camada `compatibility/` antes de carregar adapters/plugins.
3. Evento canonico: `guardian.compatibility.checked`.
4. Um adapter ou plugin **incompativel** nao deve ser ativado.
5. Versoes de Schema, Plugin e Adapter devem ser coerentes com a matriz do `version_manifest`.

### Matriz de superficies 1.0.0

| Superficie | Versao |
|------------|--------|
| Core | **1.0.0** |
| SDK | **1.0.0** |
| Compatibility | **1.0.0** |
| Schema | **1.0.0** |
| Plugin | **1.0.0** |
| Adapter | **1.0.0** |
| Build | **1.0.0+gai08c** |
| Certification | **GAI-08C** |

---

## 4. Breaking Changes Policy

- Breaking changes **exigem** incremento de MAJOR.
- Breaking changes devem ser:

  1. anunciados em Release Notes;
  2. refletidos em ADR (quando arquiteturais);
  3. acompanhados de guia de migracao (`MIGRATION.md` / notas GAI);
  4. validados pela suite de certificacao.

- Mudancas internas (engines, pastas privadas) que **nao** afetem a Public API podem ser PATCH/MINOR conforme impacto observavel.
- Em releases de estabilizacao (como GAI-08C): **proibido** introduzir breaking changes.

---

## 5. Deprecation Policy

Ciclo obrigatorio para remocao de API publica:

```
announce (MINOR) -> warn (MINOR+) -> remove (MAJOR)
```

| Fase | Quando | Comportamento |
|------|--------|---------------|
| **Announce** | Em release MINOR | Documentar deprecacao; API permanece funcional |
| **Warn** | Em MINOR subsequente(s) | Warnings em runtime/logs/certificacao; API permanece funcional |
| **Remove** | Em MAJOR | Remocao efetiva; consumidores devem migrar |

Regras:

- Nao remover API publica em PATCH ou MINOR.
- Deprecacoes devem listar substituto e prazo-alvo (major seguinte, quando possivel).
- Plugins/adapters que usem APIs deprecated devem passar por Compatibility com aviso.

---

## 6. Migration Policy

1. Toda mudanca MAJOR deve ter secao de migracao nas Release Notes.
2. Adapters de produto atualizam primeiro a ponte (`bindProductAdapter`), depois o produto.
3. Plugins atualizam Manifest/Descriptor/Compatibility antes de reativar.
4. Nao ha auto-migracao silenciosa de contratos; falhas devem ser explicitas via Compatibility Layer.
5. GAI-08C -> GAI-09: **sem migracao de comportamento** (base estavel 1.0.0).

---

## 7. Marcadores de publicacao

| Artefato | Valor |
|----------|-------|
| `VERSION.txt` | `1.0.0` |
| `package.json` -> `version` | `1.0.0` |
| Tag Git | `guardian-core-v1.0.0` |
| Build metadata | `1.0.0+gai08c` |
| Certification | `GAI-08C` |
| Manifest | `version/version_manifest.ts` (`frozen`, surfaces 1.0.0) |

---

## 8. Relacao com GAI-08B

GAI-08B publicou o Core 1.0.0 com build `1.0.0+gai08b` e certificacao `GAI-08B`.  
GAI-08C **mantem** a versao SemVer `1.0.0` e atualiza apenas metadados de estabilizacao (`+gai08c` / `GAI-08C`), documentacao e certificacao independente — **sem novas features**.

---

## 9. Flags

`VERSIONING_READY=true` · `SEMVER_POLICY_PUBLISHED=true` · `TAG_TARGET=guardian-core-v1.0.0`
