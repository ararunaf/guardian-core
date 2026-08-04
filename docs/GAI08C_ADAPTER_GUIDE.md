# GAI-08C — Adapter Development Guide

**Produto:** Guardian Core 1.0.0  
**Certificacao:** GAI-08C  
**Contrato de adapter:** 1.0.0  
**APIs:** `bindProductAdapter` · `GuardianAdapterRegistry` · `getGuardianAdapterRuntimeApi`

Guia oficial para criar adapters de produto sobre o Guardian Core.  
Ponteiro curto: [`ADAPTERS.md`](./ADAPTERS.md). ADR relacionado: [`ADR-003`](./adr/ADR-003-adapter-pattern.md).

---

## 1. Arquitetura

```
Product (ex.: MedicFlow, SuperContab)
  -> guardian-*-adapter
    -> Guardian SDK (Public API)
      -> Guardian Core
```

O adapter e a **unica** ponte permitida entre o produto e o Core. O produto nao importa internals (`runtime/`, `engines/`, pastas privadas). O Core nao contem regras de negocio do produto.

---

## 2. Responsabilidades do adapter

1. Inicializar o produto no contexto Guardian.
2. Registrar o adapter no `GuardianAdapterRegistry` via `bindProductAdapter`.
3. Injetar / registrar providers especificos do produto.
4. Integrar o runtime do produto com o runtime Guardian (boot/shutdown hooks quando aplicavel).
5. Conectar eventos de produto ao **Event Bus** (nunca escrever Timeline diretamente).
6. Expor apenas o necessario via contratos publicos — sem vazar internals do Core para o produto alem da SDK.

---

## 3. Regras obrigatorias

| Regra | Detalhe |
|-------|---------|
| Sem Core internals | Produto e adapter nao importam caminhos privados do Core |
| Sem business rules no Core | Regras de MedicFlow/SuperContab ficam no produto ou no adapter |
| Public API only | Consumo via `@iaeasy/guardian-core/sdk` ou `@iaeasy/guardian-core/public-api` |
| Compatibility first | Rodar Compatibility check antes de considerar o binding valido |
| Event Bus | Publicar eventos Guardian; nao mutar Dashboard/engines diretamente |
| Dashboard READ ONLY | Adapter nao grava estado de dashboard |

---

## 4. Como criar um adapter (passo a passo)

### 4.1 Definir identidade

- Nome: `guardian-<produto>-adapter` (ex.: `guardian-medicflow-adapter`)
- Versao: `1.0.0` (alinhada ao Adapter Version do Core)
- Product id: string estavel (ex.: `medicflow`)

### 4.2 Dependencia

```json
{
  "name": "@iaeasy/guardian-medicflow-adapter",
  "version": "1.0.0",
  "dependencies": {
    "@iaeasy/guardian-core": "1.0.0"
  }
}
```

### 4.3 Implementar o adapter

Use a base publica / contratos do SDK. Conceitualmente:

1. Declarar metadata (id, product, version).
2. Implementar `initialize` / `bindProviders` / `connectEventBus` / `shutdown`.
3. Chamar `bindProductAdapter(...)`.
4. Validar com Compatibility.

### 4.4 Registrar providers

Providers de produto (consultas, bridges UKAL-like, etc.) sao registrados **pelo adapter**, nao pelo Core.

### 4.5 Event Bus

Emitir eventos no padrao `guardian.*` / eventos de produto documentados. Exemplos tipicos apos binding:

- `guardian.adapter.loaded`
- `guardian.compatibility.checked`

### 4.6 Checklist

- [ ] Adapter registrado em `GuardianAdapterRegistry`
- [ ] Providers bound
- [ ] Event Bus conectado
- [ ] Compatibility PASS
- [ ] Nenhum import de Core internals
- [ ] Nenhuma regra de negocio dentro do Core
- [ ] Dashboard permanece READ ONLY

---

## 5. Exemplo completo — `guardian-medicflow-adapter`

Exemplo **ficticio** para fins de documentacao. Nao ativa plugins de negocio e nao altera o Core.

