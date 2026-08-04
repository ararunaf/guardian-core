/**
 * Incident Provider local registry (GAI-01).
 */

import type { IIncidentProvider } from "../../contracts/IIncidentProvider";
import type { GuardianProviderDescriptor } from "../../types/provider_types";
import {
  createIncidentProvider,
  describeIncidentProvider,
  resetIncidentIdSequence,
} from "./factory";

let instance: IIncidentProvider | null = null;
let descriptor: GuardianProviderDescriptor | null = null;

export const IncidentProviderRegistry = {
  ensure(): IIncidentProvider {
    if (!instance) {
      instance = createIncidentProvider();
      descriptor = describeIncidentProvider();
    }
    return instance;
  },

  get(): IIncidentProvider | null {
    return instance;
  },

  describe(): GuardianProviderDescriptor {
    return descriptor ?? describeIncidentProvider();
  },

  reset(): void {
    instance = null;
    descriptor = null;
    resetIncidentIdSequence();
  },
};