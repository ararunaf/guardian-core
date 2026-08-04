/**
 * Guardian Performance Provider configuration (GAI-06).
 */
import type { GuardianProviderConfiguration } from "../../types/provider_types";
import { GUARDIAN_PROVIDER_VERSION } from "../../types/provider_types";

export const PERFORMANCE_PROVIDER_CONFIGURATION: GuardianProviderConfiguration = {
  enabled: true,
  version: GUARDIAN_PROVIDER_VERSION,
  options: {
    operational: true,
    generativeAi: false,
    autoOptimization: false,
  },
};

export function getPerformanceProviderConfiguration(): GuardianProviderConfiguration {
  return PERFORMANCE_PROVIDER_CONFIGURATION;
}