```ts
/**
 * guardian-medicflow-adapter (exemplo GAI-08C)
 * Vive no repositorio/produto MedicFlow — nao dentro do Core.
 */
import {
  bindProductAdapter,
  runCompatibilityCheck,
  type GuardianProductAdapterBinding,
} from "@iaeasy/guardian-core/sdk";

const ADAPTER_ID = "guardian-medicflow-adapter";
const PRODUCT_ID = "medicflow";
const ADAPTER_VERSION = "1.0.0";

export type MedicFlowAdapterOptions = {
  /** Bridge de dominio do produto (ficticio) */
  consultPatientRisk?: (patientId: string) => Promise<unknown>;
  /** Emitir eventos de produto no bus via callback do runtime */
  onBound?: (api: { emit: (type: string, payload?: unknown) => void }) => void;
};

export async function createMedicFlowAdapter(
  options: MedicFlowAdapterOptions = {},
): Promise<GuardianProductAdapterBinding> {
  const binding: GuardianProductAdapterBinding = {
    id: ADAPTER_ID,
    productId: PRODUCT_ID,
    version: ADAPTER_VERSION,
    async initialize(runtimeApi) {
      // 1) Providers de produto (nao entram no Core como business rules)
      runtimeApi.registerProvider?.("medicflow.consultPatientRisk", {
        invoke: async (patientId: string) => {
          if (!options.consultPatientRisk) {
            throw new Error("medicflow.consultPatientRisk provider not configured");
          }
          return options.consultPatientRisk(patientId);
        },
      });

      // 2) Event Bus — somente via API publica / runtime adapter API
      runtimeApi.emit?.("guardian.adapter.loading", {
        adapterId: ADAPTER_ID,
        productId: PRODUCT_ID,
        version: ADAPTER_VERSION,
      });

      options.onBound?.({
        emit: (type, payload) => runtimeApi.emit?.(type, payload),
      });
    },
    async shutdown(runtimeApi) {
      runtimeApi.emit?.("guardian.adapter.unloaded", {
        adapterId: ADAPTER_ID,
      });
    },
  };

  // 3) Compatibility antes do bind definitivo
  const compatibility = await runCompatibilityCheck({
    adapterId: ADAPTER_ID,
    adapterVersion: ADAPTER_VERSION,
    sdkVersion: "1.0.0",
    coreVersion: "1.0.0",
  });

  if (!compatibility.ok) {
    throw new Error(
      `MedicFlow adapter incompatible: ${compatibility.reason ?? "unknown"}`,
    );
  }

  // 4) Registro oficial
  await bindProductAdapter(binding);

  return binding;
}

// Boot tipico no produto MedicFlow:
// await createMedicFlowAdapter({
//   consultPatientRisk: (id) => medicFlowDomain.riskOf(id),
//   onBound: ({ emit }) => emit("medicflow.adapter.ready", { at: Date.now() }),
// });
```

### Notas do exemplo

- Tipos como `GuardianProductAdapterBinding` ilustram o contrato; use os tipos reais exportados pelo SDK 1.0.0.
- O Core permanece agnostico: nao conhece `patientId` nem regras clinicas.
- SuperContab segue o mesmo padrao com `guardian-supercontab-adapter`.

---

## 6. Adapter oficial de referencia

| Campo | Valor |
|-------|-------|
| Nome | `guardian-supercontab-adapter` |
| Versao | `1.0.0` |
| Registro | `GuardianAdapterRegistry` |
| Localizacao | Lado SuperContab (nao no Core) |

---

## 7. Modulos Core relacionados (referencia)

- `adapters/base_adapter.ts`
- `adapters/adapter_registry.ts` (`GuardianAdapterRegistry`)
- Public API: `bindProductAdapter`, `getGuardianAdapterRuntimeApi`

Consuma-os **somente** via SDK / Public API.

---

## 8. Flags

`ADAPTER_GUIDE_READY=true` · `ADAPTER_CONTRACT_1_0_0=true`
