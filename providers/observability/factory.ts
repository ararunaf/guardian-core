/**
 * Guardian Observability Provider factory (GAI-02).
 * Provides Timeline, Sessions, Health, Metrics, Audit, Statistics.
 * Product-agnostic. Decoupled from SuperContab.
 */

import type { IObservabilityProvider } from "../../contracts/IObservabilityProvider";
import { EngineeringAuditService } from "../../observability/audit_service";
import { EngineeringHealthService } from "../../observability/health_service";
import { EngineeringSessionService } from "../../observability/session_service";
import { EngineeringStatisticsService } from "../../observability/statistics_service";
import { EngineeringTimeline } from "../../timeline/timeline_service";
import type { GuardianProviderDescriptor } from "../../types/provider_types";
import { GUARDIAN_PROVIDER_VERSION } from "../../types/provider_types";
import { getObservabilityProviderConfiguration } from "./configuration";

export function createObservabilityProvider(): IObservabilityProvider {
  const config = getObservabilityProviderConfiguration();
  EngineeringTimeline.initialize();

  return {
    id: "observability-provider",
    ready: config.enabled,
    name: "Guardian Observability Provider",
    operational: true,
    getTimeline(filter) {
      return EngineeringTimeline.list(filter);
    },
    getSessions() {
      return EngineeringSessionService.list();
    },
    getHealth() {
      return EngineeringHealthService.getHealth();
    },
    getMetrics() {
      const stats = EngineeringStatisticsService.getStatistics();
      return {
        eventCount: stats.totalEvents,
        incidentCount: stats.totalIncidents,
        sessionCount: stats.totalSessions,
        healthScore: stats.healthScore,
        integrityScore: stats.integrityScore,
        collectedAt: new Date().toISOString(),
      };
    },
    getAudit(limit) {
      return EngineeringAuditService.list(limit);
    },
    getStatistics() {
      return EngineeringStatisticsService.getStatistics();
    },
  };
}

export function describeObservabilityProvider(): GuardianProviderDescriptor {
  const config = getObservabilityProviderConfiguration();
  return {
    id: "observability",
    name: "Guardian Observability Provider",
    ready: config.enabled,
    operational: true,
    status: config.enabled ? "ready" : "inactive",
    version: GUARDIAN_PROVIDER_VERSION,
  };
}
