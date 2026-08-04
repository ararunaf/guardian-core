/**
 * Guardian Diagnostics Provider configuration (GAI-01).
 */

import type { GuardianProviderConfiguration } from "../../types/provider_types";
import { GUARDIAN_PROVIDER_VERSION } from "../../types/provider_types";

export const DIAGNOSTICS_PROVIDER_CONFIGURATION: GuardianProviderConfiguration = {
  enabled: true,
  version: GUARDIAN_PROVIDER_VERSION,
  options: {
    operational: false,
    autonomousActions: false,
  },
};

export function getDiagnosticsProviderConfiguration(): GuardianProviderConfiguration {
  return DIAGNOSTICS_PROVIDER_CONFIGURATION;
}