# GAI-08B — Plugin Guide

## Infraestrutura certificada

| Componente | Modulo |
|------------|--------|
| Plugin Model | `plugins/plugin_model.ts` |
| Registry | `plugins/plugin_registry.ts` |
| Loader | `plugins/plugin_loader.ts` |
| Descriptor | `plugins/plugin_descriptor.ts` |
| Manifest | `plugins/plugin_manifest.ts` |
| Version | `plugins/plugin_version.ts` |
| Compatibility | `plugins/plugin_compatibility.ts` |
| Metadata | `plugins/plugin_metadata.ts` |

Plugin Version Manifest: **1.0.0**

## Estado GAI-08B

Infraestrutura multi-product **pronta**. Zero plugins de negocio ativos nesta sprint (sem Patch Generator, Test Guardian, Deployment Guardian, ML/LLM).

## Como um plugin se integra (contrato)

1. Declarar Descriptor + Manifest + Metadata
2. Declarar versao e matriz de Compatibility
3. Registrar no `GuardianPluginRegistry`
4. Carregar via `GuardianPluginLoader` (somente se Compatibility OK)
5. Emitir eventos no Event Bus (nunca escrever Timeline direto)

## Regras

- Plugins nao alteram engines do Core
- Plugins nao bypassam a Public API
- Dashboard permanece READ ONLY mesmo com plugins futuros