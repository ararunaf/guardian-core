/**
 * Guardian Hypothesis Provider configuration (GAI-04).
 */
import type { GuardianProviderConfiguration } from "../../types/provider_types";
import { GUARDIAN_PROVIDER_VERSION } from "../../types/provider_types";

export const HYPOTHESIS_PROVIDER_CONFIGURATION: GuardianProviderConfiguration = {
  enabled: true,
  version: GUARDIAN_PROVIDER_VERSION,
  options: {
    operational: true,
    generativeAi: false,
    autoPatch: false,
  },
};

export function getHypothesisProviderConfiguration(): GuardianProviderConfiguration {
  return HYPOTHESIS_PROVIDER_CONFIGURATION;
}
