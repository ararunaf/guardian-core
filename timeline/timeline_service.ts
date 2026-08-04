/**
 * Engineering Timeline Service (GAI-02).
 * Official Guardian event registry. All observability events pass through here.
 * No AI. No diagnosis. No HotFix. No automatic correction.
 */

import type { IGuardianEvent } from "../contracts";
import type { ITimelineService } from "../contracts/ITimelineService";
import { GuardianEventBus } from "../events/event_bus";
import type { GuardianEventUnsubscribe } from "../events/types";
import type { GuardianEventType } from "../types";
import type { GuardianIncident } from "../types/incident_types";
import {
  EMPTY_PREPARED_REFERENCE,
  MANDATORY_TIMELINE_EVENT_TYPES,
  type EngineeringTimelineCategory,
  type EngineeringTimelineEvent,
  type EngineeringTimelineFilter,
  type EngineeringTimelineInput,
  type EngineeringTimelineSeverity,
  type EngineeringLifecycleStage,
} from "../types/timeline_types";
import { TimelineStore } from "./timeline_store";

let timelineSeq = 0;

function createTimelineId(): string {
  timelineSeq += 1;
  return `guardian-tl-${Date.now()}-${timelineSeq}`;
}

function resolveDiagnosisReference(eventType: string, payload: Readonly<Record<string, unknown>>) {
  if (
    eventType.includes("hypothesis") ||
    eventType.includes("root_cause") ||
    eventType.includes("change") ||
    eventType.includes("regression") ||
    eventType.includes("performance") ||
    eventType.includes("prediction") ||
    eventType.includes("capacity") ||
    eventType.includes("diagnosis") ||
    eventType.includes("evidence")
  ) {
    const referenceId =
      (typeof payload.diagnosisId === "string" && payload.diagnosisId) ||
      (typeof payload.rootCauseId === "string" && payload.rootCauseId) ||
      (typeof payload.hypothesisId === "string" && payload.hypothesisId) ||
      null;
    return { prepared: false, referenceId, consulted: true };
  }
  return EMPTY_PREPARED_REFERENCE;
}

function resolveKnowledgeReference(eventType: string, payload: Readonly<Record<string, unknown>>) {
  if (
    eventType.includes("knowledge") ||
    eventType.includes("diagnosis") ||
    eventType.includes("evidence") ||
    eventType.includes("hypothesis") ||
    eventType.includes("root_cause") ||
    eventType.includes("change") ||
    eventType.includes("regression") ||
    eventType.includes("performance") ||
    eventType.includes("prediction") ||
    eventType.includes("capacity")
  ) {
    const referenceId =
      (typeof payload.accessId === "string" && payload.accessId) ||
      (typeof payload.diagnosisId === "string" && payload.diagnosisId) ||
      (typeof payload.chainId === "string" && payload.chainId) ||
      null;
    return { prepared: false, referenceId, consulted: true };
  }
  return EMPTY_PREPARED_REFERENCE;
}

