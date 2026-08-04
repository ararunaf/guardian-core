/**
 * Guardian Deployment Provider local registry (GAI-01).
 */

import type { IDeploymentProvider } from "../../contracts/IDeploymentProvider";
import type { GuardianProviderDescriptor } from "../../types/provider_types";
import { createDeploymentProvider, describeDeploymentProvider } from "./factory";

let instance: IDeploymentProvider | null = null;
let descriptor: GuardianProviderDescriptor | null = null;

export const DeploymentProviderRegistry = {
  ensure(): IDeploymentProvider {
    if (!instance) {
      instance = createDeploymentProvider();
      descriptor = describeDeploymentProvider();
    }
    return instance;
  },

  get(): IDeploymentProvider | null {
    return instance;
  },

  describe(): GuardianProviderDescriptor {
    return descriptor ?? describeDeploymentProvider();
  },

  reset(): void {
    instance = null;
    descriptor = null;
  },
};