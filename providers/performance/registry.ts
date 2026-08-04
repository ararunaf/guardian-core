/**
 * Guardian Performance Provider local registry (GAI-06).
 */
import type { IPerformanceProvider } from "../../contracts/IPerformanceProvider";
import type { GuardianProviderDescriptor } from "../../types/provider_types";
import { createPerformanceProvider, describePerformanceProvider } from "./factory";

let instance: IPerformanceProvider | null = null;
let descriptor: GuardianProviderDescriptor | null = null;

export const PerformanceProviderRegistry = {
  ensure(): IPerformanceProvider {
    if (!instance) {
      instance = createPerformanceProvider();
      descriptor = describePerformanceProvider();
    }
    return instance;
  },
  get(): IPerformanceProvider | null {
    return instance;
  },
  describe(): GuardianProviderDescriptor {
    return descriptor ?? describePerformanceProvider();
  },
  reset(): void {
    instance = null;
    descriptor = null;
  },
};