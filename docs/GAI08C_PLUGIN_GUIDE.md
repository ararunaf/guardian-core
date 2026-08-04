# GAI-08C — Plugin Development Guide

**Produto:** Guardian Core 1.0.0  
**Certificacao:** GAI-08C  
**Plugin Version Manifest:** 1.0.0  
**Estado:** Infraestrutura pronta · **zero plugins de negocio ativos**

Guia oficial para declarar e integrar plugins na infraestrutura Guardian.  
Ponteiro curto: [`PLUGINS.md`](./PLUGINS.md). ADR relacionado: [`ADR-004`](./adr/ADR-004-plugin-model.md).

---

## 1. Objetivo

Documentar Lifecycle, Registry, Manifest, Descriptor, Compatibility e Version da infraestrutura de plugins. Este guia mostra como **declarar** um plugin compativel — **nao** ativa plugins de negocio (Patch Generator, Test Guardian, Deployment Guardian, etc.), reservados a GAI-09+.

---

## 2. Componentes certificados

| Componente | Modulo (referencia) |
|------------|---------------------|
| Plugin Model | `plugins/plugin_model.ts` |
| Registry | `plugins/plugin_registry.ts` |
| Loader | `plugins/plugin_loader.ts` |
| Descriptor | `plugins/plugin_descriptor.ts` |
| Manifest | `plugins/plugin_manifest.ts` |
| Version | `plugins/plugin_version.ts` |
| Compatibility | `plugins/plugin_compatibility.ts` |
| Metadata | `plugins/plugin_metadata.ts` |

---

## 3. Lifecycle

```
declare -> register -> compatibility-check -> load -> start -> (emit events) -> stop -> unload
```

| Fase | Descricao |
|------|-----------|
| **declare** | Descriptor + Manifest + Metadata + Version |
| **register** | Entrada no `GuardianPluginRegistry` |
| **compatibility-check** | Validacao via Compatibility Layer / `plugin_compatibility` |
| **load** | `GuardianPluginLoader` carrega somente se Compatibility OK |
| **start** | Plugin inicia; pode emitir eventos no Event Bus |
| **stop / unload** | Encerramento ordenado; limpeza de handlers |

Falha em Compatibility **bloqueia** load. Nao ha bypass via Core internals.

---

## 4. Manifest

O Manifest descreve identidade, versao, capacidades e requisitos:

```ts
export type GuardianPluginManifest = {
  id: string;
  name: string;
  version: string; // SemVer plugin surface, ex. "1.0.0"
  coreRange: string; // ex. "^1.0.0"
  sdkRange: string; // ex. "^1.0.0"
  capabilities: string[];
  eventsEmitted?: string[];
  eventsConsumed?: string[];
  businessActivation: false; // GAI-08C: exemplos nao ativam negocio
};
```

---

## 5. Descriptor

O Descriptor amarra o Manifest ao ponto de carga e metadados de runtime:

```ts
export type GuardianPluginDescriptor = {
  manifest: GuardianPluginManifest;
  entry: string; // modulo de entrada do plugin
  metadata: {
    author: string;
    description: string;
    certification?: string; // ex. "GAI-08C"
  };
};
```

---

## 6. Compatibility & Version

1. Plugin Version deve ser SemVer valido.
2. `coreRange` / `sdkRange` devem satisfazer Core/SDK 1.0.0.
3. Compatibility Layer emite `guardian.compatibility.checked`.
4. Plugins incompativeis nao carregam.
5. Evolucao futura de schemas de Manifest segue politica SemVer do Core ([`GAI08C_VERSIONING.md`](./GAI08C_VERSIONING.md)).

---

## 7. Regras e best practices

1. **Nao alterar engines do Core** — plugins observam/emitem; nao mutam runtime interno.
2. **Nao bypassar Public API** — integracao via SDK / contratos de plugin.
3. **Event Bus only** — Timeline e dashboard nao sao escritos diretamente.
4. **Dashboard READ ONLY** — mesmo com plugins futuros.
5. **Declarar capacidades** — liste `capabilities` e eventos emitidos/consumidos.
6. **Sem ativacao de negocio em 1.0.0** — GAI-08C certifica infra, nao Patch/Test/Deployment Guardian.
7. **Idempotencia no start/stop** — start duplicado nao deve corromper registry.
8. **Falhas explicitas** — erros de compatibility/load devem ser observaveis.

