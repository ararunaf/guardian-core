# Migration

## From SuperContab-hosted Core (GAI-08A) to published Core (GAI-08B)

1. Point dependency to `@iaeasy/guardian-core@1.0.0`
2. Replace internal Core imports with SDK / Public API
3. Keep `guardian-supercontab-adapter` as the only SuperContab bridge
4. Confirm versions in `describeGuardianVersionManifest()`
5. Run Compatibility check

No schema/data migration in 1.0.0. Expect **no behavior change** versus the GAI-08A freeze.