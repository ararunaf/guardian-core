/**
 * Guardian Capacity Provider configuration (GAI-06).
 */
import type { GuardianProviderConfiguration } from "../../types/provider_types";
import { GUARDIAN_PROVIDER_VERSION } from "../../types/provider_types";

export const CAPACITY_PROVIDER_CONFIGURATION: GuardianProviderConfiguration = {
  enabled: true,
  version: GUARDIAN_PROVIDER_VERSION,
  options: {
    operational: true,
    generativeAi: false,
    execution: false,
  },
};

export function getCapacityProviderConfiguration(): GuardianProviderConfiguration {
  return CAPACITY_PROVIDER_CONFIGURATION;
}