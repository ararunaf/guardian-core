/**
 * Guardian Adapter Runtime API (GAI-08B).
 * Sole Core surface adapters may import. No deeper internal module access.
 * Re-exports required runtime symbols via the Public API boundary.
 */

export {
  createAdapterDescriptor,
  type GuardianAdapterDescriptor,
} from "../../adapters/base_adapter";
export { GuardianAdapterRegistry } from "../../adapters/adapter_registry";
export { GuardianEventBus } from "../../events/event_bus";
export { IncidentDetectionEngine } from "../../incident/incident_detection_engine";
export {
  createDeploymentProvider,
  describeDeploymentProvider,
} from "../../providers/deployment/factory";
export {
  createDiagnosticsProvider,
  describeDiagnosticsProvider,
} from "../../providers/diagnostics/factory";
export {
  createHypothesisProvider,
  describeHypothesisProvider,
} from "../../providers/hypothesis/factory";
export {
  createRootCauseProvider,
  describeRootCauseProvider,
} from "../../providers/root-cause/factory";
export {
  createChangeIntelligenceProvider,
  describeChangeIntelligenceProvider,
} from "../../providers/change-intelligence/factory";
export {
  createRegressionProvider,
  describeRegressionProvider,
} from "../../providers/regression/factory";
export {
  createPredictionProvider,
  describePredictionProvider,
} from "../../providers/prediction/factory";
export {
  createCapacityProvider,
  describeCapacityProvider,
} from "../../providers/capacity/factory";
export {
  createThreatProvider,
  describeThreatProvider,
} from "../../providers/threat/factory";
export {
  createComplianceProvider,
  describeComplianceProvider,
} from "../../providers/compliance/factory";
export {
  createEngineeringMemoryProvider,
  describeEngineeringMemoryProvider,
} from "../../providers/engineering-memory/factory";
export {
  createEngineeringOntologyProvider,
  describeEngineeringOntologyProvider,
} from "../../providers/engineering-ontology/factory";
export {
  createIncidentProvider,
  describeIncidentProvider,
} from "../../providers/incident/factory";
export {
  createKnowledgeProvider,
  describeKnowledgeProvider,
  setKnowledgeConsultAdapter,
} from "../../providers/knowledge/factory";
export {
  createObservabilityProvider,
  describeObservabilityProvider,
} from "../../providers/observability/factory";
export {
  createPerformanceProvider,
  describePerformanceProvider,
} from "../../providers/performance/factory";
export { GuardianProviderRegistry } from "../../providers/provider_registry";
export {
  createSecurityProvider,
  describeSecurityProvider,
} from "../../providers/security/factory";
export { GuardianRegistry } from "../../registry/guardian_registry";
export { EngineeringTimeline } from "../../timeline/timeline_service";
export type {
  GuardianIncidentCategory,
  GuardianIncidentOrigin,
  GuardianIncidentSignal,
} from "../../types/incident_types";
export { GUARDIAN_PROVIDER_IDS } from "../../types/provider_types";
export { GUARDIAN_ADAPTER_VERSION } from "../../version/version_manifest";

import { GuardianAdapterRegistry } from "../../adapters/adapter_registry";
import type { GuardianAdapterDescriptor } from "../../adapters/base_adapter";

/** Official Public API helper: register + bind a product adapter descriptor. */
export function bindProductAdapter(adapter: GuardianAdapterDescriptor): GuardianAdapterDescriptor | null {
  GuardianAdapterRegistry.register(adapter);
  return GuardianAdapterRegistry.bind(adapter.id);
}
