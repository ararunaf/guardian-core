/**
 * Guardian AI - IStatisticsService contract (GAI-02).
 * Interface only. Counters and aggregates. No intelligent analytics.
 */

export interface EngineeringStatistics {
  readonly totalEvents: number;
  readonly totalIncidents: number;
  readonly totalSessions: number;
  readonly openSessions: number;
  readonly eventsByCategory: Readonly<Record<string, number>>;
  readonly eventsBySeverity: Readonly<Record<string, number>>;
  readonly providersRegistered: number;
  readonly healthScore: number;
  readonly integrityScore: number;
  readonly generatedAt: string;
}

export interface IStatisticsService {
  readonly id: "statistics-service";
  readonly ready: boolean;
  readonly name: string;
  getStatistics(): EngineeringStatistics;
}
