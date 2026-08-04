/**
 * Guardian Observability Provider configuration (GAI-02).
 */

import type { GuardianProviderConfiguration } from "../../types/provider_types";
import { GUARDIAN_PROVIDER_VERSION } from "../../types/provider_types";

export const OBSERVABILITY_PROVIDER_CONFIGURATION: GuardianProviderConfiguration = {
  enabled: true,
  version: GUARDIAN_PROVIDER_VERSION,
  options: {
    operational: true,
    autonomousActions: false,
    timeline: true,
    sessions: true,
    health: true,
    metrics: true,
    audit: true,
    statistics: true,
  },
};

export function getObservabilityProviderConfiguration(): GuardianProviderConfiguration {
  return OBSERVABILITY_PROVIDER_CONFIGURATION;
}
