/**
 * Guardian AI - shared foundation types (GAI-00 / GAI-01 / GAI-02).
 */

export const GUARDIAN_FOUNDATION_VERSION = "1.0.0" as const;
export const GUARDIAN_SPRINT_ID = "GAI-08C" as const;
export const GUARDIAN_SPRINT_NAME = "Guardian Core Stabilization & Publication" as const;

export type GuardianStatus =
  | "foundation_ready"
  | "inactive"
  | "initializing"
  | "ready"
  | "degraded"
  | "error";

export type GuardianModuleId =
  | "core"
  | "contracts"
  | "runtime"
  | "events"
  | "registry"
  | "sdk"
  | "plugins"
  | "dashboard"
  | "context"
  | "types"
  | "adapters"
  | "supercontab"
  | "providers"
  | "incident"
  | "timeline"
  | "observability"
  | "correlation"
  | "diagnosis"
  | "hypothesis"
  | "root_cause"
  | "change"
  | "regression"
  | "performance"
  | "prediction"
  | "capacity"
  | "security"
  | "threat"
  | "compliance"
  | "engineering_knowledge"
  | "engineering_memory"
  | "engineering_ontology"
  | "version"
  | "compatibility"
  | "publication";

export type GuardianProductId =
  | "supercontab"
  | "medicflow"
  | "sysclinicall"
  | "adflow"
  | "mindhub"
  | "legalops"
  | "academic"
  | "student"
  | "iaeasy";

export type GuardianEventType =
  | "guardian.lifecycle.initialized"
  | "guardian.lifecycle.ready"
  | "guardian.plugin.registered"
  | "guardian.plugin.unregistered"
  | "guardian.adapter.bound"
  | "guardian.foundation.certified"
  | "guardian.incident.detected"
  | "guardian.provider.registered"
  | "guardian.runtime.incident_recorded"
  | "guardian.started"
  | "guardian.stopped"
  | "guardian.runtime.started"
  | "guardian.runtime.stopped"
  | "guardian.provider.loaded"
  | "guardian.provider.failed"
  | "guardian.adapter.loaded"
  | "guardian.dashboard.loaded"
  | "guardian.configuration.loaded"
  | "guardian.system.health"
  | "guardian.timeline.recorded"
  | "guardian.correlation.started"
  | "guardian.correlation.finished"
  | "guardian.context.built"
  | "guardian.knowledge.query.started"
  | "guardian.knowledge.query.finished"
  | "guardian.diagnosis.created"
  | "guardian.evidence.generated"
  | "guardian.hypothesis.started"
  | "guardian.hypothesis.generated"
  | "guardian.hypothesis.ranked"
  | "guardian.hypothesis.discarded"
  | "guardian.root_cause.started"
  | "guardian.root_cause.determined"
  | "guardian.evidence.consolidated"
  | "guardian.root_cause.published"
  | "guardian.change.detected"
  | "guardian.change.context.built"
  | "guardian.regression.started"
  | "guardian.regression.finished"
  | "guardian.regression.score.calculated"
  | "guardian.regression.risk_matrix.generated"
  | "guardian.regression.critical_areas.identified"
  | "guardian.regression.published"
  | "guardian.performance.collection.started"
  | "guardian.performance.metrics.generated"
  | "guardian.performance.prediction.started"
  | "guardian.performance.prediction.finished"
  | "guardian.capacity.analysis.started"
  | "guardian.capacity.analysis.finished"
  | "guardian.performance.published"
  | "guardian.security.scan.started"
  | "guardian.security.assessment.generated"
  | "guardian.threat.prediction.started"
  | "guardian.threat.prediction.finished"
  | "guardian.compliance.validation.started"
  | "guardian.compliance.validation.finished"
  | "guardian.compliance.published"
  | "guardian.knowledge.registered"
  | "guardian.memory.updated"
  | "guardian.ontology.updated"
  | "guardian.knowledge.indexed"
  | "guardian.entity.related"
  | "guardian.knowledge.published"
  | "guardian.core.frozen"
  | "guardian.sdk.generated"
  | "guardian.compatibility.checked"
  | "guardian.core.certified"
  | "guardian.repository.created"
  | "guardian.core.migrated"
  | "guardian.sdk.published"
  | "guardian.adapter.connected"
  | "guardian.compatibility.validated"
  | "guardian.cross_certification.started"
  | "guardian.cross_certification.finished"
  | "guardian.product.published";

export type GuardianPluginState = "declared" | "registered" | "inactive" | "active";

export type GuardianRoadmapSprintId =
  | "GAI-00"
  | "GAI-01"
  | "GAI-02"
  | "GAI-03"
  | "GAI-04"
  | "GAI-05"
  | "GAI-06"
  | "GAI-07"
  | "GAI-08"
  | "GAI-08A"
  | "GAI-08B"
  | "GAI-08C"
  | "GAI-09"
  | "GAI-10"
  | "GAI-11"
  | "GAI-12"
  | "GAI-13"
  | "GAI-14";

export interface GuardianModuleDescriptor {
  readonly id: GuardianModuleId;
  readonly name: string;
  readonly ready: boolean;
}

export interface GuardianFoundationSnapshot {
  readonly sprintId: typeof GUARDIAN_SPRINT_ID;
  readonly sprintName: typeof GUARDIAN_SPRINT_NAME;
  readonly version: typeof GUARDIAN_FOUNDATION_VERSION;
  readonly status: GuardianStatus;
  readonly label: "Guardian AI";
  readonly foundationLabel: "Guardian Architecture Foundation";
  readonly foundationReady: true;
  readonly incidentEngineReady: boolean;
  readonly observabilityReady: boolean;
  readonly timelineReady: boolean;
  readonly diagnosisReady: boolean;
  readonly correlationReady: boolean;
  readonly hypothesisReady: boolean;
  readonly rootCauseReady: boolean;
  readonly changeIntelligenceReady: boolean;
  readonly regressionReady: boolean;
  readonly performanceReady: boolean;
  readonly predictionReady: boolean;
  readonly capacityReady: boolean;
  readonly securityReady: boolean;
  readonly threatReady: boolean;
  readonly complianceReady: boolean;
  readonly engineeringKnowledgeReady: boolean;
  readonly engineeringMemoryReady: boolean;
  readonly engineeringOntologyReady: boolean;
  readonly incidentsDetected: number;
  readonly aiEnabled: false;
  readonly modules: readonly GuardianModuleDescriptor[];
  readonly generatedAt: string;
}
