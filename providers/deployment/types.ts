/**
 * Guardian Deployment Provider types (GAI-01).
 * Product-agnostic. No operational behavior.
 */

export type DeploymentProviderState = "ready" | "inactive";

export interface DeploymentProviderMeta {
  readonly kind: "deployment";
  readonly contractId: "deployment-provider";
}