/**
 * Guardian Deployment Provider configuration (GAI-01).
 */

import type { GuardianProviderConfiguration } from "../../types/provider_types";
import { GUARDIAN_PROVIDER_VERSION } from "../../types/provider_types";

export const DEPLOYMENT_PROVIDER_CONFIGURATION: GuardianProviderConfiguration = {
  enabled: true,
  version: GUARDIAN_PROVIDER_VERSION,
  options: {
    operational: false,
    autonomousActions: false,
  },
};

export function getDeploymentProviderConfiguration(): GuardianProviderConfiguration {
  return DEPLOYMENT_PROVIDER_CONFIGURATION;
}