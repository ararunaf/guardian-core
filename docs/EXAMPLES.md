# Examples

## Create SDK handle

```ts
import { createGuardianSdkHandle, getGuardianPublicApi } from "@iaeasy/guardian-core/sdk";

const handle = createGuardianSdkHandle();
const api = getGuardianPublicApi();
// api.sdkVersion === "1.0.0"
```

## Read version manifest

```ts
import { describeGuardianVersionManifest } from "@iaeasy/guardian-core/sdk";

const m = describeGuardianVersionManifest();
// m.coreVersion, m.sdkVersion, … all "1.0.0"
```

## Bind product adapter (sketch)

```ts
import { bindProductAdapter } from "@iaeasy/guardian-core/sdk";

bindProductAdapter({
  id: "guardian-supercontab-adapter",
  version: "1.0.0",
  // product-specific init / inject / bridge
});
```

## Compatibility check

```ts
import { runCompatibilityCheck } from "@iaeasy/guardian-core/sdk";

const result = runCompatibilityCheck();
```