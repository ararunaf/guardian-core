/**
 * Guardian AI - IDeploymentProvider contract (GAI-01).
 * Interface only. Ready shell — no deployment actions in GAI-01.
 */

export interface IDeploymentProvider {
  readonly id: "deployment-provider";
  readonly ready: boolean;
  readonly name: string;
}
