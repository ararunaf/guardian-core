/**
 * Guardian Root Cause Provider types (GAI-04).
 */
export type RootCauseProviderState = "ready" | "inactive";

export interface RootCauseProviderMeta {
  readonly kind: "root-cause";
  readonly contractId: "root-cause-provider";
}
