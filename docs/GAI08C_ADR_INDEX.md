# GAI-08C — ADR Index

**Produto:** Guardian Core 1.0.0  
**Certificacao:** GAI-08C  
**Status dos ADRs:** Accepted

Indice oficial das Architecture Decision Records publicadas na estabilizacao enterprise.

| ADR | Titulo | Resumo (1 linha) | Link |
|-----|--------|------------------|------|
| ADR-001 | Guardian Core | Core product-agnostic como produto independente versionado 1.0.0 | [`adr/ADR-001-guardian-core.md`](./adr/ADR-001-guardian-core.md) |
| ADR-002 | SDK Publica | SDK/Public API como unica superficie de consumo estavel | [`adr/ADR-002-sdk-publica.md`](./adr/ADR-002-sdk-publica.md) |
| ADR-003 | Adapter Pattern | Produtos integram-se apenas via adapters (`bindProductAdapter`) | [`adr/ADR-003-adapter-pattern.md`](./adr/ADR-003-adapter-pattern.md) |
| ADR-004 | Plugin Model | Infraestrutura de plugins com Compatibility gate; zero business plugins em 1.0.0 | [`adr/ADR-004-plugin-model.md`](./adr/ADR-004-plugin-model.md) |
| ADR-005 | Engineering Knowledge Platform | EKP como camada de conhecimento de engenharia no Core | [`adr/ADR-005-engineering-knowledge-platform.md`](./adr/ADR-005-engineering-knowledge-platform.md) |
| ADR-006 | Engineering Memory | Memoria de engenharia versionada e acessivel via contratos publicos | [`adr/ADR-006-engineering-memory.md`](./adr/ADR-006-engineering-memory.md) |
| ADR-007 | Engineering Ontology | Ontologia de engenharia alinhada a Knowledge/Memory | [`adr/ADR-007-engineering-ontology.md`](./adr/ADR-007-engineering-ontology.md) |
| ADR-008 | Event Bus | Event Bus como canal canonico; Timeline somente via eventos | [`adr/ADR-008-event-bus.md`](./adr/ADR-008-event-bus.md) |
| ADR-009 | Compatibility Layer | Validacao obrigatoria de adapters/plugins/versoes/contratos/SDK | [`adr/ADR-009-compatibility-layer.md`](./adr/ADR-009-compatibility-layer.md) |
| ADR-010 | Public API | `GuardianPublicApi` como unica entrada publica do pacote | [`adr/ADR-010-public-api.md`](./adr/ADR-010-public-api.md) |

## Convencoes

- Status: **Accepted** (GAI-08C).
- Estrutura minima: Status · Context · Decision · Consequences.
- Mudancas futuras que alterem decisoes devem criar ADR novo ou emendar com historico explicito e SemVer adequado.

## Referencias

- [`GAI08C_RELEASE.md`](./GAI08C_RELEASE.md)
- [`ARCHITECTURE.md`](./ARCHITECTURE.md)
- [`GAI08C_VERSIONING.md`](./GAI08C_VERSIONING.md)
