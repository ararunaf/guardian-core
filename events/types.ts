/**
 * Guardian Event Bus types (GAI-00 / GAI-01 / GAI-02).
 */

import type { IGuardianEvent } from "../contracts";
import type { GuardianEventType } from "../types";

export type GuardianEventHandler<TPayload = unknown> = (
  event: IGuardianEvent<TPayload>,
) => void;

export type GuardianEventUnsubscribe = () => void;

export interface GuardianEventRegistration {
  readonly type: GuardianEventType;
  readonly handlerCount: number;
}

export const GUARDIAN_EVENT_TYPES: readonly GuardianEventType[] = [
  "guardian.lifecycle.initialized",
  "guardian.lifecycle.ready",
  "guardian.plugin.registered",
  "guardian.plugin.unregistered",
  "guardian.adapter.bound",
  "guardian.foundation.certified",
  "guardian.incident.detected",
  "guardian.provider.registered",
  "guardian.runtime.incident_recorded",
  "guardian.started",
  "guardian.stopped",
  "guardian.runtime.started",
  "guardian.runtime.stopped",
  "guardian.provider.loaded",
  "guardian.provider.failed",
  "guardian.adapter.loaded",
  "guardian.dashboard.loaded",
  "guardian.configuration.loaded",
  "guardian.system.health",
  "guardian.timeline.recorded",
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
