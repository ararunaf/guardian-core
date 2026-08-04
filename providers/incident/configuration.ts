/**
 * Incident Provider configuration (GAI-01).
 */

import type { GuardianProviderConfiguration } from "../../types/provider_types";
import { GUARDIAN_PROVIDER_VERSION } from "../../types/provider_types";

export const INCIDENT_PROVIDER_CONFIGURATION: GuardianProviderConfiguration = {
  enabled: true,
  version: GUARDIAN_PROVIDER_VERSION,
  options: {
    operational: true,
    detectOnly: true,
    recoveryEnabled: false,
    autonomousActions: false,
  },
};

export function getIncidentProviderConfiguration(): GuardianProviderConfiguration {
  return INCIDENT_PROVIDER_CONFIGURATION;
}