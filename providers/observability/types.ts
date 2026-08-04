/**
 * Guardian Observability Provider types (GAI-02).
 * Product-agnostic. Operational observability surfaces.
 */

export type ObservabilityProviderState = "ready" | "inactive";

export interface ObservabilityProviderMeta {
  readonly kind: "observability";
  readonly contractId: "observability-provider";
  readonly surfaces: readonly [
    "timeline",
    "sessions",
    "health",
    "metrics",
    "audit",
    "statistics",
  ];
}

export const OBSERVABILITY_SURFACES = [
  "timeline",
  "sessions",
  "health",
  "metrics",
  "audit",
  "statistics",
] as const;
