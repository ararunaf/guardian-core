/**
 * Guardian Diagnostics Provider types (GAI-01).
 * Product-agnostic. No operational behavior.
 */

export type DiagnosticsProviderState = "ready" | "inactive";

export interface DiagnosticsProviderMeta {
  readonly kind: "diagnostics";
  readonly contractId: "diagnostics-provider";
}