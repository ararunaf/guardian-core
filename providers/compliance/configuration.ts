/**
 * Guardian Compliance Provider configuration (GAI-07).
 */
import type { GuardianProviderConfiguration } from "../../types/provider_types";
import { GUARDIAN_PROVIDER_VERSION } from "../../types/provider_types";

export const COMPLIANCE_PROVIDER_CONFIGURATION: GuardianProviderConfiguration = {
  enabled: true,
  version: GUARDIAN_PROVIDER_VERSION,
  options: {
    operational: true,
    generativeAi: false,
    execution: false,
  },
};

export function getComplianceProviderConfiguration(): GuardianProviderConfiguration {
  return COMPLIANCE_PROVIDER_CONFIGURATION;
}