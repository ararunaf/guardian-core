/**
 * Guardian Root Cause Provider configuration (GAI-04).
 */
import type { GuardianProviderConfiguration } from "../../types/provider_types";
import { GUARDIAN_PROVIDER_VERSION } from "../../types/provider_types";

export const ROOT_CAUSE_PROVIDER_CONFIGURATION: GuardianProviderConfiguration = {
  enabled: true,
  version: GUARDIAN_PROVIDER_VERSION,
  options: {
    operational: true,
    requiresDiagnosis: true,
    autoPatch: false,
    autoDeploy: false,
  },
};

export function getRootCauseProviderConfiguration(): GuardianProviderConfiguration {
  return ROOT_CAUSE_PROVIDER_CONFIGURATION;
}
