/**
 * Guardian SDK contracts (GAI-08A).
 * Re-exports contract identifiers for public consumption.
 */

export const GUARDIAN_SDK_CONTRACT_IDS = [
  "IGuardianRuntime",
  "IGuardianContext",
  "IGuardianEvent",
  "IGuardianPlugin",
  "IIncidentProvider",
  "IKnowledgeProvider",
  "IDeploymentProvider",
  "IObservabilityProvider",
  "IPerformanceProvider",
  "ISecurityProvider",
  "IDiagnosticsProvider",
  "IHypothesisProvider",
  "IRootCauseProvider",
  "IChangeIntelligenceProvider",
  "IRegressionProvider",
  "IPredictionProvider",
  "ICapacityProvider",
  "IThreatProvider",
  "IComplianceProvider",
  "IEngineeringMemoryProvider",
  "IEngineeringOntologyProvider",
] as const;

export type GuardianSdkContractId = (typeof GUARDIAN_SDK_CONTRACT_IDS)[number];

export interface GuardianSdkContractsDescriptor {
  readonly ids: typeof GUARDIAN_SDK_CONTRACT_IDS;
  readonly stable: true;
  readonly versioned: true;
}

export const GuardianSdkContracts: GuardianSdkContractsDescriptor = {
  ids: GUARDIAN_SDK_CONTRACT_IDS,
  stable: true,
  versioned: true,
};