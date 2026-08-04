# Example — Product Adapter (MedicFlow sketch)

```ts
import {
  bindProductAdapter,
  createAdapterDescriptor,
  createIncidentProvider,
  GuardianEventBus,
} from "@iaeasy/guardian-core/sdk";

export function connectMedicFlowGuardian() {
  const adapter = createAdapterDescriptor({
    id: "guardian-adapter-medicflow",
    productId: "medicflow",
    name: "MedicFlow Guardian Adapter",
    implementsProviders: true,
    boundProviders: ["incident"],
  });

  bindProductAdapter(adapter);

  createIncidentProvider({
    // product-side signal source wired here
  });

  GuardianEventBus.publish("guardian.adapter.connected", adapter.id, {
    productId: adapter.productId,
  });

  return adapter;
}
```

Rules: never import Core internals; never bind business rules into Core.