---

## 8. Como um plugin se integra (contrato)

1. Declarar Descriptor + Manifest + Metadata.
2. Declarar versao e matriz de Compatibility.
3. Registrar no `GuardianPluginRegistry`.
4. Carregar via `GuardianPluginLoader` (somente se Compatibility OK).
5. Emitir eventos no Event Bus.

---

## 9. Exemplo completo — declaracao (sem ativacao de negocio)

Exemplo ilustrativo de plugin **declarativo** (`guardian-sample-observability-plugin`). Nao e um plugin de negocio GAI-10+; serve apenas para documentar o contrato.

```ts
/**
 * Exemplo GAI-08C — declaracao de plugin (nao ativa features de negocio).
 */
import type {
  GuardianPluginDescriptor,
  GuardianPluginManifest,
} from "@iaeasy/guardian-core/sdk";

export const SAMPLE_PLUGIN_MANIFEST: GuardianPluginManifest = {
  id: "guardian-sample-observability-plugin",
  name: "Sample Observability Plugin",
  version: "1.0.0",
  coreRange: "^1.0.0",
  sdkRange: "^1.0.0",
  capabilities: ["observability.declare", "events.emit"],
  eventsEmitted: [
    "guardian.plugin.declared",
    "guardian.plugin.sample.heartbeat",
  ],
  eventsConsumed: ["guardian.compatibility.checked"],
  businessActivation: false,
};

export const SAMPLE_PLUGIN_DESCRIPTOR: GuardianPluginDescriptor = {
  manifest: SAMPLE_PLUGIN_MANIFEST,
  entry: "./sample_observability_plugin.js",
  metadata: {
    author: "IA Easy / Guardian Docs",
    description:
      "Declarative sample for GAI-08C plugin infrastructure certification. Not a business plugin.",
    certification: "GAI-08C",
  },
};

/**
 * Registro ilustrativo — em producao use as APIs reais do SDK/plugin registry.
 */
export async function declareSamplePlugin(registry: {
  register: (descriptor: GuardianPluginDescriptor) => Promise<void>;
  loader: {
    load: (id: string) => Promise<{ start: () => Promise<void> }>;
  };
  compatibility: {
    checkPlugin: (manifest: GuardianPluginManifest) => Promise<{ ok: boolean; reason?: string }>;
  };
  emit: (type: string, payload?: unknown) => void;
}) {
  const check = await registry.compatibility.checkPlugin(SAMPLE_PLUGIN_MANIFEST);
  if (!check.ok) {
    throw new Error(`Plugin incompatible: ${check.reason ?? "unknown"}`);
  }

  await registry.register(SAMPLE_PLUGIN_DESCRIPTOR);
  registry.emit("guardian.plugin.declared", {
    id: SAMPLE_PLUGIN_MANIFEST.id,
    version: SAMPLE_PLUGIN_MANIFEST.version,
  });

  // GAI-08C: documentamos o fluxo de load, mas nao ativamos plugins de negocio.
  // const loaded = await registry.loader.load(SAMPLE_PLUGIN_MANIFEST.id);
  // await loaded.start();
}
```

### O que este exemplo **nao** faz

- Nao implementa Patch Generator / Test Guardian / Deployment Guardian.
- Nao altera engines, ontology ou memory.
- Nao grava no Dashboard.
- Nao introduz ML/LLM.

---

## 10. Estado GAI-08C

| Item | Status |
|------|--------|
| Plugin infrastructure | Certificada |
| Business plugins ativos | **0** |
| Proximos candidatos | GAI-09+ (Architecture Specialist e seguintes) |

---

## 11. Flags

`PLUGIN_GUIDE_READY=true` · `PLUGIN_INFRASTRUCTURE_CERTIFIED=true` · `BUSINESS_PLUGINS_ACTIVE=false`
