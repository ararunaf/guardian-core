/**
 * Guardian Change Intelligence Provider local registry (GAI-05).
 */
import type { IChangeIntelligenceProvider } from "../../contracts/IChangeIntelligenceProvider";
import type { GuardianProviderDescriptor } from "../../types/provider_types";
import {
  createChangeIntelligenceProvider,
  describeChangeIntelligenceProvider,
} from "./factory";

let instance: IChangeIntelligenceProvider | null = null;
let descriptor: GuardianProviderDescriptor | null = null;

export const ChangeIntelligenceProviderRegistry = {
  ensure(): IChangeIntelligenceProvider {
    if (!instance) {
      instance = createChangeIntelligenceProvider();
      descriptor = describeChangeIntelligenceProvider();
    }
    return instance;
  },
  get(): IChangeIntelligenceProvider | null {
    return instance;
  },
  describe(): GuardianProviderDescriptor {
    return descriptor ?? describeChangeIntelligenceProvider();
  },
  reset(): void {
    instance = null;
    descriptor = null;
  },
};
