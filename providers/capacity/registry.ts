/**
 * Guardian Capacity Provider local registry (GAI-06).
 */
import type { ICapacityProvider } from "../../contracts/ICapacityProvider";
import type { GuardianProviderDescriptor } from "../../types/provider_types";
import { createCapacityProvider, describeCapacityProvider } from "./factory";

let instance: ICapacityProvider | null = null;
let descriptor: GuardianProviderDescriptor | null = null;

export const CapacityProviderRegistry = {
  ensure(): ICapacityProvider {
    if (!instance) {
      instance = createCapacityProvider();
      descriptor = describeCapacityProvider();
    }
    return instance;
  },
  get(): ICapacityProvider | null {
    return instance;
  },
  describe(): GuardianProviderDescriptor {
    return descriptor ?? describeCapacityProvider();
  },
  reset(): void {
    instance = null;
    descriptor = null;
  },
};