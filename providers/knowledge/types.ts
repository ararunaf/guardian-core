/**
 * Guardian Knowledge Provider types (GAI-01).
 * Product-agnostic. No operational behavior.
 */

export type KnowledgeProviderState = "ready" | "inactive";

export interface KnowledgeProviderMeta {
  readonly kind: "knowledge";
  readonly contractId: "knowledge-provider";
}