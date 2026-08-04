/**
 * Guardian Correlation Engine (GAI-03).
 * Deterministic event correlation only. No AI.
 */

import { GuardianEventBus } from "../events/event_bus";
import type {
  CorrelationEngineInput,
  GuardianCorrelationDependency,
  GuardianCorrelationResult,
} from "../types/correlation_types";
import type { GuardianIncident } from "../types/incident_types";
import type { EngineeringTimelineEvent } from "../types/timeline_types";

export const CORRELATION_ENGINE_ID = "guardian-correlation-engine" as const;
export const CORRELATION_STARTED_EVENT = "guardian.correlation.started" as const;
export const CORRELATION_FINISHED_EVENT = "guardian.correlation.finished" as const;

export type CorrelationEngineStatus = "inactive" | "ready";

const DEFAULT_WINDOW_MS = 15 * 60 * 1000;

function unique(values: readonly string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

function withinWindow(
  aIso: string,
  bIso: string,
  windowMs: number,
): boolean {
  const a = Date.parse(aIso);
  const b = Date.parse(bIso);
  if (Number.isNaN(a) || Number.isNaN(b)) return false;
  return Math.abs(a - b) <= windowMs;
}

function scorePair(primary: GuardianIncident, candidate: GuardianIncident): number {
  let score = 0;
  let factors = 0;

  const bump = (match: boolean, weight: number) => {
    factors += weight;
    if (match) score += weight;
  };

  bump(primary.correlationId === candidate.correlationId, 3);
  bump(primary.category === candidate.category, 2);
  bump(primary.module === candidate.module, 2);
  bump(primary.provider === candidate.provider, 1.5);
  bump(primary.workspace === candidate.workspace && primary.workspace != null, 1.5);
  bump(primary.tenant === candidate.tenant && primary.tenant != null, 1);
  bump(primary.company === candidate.company && primary.company != null, 1);
  bump(primary.origin === candidate.origin, 1);
  bump(primary.severity === candidate.severity, 0.5);

  if (factors === 0) return 0;
  return Math.min(1, score / factors);
}

function buildDependencies(
  primary: GuardianIncident,
  related: readonly GuardianIncident[],
  timeline: readonly EngineeringTimelineEvent[],
): GuardianCorrelationDependency[] {
  const deps: GuardianCorrelationDependency[] = [];

  deps.push({
    from: primary.provider,
    to: primary.module,
    kind: "provider",
  });

  for (const incident of related) {
    deps.push({
      from: primary.incidentId,
      to: incident.incidentId,
      kind: "incident",
    });
    deps.push({
      from: incident.provider,
      to: incident.module,
      kind: "module",
    });
  }

  for (const event of timeline) {
    if (event.provider) {
      deps.push({
        from: event.provider,
        to: event.module,
        kind: "timeline",
      });
    }
  }

  const seen = new Set<string>();
  return deps.filter((dep) => {
    const key = `${dep.kind}:${dep.from}->${dep.to}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

class CorrelationEngineImpl {
  readonly id = CORRELATION_ENGINE_ID;
  private status: CorrelationEngineStatus = "inactive";
  private lastResult: GuardianCorrelationResult | null = null;
  private runCount = 0;

  initialize(): void {
    this.status = "ready";
  }

  getStatus(): CorrelationEngineStatus {
    return this.status;
  }

  isReady(): boolean {
    return this.status === "ready";
  }

  getLastResult(): GuardianCorrelationResult | null {
    return this.lastResult;
  }

  getRunCount(): number {
    return this.runCount;
  }

  /**
   * Correlate related incidents and timeline events using deterministic rules.
   */
  correlate(input: CorrelationEngineInput): GuardianCorrelationResult {
    if (this.status !== "ready") {
      this.initialize();
    }

    const startedAt = new Date().toISOString();
    const windowMs = input.windowMs ?? DEFAULT_WINDOW_MS;
    const primary = input.primaryIncident;

    GuardianEventBus.publish(CORRELATION_STARTED_EVENT, this.id, {
      incidentId: primary.incidentId,
      correlationId: primary.correlationId,
      startedAt,
    });

    const candidates = (input.candidateIncidents ?? []).filter(
      (incident) => incident.incidentId !== primary.incidentId,
    );

    const relatedScored = candidates
      .map((candidate) => ({
        candidate,
        score: scorePair(primary, candidate),
        inWindow: withinWindow(primary.timestamp, candidate.timestamp, windowMs),
      }))
      .filter((entry) => entry.score >= 0.35 || entry.inWindow)
      .sort((a, b) => b.score - a.score);

    const related = relatedScored.map((entry) => entry.candidate);
    const groupedIncidents = [primary, ...related];

    const timelineEvents = (input.timelineEvents ?? []).filter((event) => {
      const sameCorrelation = event.correlationId === primary.correlationId;
      const sameIncident =
        event.incidentId === primary.incidentId ||
        related.some((incident) => incident.incidentId === event.incidentId);
      const sameModule = event.module === primary.module;
      const inWindow = withinWindow(primary.timestamp, event.timestamp, windowMs);
      return sameCorrelation || sameIncident || (sameModule && inWindow);
    });

    const chronologicalSequence = [
      ...groupedIncidents.map((incident) => ({
        id: incident.incidentId,
        timestamp: incident.timestamp,
        kind: "incident" as const,
      })),
      ...timelineEvents.map((event) => ({
        id: event.timelineId,
        timestamp: event.timestamp,
        kind: "timeline" as const,
      })),
    ]
      .sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp))
      .map((item) => `${item.kind}:${item.id}`);

    const pairScores = relatedScored.map((entry) => entry.score);
    const timelineBoost = timelineEvents.length > 0 ? 0.1 : 0;
    const baseScore =
      pairScores.length === 0
        ? timelineEvents.length > 0
          ? 0.45
          : 0.2
        : pairScores.reduce((sum, value) => sum + value, 0) / pairScores.length;
    const correlationScore = Math.min(1, Number((baseScore + timelineBoost).toFixed(4)));

    const finishedAt = new Date().toISOString();
    const result: GuardianCorrelationResult = {
      correlationId: primary.correlationId,
      incidentIds: groupedIncidents.map((incident) => incident.incidentId),
      relatedIncidentIds: related.map((incident) => incident.incidentId),
      timelineEventIds: timelineEvents.map((event) => event.timelineId),
      chronologicalSequence,
      componentsInvolved: unique([
        primary.module,
        ...related.map((incident) => incident.module),
        ...timelineEvents.map((event) => event.module),
      ]),
      providersInvolved: unique([
        primary.provider,
        ...related.map((incident) => incident.provider),
        ...timelineEvents
          .map((event) => event.provider)
          .filter((value): value is string => typeof value === "string"),
      ]),
      modulesInvolved: unique([
        primary.module,
        ...related.map((incident) => incident.module),
        ...timelineEvents.map((event) => event.module),
      ]),
      dependencies: buildDependencies(primary, related, timelineEvents),
      correlationScore,
      status: groupedIncidents.length > 1 || timelineEvents.length > 0 ? "finished" : "empty",
      groupedIncidents,
      groupedTimelineEvents: timelineEvents,
      startedAt,
      finishedAt,
    };

    this.lastResult = result;
    this.runCount += 1;

    GuardianEventBus.publish(CORRELATION_FINISHED_EVENT, this.id, {
      incidentId: primary.incidentId,
      correlationId: result.correlationId,
      correlationScore: result.correlationScore,
      relatedCount: result.relatedIncidentIds.length,
      finishedAt,
    });

    return result;
  }

  reset(): void {
    this.status = "inactive";
    this.lastResult = null;
    this.runCount = 0;
  }
}

export const CorrelationEngine = new CorrelationEngineImpl();

export function createCorrelationEngine(): CorrelationEngineImpl {
  return new CorrelationEngineImpl();
}
