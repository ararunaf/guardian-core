/**
 * Guardian Security Provider configuration (GAI-07).
 */

import type { GuardianProviderConfiguration } from "../../types/provider_types";
import { GUARDIAN_PROVIDER_VERSION } from "../../types/provider_types";

export const SECURITY_PROVIDER_CONFIGURATION: GuardianProviderConfiguration = {
  enabled: true,
  version: GUARDIAN_PROVIDER_VERSION,
  options: {
    operational: true,
    autonomousActions: false,
    autoRemediation: false,
    generativeAi: false,
  },
};

export function getSecurityProviderConfiguration(): GuardianProviderConfiguration {
  return SECURITY_PROVIDER_CONFIGURATION;
}
