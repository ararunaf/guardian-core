/**
 * Guardian Correlation model types (GAI-03).
 * Deterministic correlation only. No AI.
 */

import type { GuardianIncident } from "./incident_types";
import type { EngineeringTimelineEvent } from "./timeline_types";

export type CorrelationStatus = "started" | "finished" | "empty";

export interface GuardianCorrelationDependency {
  readonly from: string;
  readonly to: string;
  readonly kind: "provider" | "module" | "incident" | "timeline";
}

export interface GuardianCorrelationResult {
  readonly correlationId: string;
  readonly incidentIds: readonly string[];
  readonly relatedIncidentIds: readonly string[];
  readonly timelineEventIds: readonly string[];
  readonly chronologicalSequence: readonly string[];
  readonly componentsInvolved: readonly string[];
  readonly providersInvolved: readonly string[];
  readonly modulesInvolved: readonly string[];
  readonly dependencies: readonly GuardianCorrelationDependency[];
  readonly correlationScore: number;
  readonly status: CorrelationStatus;
  readonly groupedIncidents: readonly GuardianIncident[];
  readonly groupedTimelineEvents: readonly EngineeringTimelineEvent[];
  readonly startedAt: string;
  readonly finishedAt: string;
}

export interface CorrelationEngineInput {
  readonly primaryIncident: GuardianIncident;
  readonly candidateIncidents?: readonly GuardianIncident[];
  readonly timelineEvents?: readonly EngineeringTimelineEvent[];
  /** Time window in ms for related events (default 15 minutes). */
  readonly windowMs?: number;
}
