/**
 * Guardian Diagnostics Provider local registry (GAI-01).
 */

import type { IDiagnosticsProvider } from "../../contracts/IDiagnosticsProvider";
import type { GuardianProviderDescriptor } from "../../types/provider_types";
import { createDiagnosticsProvider, describeDiagnosticsProvider } from "./factory";

let instance: IDiagnosticsProvider | null = null;
let descriptor: GuardianProviderDescriptor | null = null;

export const DiagnosticsProviderRegistry = {
  ensure(): IDiagnosticsProvider {
    if (!instance) {
      instance = createDiagnosticsProvider();
      descriptor = describeDiagnosticsProvider();
    }
    return instance;
  },

  get(): IDiagnosticsProvider | null {
    return instance;
  },

  describe(): GuardianProviderDescriptor {
    return descriptor ?? describeDiagnosticsProvider();
  },

  reset(): void {
    instance = null;
    descriptor = null;
  },
};