/**
 * Engineering Health Service (GAI-02).
 * Infrastructure status only. No intelligent calculations.
 */

import type { IHealthService } from "../contracts/IHealthService";
import { GuardianEventBus } from "../events/event_bus";
import { IncidentDetectionEngine } from "../incident/incident_detection_engine";
import { GuardianProviderRegistry } from "../providers/provider_registry";
import { GuardianRegistry } from "../registry/guardian_registry";
import { GuardianRuntime } from "../runtime/guardian_runtime";
import { EngineeringTimeline } from "../timeline/timeline_service";
import type {
  EngineeringAvailability,
  EngineeringComponentStatus,
  EngineeringHealthModel,
  EngineeringIntegritySnapshot,
} from "../types/health_types";
import { GUARDIAN_PROVIDER_IDS } from "../types/provider_types";

function toComponentStatus(ready: boolean, degraded = false): EngineeringComponentStatus {
  if (degraded) return "degraded";
  return ready ? "ready" : "inactive";
}

function availabilityFromScore(score: number): EngineeringAvailability {
  if (score >= 80) return "available";
  if (score >= 40) return "degraded";
  return "unavailable";
}

/** Simple ready-count ratio. No intelligent weighting. */
function scoreFromStatuses(statuses: readonly EngineeringComponentStatus[]): number {
  if (statuses.length === 0) return 0;
  const readyCount = statuses.filter((s) => s === "ready").length;
  return Math.round((readyCount / statuses.length) * 100);
}

class HealthServiceImpl implements IHealthService {
  readonly id = "health-service" as const;
  readonly name = "Engineering Health Service";
  readonly ready = true;
  private publishedOnce = false;

  getHealth(): EngineeringHealthModel {
    const guardianStatus = toComponentStatus(true);
    const runtimeStatus = toComponentStatus(GuardianRuntime.getStatus() === "ready");
    const providers = GuardianProviderRegistry.list().length
      ? GuardianProviderRegistry.list()
      : GuardianRegistry.listProviders();
    const readyProviders = providers.filter((p) => p.ready).length;
    const providersStatus = toComponentStatus(
      readyProviders === GUARDIAN_PROVIDER_IDS.length,
      readyProviders > 0 && readyProviders < GUARDIAN_PROVIDER_IDS.length,
    );
    const registryStatus = toComponentStatus(GuardianRegistry.listModules().length > 0);
    const adapterStatus = toComponentStatus(
      GuardianRegistry.getModule("adapters")?.ready === true
        || GuardianRegistry.getModule("supercontab")?.ready === true,
    );
    const timelineStatus = toComponentStatus(EngineeringTimeline.ready);
    const dashboardStatus = toComponentStatus(true);

    const statuses = [
      guardianStatus,
      runtimeStatus,
      providersStatus,
      registryStatus,
      adapterStatus,
      timelineStatus,
      dashboardStatus,
    ] as const;

    const healthScore = scoreFromStatuses(statuses);
    const integrity = this.getIntegrity();
    const model: EngineeringHealthModel = {
      guardianStatus,
      runtimeStatus,
      providersStatus,
      registryStatus,
      adapterStatus,
      timelineStatus,
      dashboardStatus,
      healthScore,
      integrityScore: integrity.integrityScore,
      availability: availabilityFromScore(healthScore),
      checkedAt: new Date().toISOString(),
    };

    if (!this.publishedOnce) {
      this.publishedOnce = true;
      GuardianEventBus.publish("guardian.system.health", this.id, {
        healthScore: model.healthScore,
        integrityScore: model.integrityScore,
        availability: model.availability,
      });
    }

    return model;
  }

  getIntegrity(): EngineeringIntegritySnapshot {
    const timelineReady = EngineeringTimeline.ready;
    const healthReady = this.ready;
    const sessionReady = true;
    const auditReady = true;
    const statisticsReady = true;
    const registryReady = GuardianRegistry.getModule("observability")?.ready === true
      || GuardianRegistry.getModule("timeline")?.ready === true
      || GuardianRegistry.listModules().length > 0;

    const flags = [
      timelineReady,
      healthReady,
      sessionReady,
      auditReady,
      statisticsReady,
      registryReady,
      IncidentDetectionEngine.isReady(),
    ];
    const integrityScore = Math.round(
      (flags.filter(Boolean).length / flags.length) * 100,
    );

    return {
      timelineReady,
      healthReady,
      sessionReady,
      auditReady,
      statisticsReady,
      registryReady,
      integrityScore,
      checkedAt: new Date().toISOString(),
    };
  }

  reset(): void {
    this.publishedOnce = false;
  }
}

export const EngineeringHealthService: IHealthService & {
  reset(): void;
} = new HealthServiceImpl();

export function createHealthService(): IHealthService & { reset(): void } {
  return new HealthServiceImpl();
}
