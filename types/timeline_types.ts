/**
 * Engineering Timeline model types (GAI-02).
 * Official Guardian event record. No diagnosis / AI / patch execution.
 */

export type EngineeringTimelineSeverity =
  | "critical"
  | "high"
  | "medium"
  | "low"
  | "info";

export type EngineeringTimelineCategory =
  | "lifecycle"
  | "incident"
  | "runtime"
  | "provider"
  | "adapter"
  | "dashboard"
  | "configuration"
  | "health"
  | "session"
  | "system"
  | "audit"
  | "correlation"
  | "context"
  | "knowledge"
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
  | "memory"
  | "ontology"
  | "compatibility"
  | "version"
  | "sdk"
  | "core";

export type EngineeringTimelineStatus =
  | "recorded"
  | "observed"
  | "closed";

export type EngineeringLifecycleStage =
  | "bootstrap"
  | "initialized"
  | "ready"
  | "running"
  | "stopped"
  | "degraded"
  | "observed";

export type EngineeringRecoveryState =
  | "none"
  | "pending"
  | "not_applicable";

export type EngineeringTimelineOrigin =
  | "guardian_core"
  | "event_bus"
  | "runtime"
  | "provider"
  | "adapter"
  | "dashboard"
  | "registry"
  | "system"
  | "manual";

/** Prepared future reference slots. Never resolved in GAI-02. */
export interface EngineeringPreparedReference {
  readonly prepared: boolean;
  readonly referenceId: string | null;
  readonly consulted?: boolean;
}

export const EMPTY_PREPARED_REFERENCE: EngineeringPreparedReference = {
  prepared: true,
  referenceId: null,
};

/**
 * Official Engineering Timeline Event.
 * All Guardian observability events must materialize through this model.
 */
export interface EngineeringTimelineEvent {
  readonly timelineId: string;
  readonly timestamp: string;
  readonly eventType: string;
  readonly severity: EngineeringTimelineSeverity;
  readonly category: EngineeringTimelineCategory;
  readonly source: string;
  readonly provider: string | null;
  readonly module: string;
  readonly workspace: string | null;
  readonly tenant: string | null;
  readonly company: string | null;
  readonly correlationId: string;
  readonly incidentId: string | null;
  readonly status: EngineeringTimelineStatus;
  readonly executionTime: number | null;
  readonly tags: readonly string[];
  readonly payload: Readonly<Record<string, unknown>>;
  readonly observations: string | null;
  readonly lifecycleStage: EngineeringLifecycleStage;
  readonly origin: EngineeringTimelineOrigin;
  readonly recoveryState: EngineeringRecoveryState;
  /** Prepared for GAI-03 Knowledge Diagnosis. */
  readonly knowledgeReference: EngineeringPreparedReference;
  /** Prepared for GAI-04 Root Cause Analysis. */
  readonly diagnosisReference: EngineeringPreparedReference;
  /** Prepared for GAI-10 Patch Generator. */
  readonly patchReference: EngineeringPreparedReference;
  /** Prepared for GAI-12 Deployment Guardian. */
  readonly deployReference: EngineeringPreparedReference;
}

export interface EngineeringTimelineInput {
  readonly eventType: string;
  readonly severity?: EngineeringTimelineSeverity;
  readonly category: EngineeringTimelineCategory;
  readonly source: string;
  readonly provider?: string | null;
  readonly module?: string;
  readonly workspace?: string | null;
  readonly tenant?: string | null;
  readonly company?: string | null;
  readonly correlationId?: string;
  readonly incidentId?: string | null;
  readonly status?: EngineeringTimelineStatus;
  readonly executionTime?: number | null;
  readonly tags?: readonly string[];
  readonly payload?: Readonly<Record<string, unknown>>;
  readonly observations?: string | null;
  readonly lifecycleStage?: EngineeringLifecycleStage;
  readonly origin?: EngineeringTimelineOrigin;
  readonly recoveryState?: EngineeringRecoveryState;
}

export interface EngineeringTimelineFilter {
  readonly eventType?: string;
  readonly category?: EngineeringTimelineCategory;
  readonly severity?: EngineeringTimelineSeverity;
  readonly source?: string;
  readonly provider?: string;
  readonly module?: string;
  readonly incidentId?: string;
  readonly correlationId?: string;
  readonly query?: string;
  readonly limit?: number;
}

export const MANDATORY_TIMELINE_EVENT_TYPES = [
  "guardian.started",
  "guardian.stopped",
  "guardian.incident.detected",
  "guardian.runtime.started",
  "guardian.runtime.stopped",
  "guardian.provider.registered",
  "guardian.provider.loaded",
  "guardian.provider.failed",
  "guardian.adapter.loaded",
  "guardian.dashboard.loaded",
  "guardian.configuration.loaded",
  "guardian.system.health",
  "guardian.correlation.started",
  "guardian.correlation.finished",
  "guardian.context.built",
  "guardian.knowledge.query.started",
  "guardian.knowledge.query.finished",
  "guardian.diagnosis.created",
  "guardian.evidence.generated",
  "guardian.hypothesis.started",
  "guardian.hypothesis.generated",
  "guardian.hypothesis.ranked",
  "guardian.hypothesis.discarded",
  "guardian.root_cause.started",
  "guardian.root_cause.determined",
  "guardian.evidence.consolidated",
  "guardian.root_cause.published",
  "guardian.change.detected",
  "guardian.change.context.built",
  "guardian.regression.started",
  "guardian.regression.finished",
  "guardian.regression.score.calculated",
  "guardian.regression.risk_matrix.generated",
  "guardian.regression.critical_areas.identified",
  "guardian.regression.published",
  "guardian.performance.collection.started",
  "guardian.performance.metrics.generated",
  "guardian.performance.prediction.started",
  "guardian.performance.prediction.finished",
  "guardian.capacity.analysis.started",
  "guardian.capacity.analysis.finished",
  "guardian.performance.published",
  "guardian.security.scan.started",
  "guardian.security.assessment.generated",
  "guardian.threat.prediction.started",
  "guardian.threat.prediction.finished",
  "guardian.compliance.validation.started",
  "guardian.compliance.validation.finished",
  "guardian.compliance.published",
  "guardian.knowledge.registered",
  "guardian.memory.updated",
  "guardian.ontology.updated",
  "guardian.knowledge.indexed",
  "guardian.entity.related",
  "guardian.knowledge.published",
  "guardian.core.frozen",
  "guardian.sdk.generated",
  "guardian.compatibility.checked",
  "guardian.core.certified",
  "guardian.repository.created",
  "guardian.core.migrated",
  "guardian.sdk.published",
  "guardian.adapter.connected",
  "guardian.compatibility.validated",
  "guardian.cross_certification.started",
  "guardian.cross_certification.finished",
  "guardian.product.published",
] as const;

export type MandatoryTimelineEventType =
  (typeof MANDATORY_TIMELINE_EVENT_TYPES)[number];
