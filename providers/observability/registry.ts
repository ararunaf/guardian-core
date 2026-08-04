/**
 * Guardian Observability Provider local registry (GAI-01).
 */

import type { IObservabilityProvider } from "../../contracts/IObservabilityProvider";
import type { GuardianProviderDescriptor } from "../../types/provider_types";
import { createObservabilityProvider, describeObservabilityProvider } from "./factory";

let instance: IObservabilityProvider | null = null;
let descriptor: GuardianProviderDescriptor | null = null;

export const ObservabilityProviderRegistry = {
  ensure(): IObservabilityProvider {
    if (!instance) {
      instance = createObservabilityProvider();
      descriptor = describeObservabilityProvider();
    }
    return instance;
  },

  get(): IObservabilityProvider | null {
    return instance;
  },

  describe(): GuardianProviderDescriptor {
    return descriptor ?? describeObservabilityProvider();
  },

  reset(): void {
    instance = null;
    descriptor = null;
  },
};