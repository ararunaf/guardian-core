# Integration

## Pattern

1. Depend on `@iaeasy/guardian-core@1.0.0`
2. Implement or use a product adapter (`guardian-<product>-adapter`)
3. Call `bindProductAdapter` / register in `GuardianAdapterRegistry`
4. Enter exclusively through SDK Public API
5. Run Compatibility check at boot
6. Publish domain events to the Event Bus (never write Timeline directly)

## SuperContab

Use **only** `guardian-supercontab-adapter`. See `GAI08B_ADAPTER_GUIDE.md`.

## Anti-patterns

- Importing engines or providers from deep paths
- Embedding product business rules inside Core
- Dashboard mutations or direct SuperContab imports in Core UI