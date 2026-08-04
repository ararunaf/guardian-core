/**
 * Engineering Statistics Service (GAI-02).
 * Simple counters and aggregates. No intelligent analytics.
 */

import type {
  EngineeringStatistics,
  IStatisticsService,
} from "../contracts/IStatisticsService";
import { GuardianRegistry } from "../registry/guardian_registry";
import { EngineeringTimeline } from "../timeline/timeline_service";
import { EngineeringHealthService } from "./health_service";
import { EngineeringSessionService } from "./session_service";

class StatisticsServiceImpl implements IStatisticsService {
  readonly id = "statistics-service" as const;
  readonly name = "Engineering Statistics Service";
  readonly ready = true;

  getStatistics(): EngineeringStatistics {
    const events = EngineeringTimeline.list();
    const sessions = EngineeringSessionService.list();
    const health = EngineeringHealthService.getHealth();

    const eventsByCategory: Record<string, number> = {};
    const eventsBySeverity: Record<string, number> = {};

    for (const event of events) {
      eventsByCategory[event.category] = (eventsByCategory[event.category] ?? 0) + 1;
      eventsBySeverity[event.severity] = (eventsBySeverity[event.severity] ?? 0) + 1;
    }

    const totalIncidents = events.filter(
      (e) => e.eventType === "guardian.incident.detected" || e.incidentId !== null,
    ).length;

    return {
      totalEvents: events.length,
      totalIncidents,
      totalSessions: sessions.length,
      openSessions: sessions.filter((s) => s.status === "open").length,
      eventsByCategory,
      eventsBySeverity,
      providersRegistered: GuardianRegistry.listReadyProviders().length,
      healthScore: health.healthScore,
      integrityScore: health.integrityScore,
      generatedAt: new Date().toISOString(),
    };
  }
}

export const EngineeringStatisticsService: IStatisticsService =
  new StatisticsServiceImpl();

export function createStatisticsService(): IStatisticsService {
  return new StatisticsServiceImpl();
}
