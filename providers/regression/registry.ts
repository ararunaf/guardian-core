/**
 * Guardian Regression Provider local registry (GAI-05).
 */
import type { IRegressionProvider } from "../../contracts/IRegressionProvider";
import type { GuardianProviderDescriptor } from "../../types/provider_types";
import { createRegressionProvider, describeRegressionProvider } from "./factory";

let instance: IRegressionProvider | null = null;
let descriptor: GuardianProviderDescriptor | null = null;

export const RegressionProviderRegistry = {
  ensure(): IRegressionProvider {
    if (!instance) {
      instance = createRegressionProvider();
      descriptor = describeRegressionProvider();
    }
    return instance;
  },
  get(): IRegressionProvider | null {
    return instance;
  },
  describe(): GuardianProviderDescriptor {
    return descriptor ?? describeRegressionProvider();
  },
  reset(): void {
    instance = null;
    descriptor = null;
  },
};
