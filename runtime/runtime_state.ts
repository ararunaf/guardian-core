/**
 * Guardian Runtime state (GAI-01).
 * Records incidents without processing, AI, or diagnosis.
 */

import type { GuardianIncident } from "../types/incident_types";
import type { GuardianStatus } from "../types";

export interface GuardianRuntimeRecentEvent {
  readonly eventId: string;
  readonly type: string;
  readonly timestamp: string;
  readonly incidentId?: string;
}

export interface GuardianRuntimeState {
  status: GuardianStatus;
  initialized: boolean;
  startedAt: string | null;
  incidents: GuardianIncident[];
  recentEvents: GuardianRuntimeRecentEvent[];
  incidentEngineReady: boolean;
}

export function createInitialRuntimeState(): GuardianRuntimeState {
  return {
    status: "inactive",
    initialized: false,
    startedAt: null,
    incidents: [],
    recentEvents: [],
    incidentEngineReady: false,
  };
}