/**
 * Guardian Incident Detection Engine (GAI-01).
 * Detect only. Publish via Event Bus. No recovery actions. No AI.
 */

import type { IIncidentProvider } from "../contracts/IIncidentProvider";
import { GuardianEventBus } from "../events/event_bus";
import { IncidentProviderRegistry } from "../providers/incident/registry";
import type {
  GuardianIncident,
  GuardianIncidentSignal,
} from "../types/incident_types";
import { GUARDIAN_INCIDENT_CATEGORIES } from "../types/incident_types";

export const INCIDENT_ENGINE_ID = "guardian-incident-detection-engine" as const;
export const INCIDENT_DETECTED_EVENT = "guardian.incident.detected" as const;

export type IncidentEngineStatus = "inactive" | "ready";

export interface IncidentDetectionResult {
  readonly incident: GuardianIncident;
  readonly eventId: string;
  readonly published: true;
}

class IncidentDetectionEngineImpl {
  readonly id = INCIDENT_ENGINE_ID;
  private status: IncidentEngineStatus = "inactive";
  private provider: IIncidentProvider | null = null;
  private detectedCount = 0;
  private recentEventIds: string[] = [];

  initialize(provider?: IIncidentProvider): void {
    this.provider = provider ?? IncidentProviderRegistry.ensure();
    this.status = this.provider.ready ? "ready" : "inactive";
  }

  getStatus(): IncidentEngineStatus {
    return this.status;
  }

  isReady(): boolean {
    return this.status === "ready";
  }

  getDetectedCount(): number {
    return this.detectedCount;
  }

  getRecentEventIds(): readonly string[] {
    return this.recentEventIds;
  }

  listCategories() {
    return GUARDIAN_INCIDENT_CATEGORIES;
  }

  /**
   * Detect an incident and publish exclusively through the Event Bus.
   * Does not call Runtime, Dashboard, Knowledge, or any recovery module.
   */
  detect(signal: GuardianIncidentSignal): IncidentDetectionResult {
    if (!this.provider) {
      this.initialize();
    }
    if (!this.provider || !this.provider.ready || this.status !== "ready") {
      throw new Error("Incident Detection Engine is not ready");
    }

    const incident = this.provider.detect(signal);
    const event = GuardianEventBus.publish(
      INCIDENT_DETECTED_EVENT,
      this.id,
      incident,
    );

    this.detectedCount += 1;
    this.recentEventIds = [event.id, ...this.recentEventIds].slice(0, 50);

    return {
      incident,
      eventId: event.id,
      published: true,
    };
  }

  reset(): void {
    this.status = "inactive";
    this.provider = null;
    this.detectedCount = 0;
    this.recentEventIds = [];
  }
}

export const IncidentDetectionEngine = new IncidentDetectionEngineImpl();

export function createIncidentDetectionEngine(): IncidentDetectionEngineImpl {
  return new IncidentDetectionEngineImpl();
}