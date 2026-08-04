/**
 * Guardian Engineering Memory Provider configuration (GAI-08).
 */

import type { GuardianProviderConfiguration } from "../../types/provider_types";
import { GUARDIAN_PROVIDER_VERSION } from "../../types/provider_types";

export const ENGINEERING_MEMORY_PROVIDER_CONFIGURATION: GuardianProviderConfiguration = {
  enabled: true,
  version: GUARDIAN_PROVIDER_VERSION,
  options: {
    operational: true,
    autoLearning: false,
    generativeAi: false,
    ml: false,
  },
};

export function getEngineeringMemoryProviderConfiguration(): GuardianProviderConfiguration {
  return ENGINEERING_MEMORY_PROVIDER_CONFIGURATION;
}
