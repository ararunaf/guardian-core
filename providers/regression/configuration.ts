/**
 * Guardian Regression Provider configuration (GAI-05).
 */
import type { GuardianProviderConfiguration } from "../../types/provider_types";
import { GUARDIAN_PROVIDER_VERSION } from "../../types/provider_types";

export const REGRESSION_PROVIDER_CONFIGURATION: GuardianProviderConfiguration = {
  enabled: true,
  version: GUARDIAN_PROVIDER_VERSION,
  options: {
    operational: true,
    generativeAi: false,
    autoPatch: false,
  },
};

export function getRegressionProviderConfiguration(): GuardianProviderConfiguration {
  return REGRESSION_PROVIDER_CONFIGURATION;
}
