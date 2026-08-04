/**
 * Guardian Incident Context Builder (GAI-03).
 * Builds the complete incident context required before any Knowledge Platform query.
 * No AI. No recovery actions.
 */

import { CorrelationEngine } from "../correlation/correlation_engine";
import { GuardianEventBus } from "../events/event_bus";
import { EngineeringHealthService } from "../observability/health_service";
import { EngineeringSessionService } from "../observability/session_service";
import { GuardianRuntime } from "../runtime/guardian_runtime";
import { EngineeringTimeline } from "../timeline/timeline_service";
import type { GuardianCorrelationResult } from "../types/correlation_types";
import type { GuardianIncident } from "../types/incident_types";
import {
  EMPTY_PREPARED_SLOT,
  type GuardianIncidentContext,
} from "../types/incident_context_types";

export const INCIDENT_CONTEXT_BUILDER_ID = "guardian-incident-context-builder" as const;
export const CONTEXT_BUILT_EVENT = "guardian.context.built" as const;

export type IncidentContextBuilderStatus = "inactive" | "ready";

export interface IncidentContextBuildInput {
  readonly incident: GuardianIncident;
  readonly correlation?: GuardianCorrelationResult;
  readonly candidateIncidents?: readonly GuardianIncident[];
}

let contextSeq = 0;

function createContextId(): string {
  contextSeq += 1;
  return `guardian-ctx-${Date.now()}-${contextSeq}`;
}

class IncidentContextBuilderImpl {
  readonly id = INCIDENT_CONTEXT_BUILDER_ID;
  private status: IncidentContextBuilderStatus = "inactive";
  private lastContext: GuardianIncidentContext | null = null;
  private buildCount = 0;

  initialize(): void {
    this.status = "ready";
    CorrelationEngine.initialize();
    EngineeringTimeline.initialize();
  }

  getStatus(): IncidentContextBuilderStatus {
    return this.status;
  }

  isReady(): boolean {
    return this.status === "ready";
  }

  getLastContext(): GuardianIncidentContext | null {
    return this.lastContext;
  }

  getBuildCount(): number {
    return this.buildCount;
  }

  /**
   * Build complete incident context.
   * All Knowledge Platform queries must receive this context first.
   */
  build(input: IncidentContextBuildInput): GuardianIncidentContext {
    if (this.status !== "ready") {
      this.initialize();
    }

    const incident = input.incident;
    const timelineEvents = EngineeringTimeline.list({
      correlationId: incident.correlationId,
      limit: 200,
    });

    const candidateIncidents =
      input.candidateIncidents ?? GuardianRuntime.listIncidents();

    const correlation =
      input.correlation ??
      CorrelationEngine.correlate({
        primaryIncident: incident,
        candidateIncidents,
        timelineEvents,
      });

    const session = EngineeringSessionService.current();
    const health = EngineeringHealthService.getHealth();
    const runtimeState = GuardianRuntime.getState();

    const runtimeSnapshot = {
      runtimeId: GuardianRuntime.id,
      status: GuardianRuntime.getStatus(),
      incidentCount: GuardianRuntime.getIncidentCount(),
      capturedAt: new Date().toISOString(),
    };

    const context: GuardianIncidentContext = {
      contextId: createContextId(),
      incidentId: incident.incidentId,
      correlationId: correlation.correlationId,
      timeline: correlation.groupedTimelineEvents.length
        ? correlation.groupedTimelineEvents
        : timelineEvents,
      timelineEvents: correlation.groupedTimelineEvents.length
        ? correlation.groupedTimelineEvents
        : timelineEvents,
      runtime: runtimeSnapshot,
      workspace: incident.workspace,
      tenant: incident.tenant,
      empresa: incident.company,
      session,
      guardianHealth: health,
      providersInvolved: correlation.providersInvolved,
      modulesInvolved: correlation.modulesInvolved,
      navigationContext: {
        route: null,
        module: incident.module,
        workspace: incident.workspace,
      },
      compositionContext: {
        compositionRoot: null,
        providersBound: correlation.providersInvolved,
      },
      stackTrace: incident.stackTrace,
      runtimeSnapshot,
      incidentHistory: candidateIncidents,
      relatedIncidents: correlation.groupedIncidents.filter(
        (item) => item.incidentId !== incident.incidentId,
      ),
      correlationScore: correlation.correlationScore,
      knowledgeReferences: [],
      severity: incident.severity,
      confidence: incident.confidence,
      tags: [
        "gai03",
        "incident-context",
        incident.category,
        incident.severity,
        ...correlation.modulesInvolved,
      ],
      preparedDiagnosis: EMPTY_PREPARED_SLOT,
      preparedRootCause: EMPTY_PREPARED_SLOT,
      preparedPatch: EMPTY_PREPARED_SLOT,
      preparedDeployment: EMPTY_PREPARED_SLOT,
      primaryIncident: incident,
      correlation,
      builtAt: new Date().toISOString(),
    };

    this.lastContext = context;
    this.buildCount += 1;

    GuardianEventBus.publish(CONTEXT_BUILT_EVENT, this.id, {
      contextId: context.contextId,
      incidentId: context.incidentId,
      correlationId: context.correlationId,
      correlationScore: context.correlationScore,
      timelineEventCount: context.timelineEvents.length,
    });

    // silence unused var for runtime state capture completeness
    void runtimeState;

    return context;
  }

  reset(): void {
    this.status = "inactive";
    this.lastContext = null;
    this.buildCount = 0;
  }
}

export const IncidentContextBuilder = new IncidentContextBuilderImpl();

export function createIncidentContextBuilder(): IncidentContextBuilderImpl {
  return new IncidentContextBuilderImpl();
}
