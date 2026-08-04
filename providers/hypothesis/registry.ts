/**
 * Guardian Hypothesis Provider local registry (GAI-04).
 */
import type { IHypothesisProvider } from "../../contracts/IHypothesisProvider";
import type { GuardianProviderDescriptor } from "../../types/provider_types";
import { createHypothesisProvider, describeHypothesisProvider } from "./factory";

let instance: IHypothesisProvider | null = null;
let descriptor: GuardianProviderDescriptor | null = null;

export const HypothesisProviderRegistry = {
  ensure(): IHypothesisProvider {
    if (!instance) {
      instance = createHypothesisProvider();
      descriptor = describeHypothesisProvider();
    }
    return instance;
  },
  get(): IHypothesisProvider | null {
    return instance;
  },
  describe(): GuardianProviderDescriptor {
    return descriptor ?? describeHypothesisProvider();
  },
  reset(): void {
    instance = null;
    descriptor = null;
  },
};
