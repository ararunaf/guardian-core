/**
 * Guardian Compliance Provider local registry (GAI-07).
 */
import type { IComplianceProvider } from "../../contracts/IComplianceProvider";
import type { GuardianProviderDescriptor } from "../../types/provider_types";
import { createComplianceProvider, describeComplianceProvider } from "./factory";

let instance: IComplianceProvider | null = null;
let descriptor: GuardianProviderDescriptor | null = null;

export const ComplianceProviderRegistry = {
  ensure(): IComplianceProvider {
    if (!instance) {
      instance = createComplianceProvider();
      descriptor = describeComplianceProvider();
    }
    return instance;
  },
  get(): IComplianceProvider | null {
    return instance;
  },
  describe(): GuardianProviderDescriptor {
    return descriptor ?? describeComplianceProvider();
  },
  reset(): void {
    instance = null;
    descriptor = null;
  },
};