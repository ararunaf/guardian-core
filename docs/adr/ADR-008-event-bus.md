# ADR-008 — Event Bus

- **Status:** Accepted
- **Date:** GAI-08C
- **Deciders:** Guardian Core architecture board / IA Easy
- **Tags:** events, timeline, observability, integration

## Context

Guardian Dashboard Timeline and cross-component coordination require a single observational channel. Historically, direct Timeline writes or ad-hoc callbacks created hidden coupling and made certification matrices unreliable (who emitted what?).

GAI-02 established the Event Bus. GAI-08B cross-certification expected events such as `guardian.sdk.generated`, `guardian.adapter.loaded`, `guardian.compatibility.checked`, `guardian.core.certified`. GAI-08C must keep Event Bus as the canonical integration spine for adapters, plugins, and Core subsystems.

## Decision

The **Event Bus** is the canonical communication/observation channel inside Guardian Core.

Decisions:

1. Timeline is fed **only** via Event Bus events — no direct Timeline mutation from adapters/plugins/products.
2. Dashboard remains READ ONLY with respect to engines; it consumes observable state/events, it does not become a command bus for Core mutation.
3. Adapters bridge product signals into bus events.
4. Plugins emit/consume bus events per manifest declarations.
5. Compatibility and certification flows SHOULD emit standard `guardian.*` events when running in a bus-enabled harness.
6. Introducing mandatory event payload breaks for documented events requires SemVer MAJOR; additive optional fields may be MINOR.

Representative events (non-exhaustive):

- `guardian.adapter.loaded`
- `guardian.compatibility.checked`
- `guardian.core.certified`
- `guardian.plugin.declared` (declarative examples)

## Consequences

### Positive

- Auditable integration story for certification.
- Decoupled producers/consumers across Core subsystems.
- Consistent adapter/plugin guidance.

### Negative / Trade-offs

- Developers cannot “just set timeline rows” for quick hacks.
- Event schema governance becomes necessary as specialists arrive (GAI-09+).

### Compliance

- Direct Timeline writes from product code are architectural defects.
- Hidden side channels that duplicate bus responsibilities should be removed or documented as non-public.

## References

- `docs/GAI08B_CROSS_CERTIFICATION.md`
- `docs/GAI08C_ADAPTER_GUIDE.md`
- `docs/GAI08C_PLUGIN_GUIDE.md`
- ADR-003, ADR-004
