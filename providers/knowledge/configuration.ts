/**
 * Guardian Knowledge Provider configuration (GAI-03).
 * Consult-only. No autonomous actions.
 */

import type { GuardianProviderConfiguration } from "../../types/provider_types";
import { GUARDIAN_PROVIDER_VERSION } from "../../types/provider_types";

export const KNOWLEDGE_PROVIDER_CONFIGURATION: GuardianProviderConfiguration = {
  enabled: true,
  version: GUARDIAN_PROVIDER_VERSION,
  options: {
    operational: true,
    autonomousActions: false,
    consultOnly: true,
    pipeline: "ukal->corporate_rag->knowledge_platform",
  },
};

export function getKnowledgeProviderConfiguration(): GuardianProviderConfiguration {
  return KNOWLEDGE_PROVIDER_CONFIGURATION;
}
