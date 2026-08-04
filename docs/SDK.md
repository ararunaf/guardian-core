# SDK

Entry: `@iaeasy/guardian-core/sdk`

Version: **1.0.0**

## Typical usage

```ts
import {
  createGuardianSdkHandle,
  getGuardianPublicApi,
  describeGuardianVersionManifest,
} from "@iaeasy/guardian-core/sdk";

const handle = createGuardianSdkHandle();
const api = getGuardianPublicApi();
const versions = describeGuardianVersionManifest();
```

## Layout

`public-api/` · `exports/` · `contracts/` · `interfaces/` · `version/` · `compatibility/`

Adapters must treat the SDK as the only supported surface.