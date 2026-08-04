/**
 * Guardian Engineering Ontology Provider configuration (GAI-08).
 */

import type { GuardianProviderConfiguration } from "../../types/provider_types";
import { GUARDIAN_PROVIDER_VERSION } from "../../types/provider_types";

export const ENGINEERING_ONTOLOGY_PROVIDER_CONFIGURATION: GuardianProviderConfiguration = {
  enabled: true,
  version: GUARDIAN_PROVIDER_VERSION,
  options: {
    operational: true,
    inference: false,
    reasoning: false,
    autoLearning: false,
    generativeAi: false,
    ml: false,
  },
};

export function getEngineeringOntologyProviderConfiguration(): GuardianProviderConfiguration {
  return ENGINEERING_ONTOLOGY_PROVIDER_CONFIGURATION;
}
