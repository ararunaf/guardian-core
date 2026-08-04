# GAI-08C — Independent Certification Suite

**Produto:** Guardian Core  
**Versao:** `1.0.0`  
**Build:** `1.0.0+gai08c`  
**Certificacao:** `GAI-08C`  
**Comando:** `npm run cert:gai08c`

---

## 1. Objetivo

A suíte de certificacao **GAI-08C** valida, de forma **independente do SuperContab**, que o Guardian Core 1.0.0 esta estabilizado e pronto para GAI-09. Diferente da certificacao cruzada GAI-08B (Core <-> SuperContab), esta suite roda **somente** no repositorio `guardian-core`.

---

## 2. O que e certificado

| Area | Criterio |
|------|----------|
| **SDK** | Superficie 1.0.0 exportavel e consistente |
| **Runtime** | Boot/shutdown/health sem dependencia de produto |
| **Registry** | Adapter/Plugin/component registries operacionais |
| **Contracts** | Contratos publicos tipados coerentes com a SDK |
| **Providers** | Modelo de injecao via adapter (sem providers SuperContab hardcoded) |
| **Knowledge** | Engineering Knowledge Platform presente e versionada |
| **Memory** | Engineering Memory presente e versionada |
| **Ontology** | Engineering Ontology presente e versionada |
| **Dashboard** | READ ONLY — sem mutacao de engines |
| **Plugins** | Infra (Registry/Loader/Manifest/Descriptor/Compatibility) — zero business plugins ativos |
| **Compatibility** | Camada `compatibility/` valida versoes/contratos/SDK |
| **Version** | Manifest 1.0.0 · build `1.0.0+gai08c` · cert `GAI-08C` |
| **Public API** | Unica entrada publica (`GuardianPublicApi` / exports oficiais) |

---

## 3. Independencia de SuperContab

- A suite **nao** importa `@/services` do SuperContab.
- A suite **nao** exige `guardian-supercontab-adapter` instalado.
- Adapters de produto sao validados apenas ao nivel de **contrato** (registry/API), nao de dominio SuperContab.
- Falhas de ambiente de produto nao devem falhar a certificacao do Core.

---

## 4. Como executar

Na raiz do repositorio `guardian-core`:

```bash
npm run cert:gai08c
```

Comportamento esperado:

1. Carrega version manifest (`1.0.0` / `GAI-08C` / `1.0.0+gai08c`).
2. Verifica superficies SDK / Public API / Compatibility.
3. Verifica presencia estrutural de Runtime, Registry, Contracts, Providers, Knowledge, Memory, Ontology, Dashboard, Plugins infra.
4. Confirma Dashboard READ ONLY e ausencia de business plugins ativos.
5. Emite (ou registra) resultado de certificacao; evento tipico: `guardian.core.certified` (quando Event Bus disponivel no harness).

Exit code:

- `0` — certificacao PASS  
- `!= 0` — certificacao FAIL (gates abaixo)

---

## 5. Gates esperados

```
SDK_CERTIFIED=true
RUNTIME_CERTIFIED=true
REGISTRY_CERTIFIED=true
CONTRACTS_CERTIFIED=true
PROVIDERS_CERTIFIED=true
KNOWLEDGE_CERTIFIED=true
MEMORY_CERTIFIED=true
ONTOLOGY_CERTIFIED=true
DASHBOARD_READONLY_CERTIFIED=true
PLUGIN_INFRA_CERTIFIED=true
BUSINESS_PLUGINS_ACTIVE=false
COMPATIBILITY_CERTIFIED=true
VERSION_CERTIFIED=true
PUBLIC_API_CERTIFIED=true
INDEPENDENT_OF_SUPERCONTAB=true
GAI08C_CERT_PASS=true
READY_FOR_GAI09=true
GO_OR_NO_GO=GO
```

---

## 6. Relacao com GAI-08B

| Aspecto | GAI-08B | GAI-08C |
|---------|---------|---------|
| Foco | Publicacao + cross-cert com SuperContab | Estabilizacao + cert independente |
| Repo | `guardian-core` + produto | Somente `guardian-core` |
| Features | Nenhuma nova | Nenhuma nova |
| Tag SemVer | `guardian-core-v1.0.0` | Mantem `1.0.0` (build `+gai08c`) |

---

## 7. Evidencias documentais

- [`GAI08C_RELEASE.md`](./GAI08C_RELEASE.md)
- [`GAI08C_VERSIONING.md`](./GAI08C_VERSIONING.md)
- [`GAI08C_RELEASE_NOTES.md`](./GAI08C_RELEASE_NOTES.md)
- [`GAI08C_RELATORIO_FINAL.md`](./GAI08C_RELATORIO_FINAL.md)
- [`GAI08C_ADR_INDEX.md`](./GAI08C_ADR_INDEX.md)

---

## 8. Flags

`CERTIFICATION_SUITE_DOCUMENTED=true` · `CERT_COMMAND=npm run cert:gai08c`
