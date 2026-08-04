/**
 * Guardian Root Cause Provider local registry (GAI-04).
 */
import type { IRootCauseProvider } from "../../contracts/IRootCauseProvider";
import type { GuardianProviderDescriptor } from "../../types/provider_types";
import { createRootCauseProvider, describeRootCauseProvider } from "./factory";

let instance: IRootCauseProvider | null = null;
let descriptor: GuardianProviderDescriptor | null = null;

export const RootCauseProviderRegistry = {
  ensure(): IRootCauseProvider {
    if (!instance) {
      instance = createRootCauseProvider();
      descriptor = describeRootCauseProvider();
    }
    return instance;
  },
  get(): IRootCauseProvider | null {
    return instance;
  },
  describe(): GuardianProviderDescriptor {
    return descriptor ?? describeRootCauseProvider();
  },
  reset(): void {
    instance = null;
    descriptor = null;
  },
};
