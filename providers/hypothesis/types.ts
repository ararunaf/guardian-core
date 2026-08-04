/**
 * Guardian Hypothesis Provider types (GAI-04).
 */
export type HypothesisProviderState = "ready" | "inactive";

export interface HypothesisProviderMeta {
  readonly kind: "hypothesis";
  readonly contractId: "hypothesis-provider";
}
