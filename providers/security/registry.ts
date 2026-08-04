/**
 * Guardian Security Provider local registry (GAI-07).
 */
import type { ISecurityProvider } from "../../contracts/ISecurityProvider";
import type { GuardianProviderDescriptor } from "../../types/provider_types";
import { createSecurityProvider, describeSecurityProvider } from "./factory";

let instance: ISecurityProvider | null = null;
let descriptor: GuardianProviderDescriptor | null = null;

export const SecurityProviderRegistry = {
  ensure(): ISecurityProvider {
    if (!instance) {
      instance = createSecurityProvider();
      descriptor = describeSecurityProvider();
    }
    return instance;
  },
  get(): ISecurityProvider | null {
    return instance;
  },
  describe(): GuardianProviderDescriptor {
    return descriptor ?? describeSecurityProvider();
  },
  reset(): void {
    instance = null;
    descriptor = null;
  },
};
