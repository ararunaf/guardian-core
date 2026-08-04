# Installation

## Package

```bash
npm install @iaeasy/guardian-core@1.0.0
```

## Local development (monorepo sibling)

```json
{
  "dependencies": {
    "@iaeasy/guardian-core": "file:../guardian-core"
  }
}
```

## Requirements

- Node.js / TypeScript project consuming ESM exports
- React `^18` optional peer (dashboard UI only)

## Verify

```ts
import { describeGuardianVersionManifest } from "@iaeasy/guardian-core/sdk";
console.log(describeGuardianVersionManifest().coreVersion); // "1.0.0"
```