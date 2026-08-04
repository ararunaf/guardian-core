/**
 * Guardian Threat Provider local registry (GAI-07).
 */
import type { IThreatProvider } from "../../contracts/IThreatProvider";
import type { GuardianProviderDescriptor } from "../../types/provider_types";
import { createThreatProvider, describeThreatProvider } from "./factory";

let instance: IThreatProvider | null = null;
let descriptor: GuardianProviderDescriptor | null = null;

export const ThreatProviderRegistry = {
  ensure(): IThreatProvider {
    if (!instance) {
      instance = createThreatProvider();
      descriptor = describeThreatProvider();
    }
    return instance;
  },
  get(): IThreatProvider | null {
    return instance;
  },
  describe(): GuardianProviderDescriptor {
    return descriptor ?? describeThreatProvider();
  },
  reset(): void {
    instance = null;
    descriptor = null;
  },
};