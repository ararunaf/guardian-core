/**
 * Guardian AI - IObservabilityProvider contract (GAI-02).
 * Interface only. Provides Timeline, Sessions, Health, Metrics, Audit, Statistics.
 * Remains product-agnostic and decoupled from SuperContab.
 */

import type { EngineeringAuditEntry } from "./IAuditService";
import type { EngineeringHealthModel } from "../types/health_types";
import type { EngineeringSession } from "../types/session_types";
import type { EngineeringStatistics } from "./IStatisticsService";
import type {
  EngineeringTimelineEvent,
  EngineeringTimelineFilter,
} from "../types/timeline_types";

export interface EngineeringObservabilityMetrics {
  readonly eventCount: number;
  readonly incidentCount: number;
  readonly sessionCount: number;
  readonly healthScore: number;
  readonly integrityScore: number;
  readonly collectedAt: string;
}

export interface IObservabilityProvider {
  readonly id: "observability-provider";
  readonly ready: boolean;
  readonly name: string;
  readonly operational: boolean;
  getTimeline(filter?: EngineeringTimelineFilter): readonly EngineeringTimelineEvent[];
  getSessions(): readonly EngineeringSession[];
  getHealth(): EngineeringHealthModel;
  getMetrics(): EngineeringObservabilityMetrics;
  getAudit(limit?: number): readonly EngineeringAuditEntry[];
  getStatistics(): EngineeringStatistics;
}
