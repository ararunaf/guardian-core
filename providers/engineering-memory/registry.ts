/**
 * Guardian Engineering Memory Provider local registry (GAI-08).
 */
import type { IEngineeringMemoryProvider } from "../../contracts/IEngineeringMemoryProvider";
import type { GuardianProviderDescriptor } from "../../types/provider_types";
import {
  createEngineeringMemoryProvider,
  describeEngineeringMemoryProvider,
} from "./factory";

let instance: IEngineeringMemoryProvider | null = null;
let descriptor: GuardianProviderDescriptor | null = null;

export const EngineeringMemoryProviderRegistry = {
  ensure(): IEngineeringMemoryProvider {
    if (!instance) {
      instance = createEngineeringMemoryProvider();
      descriptor = describeEngineeringMemoryProvider();
    }
    return instance;
  },
  get(): IEngineeringMemoryProvider | null {
    return instance;
  },
  describe(): GuardianProviderDescriptor {
    return descriptor ?? describeEngineeringMemoryProvider();
  },
  reset(): void {
    instance = null;
    descriptor = null;
  },
};
