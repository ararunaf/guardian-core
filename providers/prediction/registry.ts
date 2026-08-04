/**
 * Guardian Prediction Provider local registry (GAI-06).
 */
import type { IPredictionProvider } from "../../contracts/IPredictionProvider";
import type { GuardianProviderDescriptor } from "../../types/provider_types";
import { createPredictionProvider, describePredictionProvider } from "./factory";

let instance: IPredictionProvider | null = null;
let descriptor: GuardianProviderDescriptor | null = null;

export const PredictionProviderRegistry = {
  ensure(): IPredictionProvider {
    if (!instance) {
      instance = createPredictionProvider();
      descriptor = describePredictionProvider();
    }
    return instance;
  },
  get(): IPredictionProvider | null {
    return instance;
  },
  describe(): GuardianProviderDescriptor {
    return descriptor ?? describePredictionProvider();
  },
  reset(): void {
    instance = null;
    descriptor = null;
  },
};