function createCorrelationId(): string {
  return `guardian-corr-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function categoryForEventType(eventType: string): EngineeringTimelineCategory {
  if (eventType.includes("core.frozen") || eventType.includes("core.certified") || eventType.includes("core.migrated") || eventType.includes("repository.created") || eventType.includes("product.published") || eventType.includes("cross_certification")) return "core";
  if (eventType.includes("sdk.generated") || eventType.includes("sdk.published")) return "sdk";
  if (eventType.includes("compatibility")) return "compatibility";
  if (eventType.includes("adapter.connected") || eventType.includes("adapter.loaded") || eventType.includes("adapter.bound")) return "adapter";
  if (eventType.includes("correlation")) return "correlation";
  if (eventType.includes("context.built")) return "context";
  if (eventType.includes("memory")) return "memory";
  if (eventType.includes("ontology") || eventType.includes("entity.related")) return "ontology";
  if (eventType.includes("knowledge")) return "knowledge";
  if (eventType.includes("hypothesis")) return "hypothesis";
  if (eventType.includes("root_cause")) return "root_cause";
  if (eventType.includes("change")) return "change";
  if (eventType.includes("regression")) return "regression";
  if (eventType.includes("prediction")) return "prediction";
  if (eventType.includes("compliance")) return "compliance";
  if (eventType.includes("threat")) return "threat";
  if (eventType.includes("security")) return "security";
  if (eventType.includes("capacity")) return "capacity";
  if (eventType.includes("performance")) return "performance";
  if (eventType.includes("diagnosis") || eventType.includes("evidence")) return "diagnosis";
  if (eventType.includes("incident")) return "incident";
  if (eventType.includes("runtime")) return "runtime";
  if (eventType.includes("provider")) return "provider";
  if (eventType.includes("adapter")) return "adapter";
  if (eventType.includes("dashboard")) return "dashboard";
  if (eventType.includes("configuration")) return "configuration";
  if (eventType.includes("health")) return "health";
  if (eventType.includes("session")) return "session";
  if (eventType.includes("lifecycle") || eventType.includes("started") || eventType.includes("stopped")) {
    return "lifecycle";
  }
  return "system";
}

function severityForEventType(eventType: string): EngineeringTimelineSeverity {
  if (eventType.includes("failed") || eventType.includes("incident")) return "high";
  if (eventType.includes("stopped") || eventType.includes("health")) return "medium";
  return "info";
}

function lifecycleForEventType(eventType: string): EngineeringLifecycleStage {
  if (eventType.endsWith(".started") || eventType.includes("initialized")) return "initialized";
  if (eventType.includes("ready") || eventType.includes("loaded") || eventType.includes("registered")) {
    return "ready";
  }
  if (eventType.endsWith(".stopped")) return "stopped";
  if (eventType.includes("failed")) return "degraded";
  if (eventType.includes("health")) return "observed";
  return "observed";
}

function matchesFilter(
  event: EngineeringTimelineEvent,
  filter?: EngineeringTimelineFilter,
): boolean {
  if (!filter) return true;
  if (filter.eventType && event.eventType !== filter.eventType) return false;
  if (filter.category && event.category !== filter.category) return false;
  if (filter.severity && event.severity !== filter.severity) return false;
  if (filter.source && event.source !== filter.source) return false;
  if (filter.provider && event.provider !== filter.provider) return false;
  if (filter.module && event.module !== filter.module) return false;
  if (filter.incidentId && event.incidentId !== filter.incidentId) return false;
  if (filter.correlationId && event.correlationId !== filter.correlationId) return false;
  if (filter.query) {
    const q = filter.query.toLowerCase();
    const haystack = [
      event.eventType,
      event.source,
      event.module,
      event.provider ?? "",
      event.observations ?? "",
      JSON.stringify(event.payload),
    ]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  return true;
}

const BUS_EVENT_TYPES: readonly GuardianEventType[] = [
  "guardian.started",
  "guardian.stopped",
  "guardian.incident.detected",
  "guardian.runtime.started",
  "guardian.runtime.stopped",
  "guardian.runtime.incident_recorded",
  "guardian.provider.registered",
  "guardian.provider.loaded",
  "guardian.provider.failed",
  "guardian.adapter.bound",
  "guardian.adapter.loaded",
  "guardian.dashboard.loaded",
  "guardian.configuration.loaded",
  "guardian.system.health",
  "guardian.lifecycle.initialized",
  "guardian.lifecycle.ready",
  "guardian.foundation.certified",
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
];

class TimelineServiceImpl implements ITimelineService {
  readonly id = "timeline-service" as const;
  readonly name = "Engineering Timeline Service";
  private store = new TimelineStore();
  private unsubscribers: GuardianEventUnsubscribe[] = [];
  private listening = false;
  private recordingBusEvent = false;

  get ready(): boolean {
    return this.listening;
  }

  initialize(): void {
    // Always rebind after EventBus.reset() so subscriptions stay live.
    for (const unsubscribe of this.unsubscribers) {
      unsubscribe();
    }
    this.unsubscribers = [];
    this.listening = true;

    for (const type of BUS_EVENT_TYPES) {
      const unsubscribe = GuardianEventBus.subscribe(type, (event) => {
        this.ingestBusEvent(event);
      });
      this.unsubscribers.push(unsubscribe);
    }
  }

  record(input: EngineeringTimelineInput): EngineeringTimelineEvent {
    const event: EngineeringTimelineEvent = {
      timelineId: createTimelineId(),
      timestamp: new Date().toISOString(),
      eventType: input.eventType,
      severity: input.severity ?? severityForEventType(input.eventType),
      category: input.category,
      source: input.source,
      provider: input.provider ?? null,
      module: input.module ?? "guardian",
      workspace: input.workspace ?? null,
      tenant: input.tenant ?? null,
      company: input.company ?? null,
      correlationId: input.correlationId ?? createCorrelationId(),
      incidentId: input.incidentId ?? null,
      status: input.status ?? "recorded",
      executionTime: input.executionTime ?? null,
      tags: input.tags ?? [],
      payload: input.payload ?? {},
      observations: input.observations ?? null,
      lifecycleStage: input.lifecycleStage ?? lifecycleForEventType(input.eventType),
      origin: input.origin ?? "event_bus",
      recoveryState: input.recoveryState ?? "none",
      knowledgeReference: resolveKnowledgeReference(input.eventType, (input.payload ?? {}) as Readonly<Record<string, unknown>>),
      diagnosisReference: resolveDiagnosisReference(
        input.eventType,
        (input.payload ?? {}) as Readonly<Record<string, unknown>>,
      ),
      patchReference: EMPTY_PREPARED_REFERENCE,
      deployReference: EMPTY_PREPARED_REFERENCE,
    };

    this.store.append(event);

    if (!this.recordingBusEvent) {
      GuardianEventBus.publish("guardian.timeline.recorded", this.id, {
        timelineId: event.timelineId,
        eventType: event.eventType,
      });
    }

    return event;
  }

  list(filter?: EngineeringTimelineFilter): readonly EngineeringTimelineEvent[] {
    const items = this.store.list().filter((e) => matchesFilter(e, filter));
    const limit = filter?.limit ?? items.length;
    return items.slice(0, limit);
  }

  get(timelineId: string): EngineeringTimelineEvent | null {
    return this.store.get(timelineId);
  }

  count(): number {
    return this.store.count();
  }

  listMandatoryEventTypes(): readonly string[] {
    return MANDATORY_TIMELINE_EVENT_TYPES;
  }

  reset(): void {
    for (const unsubscribe of this.unsubscribers) {
      unsubscribe();
    }
    this.unsubscribers = [];
    this.listening = false;
    this.store.clear();
  }

  private ingestBusEvent(event: IGuardianEvent<unknown>): void {
    if (event.type === "guardian.timeline.recorded") return;
    if (this.store.list().some((e) => e.payload.busEventId === event.id)) return;

    this.recordingBusEvent = true;
    try {
      const payload =
        event.payload && typeof event.payload === "object"
          ? (event.payload as Record<string, unknown>)
          : { value: event.payload };

      const incident =
        event.type === "guardian.incident.detected"
          ? (event.payload as GuardianIncident)
          : null;

      this.record({
        eventType: event.type,
        category: categoryForEventType(event.type),
        severity: severityForEventType(event.type),
        source: event.source,
        provider:
          typeof payload.providerId === "string"
            ? payload.providerId
            : incident?.provider ?? null,
        module: incident?.module ?? "guardian",
        workspace: incident?.workspace ?? null,
        tenant: incident?.tenant ?? null,
        company: incident?.company ?? null,
        correlationId: incident?.correlationId,
        incidentId: incident?.incidentId ?? (typeof payload.incidentId === "string" ? payload.incidentId : null),
        tags: ["event-bus", event.type],
        payload: { ...payload, busEventId: event.id },
        observations: `Recorded from Event Bus: ${event.type}`,
        origin: "event_bus",
        lifecycleStage: lifecycleForEventType(event.type),
      });
    } finally {
      this.recordingBusEvent = false;
    }
  }
}

/** Singleton Engineering Timeline — official Guardian record. */
export const EngineeringTimeline: ITimelineService & {
  initialize(): void;
  reset(): void;
  listMandatoryEventTypes(): readonly string[];
} = new TimelineServiceImpl();

export function createTimelineService(): ITimelineService & {
  initialize(): void;
  reset(): void;
  listMandatoryEventTypes(): readonly string[];
} {
  return new TimelineServiceImpl();
}
