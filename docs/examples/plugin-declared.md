# Example — Declared Plugin

```ts
import { GuardianPluginLoader, GuardianPluginRegistry } from "@iaeasy/guardian-core/sdk";

const result = GuardianPluginLoader.load({
  id: "plugin-architecture-hints",
  name: "Architecture Hints",
  version: "1.0.0",
  description: "Declared-only plugin shell for GAI-09 preparation",
  capabilities: ["architecture.hints"],
  productTargets: ["supercontab", "medicflow", "adflow"],
});

// Infrastructure may load descriptors, but business plugins stay inactive in 1.0.0
console.assert(result.loaded === true);
console.assert(result.activated === false);
console.assert(GuardianPluginRegistry.listActive().length === 0);
```