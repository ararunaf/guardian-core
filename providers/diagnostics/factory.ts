/**
 * Guardian Diagnostics Provider factory (GAI-01 / GAI-05 / GAI-06).
 * Expanded for evidence + change/regression/performance support. No product-specific logic. No auto-heal.
 */

import type { IDiagnosticsProvider } from "../../contracts/IDiagnosticsProvider";
import type { GuardianProviderDescriptor } from "../../types/provider_types";
import { GUARDIAN_PROVIDER_VERSION } from "../../types/provider_types";
import { getDiagnosticsProviderConfiguration } from "./configuration";

export function createDiagnosticsProvider(): IDiagnosticsProvider {
  const config = getDiagnosticsProviderConfiguration();
  return {
    id: "diagnostics-provider",
    ready: config.enabled,
    name: "Guardian Diagnostics Provider",
    operational: true,
    capabilities: {
      evidenceSupport: true,
      hypothesisSupport: false,
      rootCauseSupport: false,
      changeImpactSupport: true,
      regressionEvidenceSupport: true,
      performanceEvidenceSupport: true,
      predictionEvidenceSupport: true,
      capacityEvidenceSupport: true,
      securityEvidenceSupport: true,
      threatEvidenceSupport: true,
      complianceEvidenceSupport: true,
      engineeringMemorySupport: true,
      engineeringOntologySupport: true,
      knowledgeObjectSupport: true,
      codeExecution: false,
      autoHeal: false,
    },
  };
}

export function describeDiagnosticsProvider(): GuardianProviderDescriptor {
  const config = getDiagnosticsProviderConfiguration();
  return {
    id: "diagnostics",
    name: "Guardian Diagnostics Provider",
    ready: config.enabled,
    operational: true,
    status: config.enabled ? "ready" : "inactive",
    version: GUARDIAN_PROVIDER_VERSION,
  };
}