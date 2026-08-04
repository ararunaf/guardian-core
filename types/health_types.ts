/**
 * Engineering Health model types (GAI-02).
 * Infrastructure status only. No intelligent scoring / AI.
 */

export type EngineeringComponentStatus =
  | "ready"
  | "inactive"
  | "degraded"
  | "failed"
  | "unknown";

export type EngineeringAvailability =
  | "available"
  | "degraded"
  | "unavailable";

export interface EngineeringHealthModel {
  readonly guardianStatus: EngineeringComponentStatus;
  readonly runtimeStatus: EngineeringComponentStatus;
  readonly providersStatus: EngineeringComponentStatus;
  readonly registryStatus: EngineeringComponentStatus;
  readonly adapterStatus: EngineeringComponentStatus;
  readonly timelineStatus: EngineeringComponentStatus;
  readonly dashboardStatus: EngineeringComponentStatus;
  /** Simple ready-count ratio (0-100). No intelligent calculation. */
  readonly healthScore: number;
  /** Simple integrity ratio (0-100). No intelligent calculation. */
  readonly integrityScore: number;
  readonly availability: EngineeringAvailability;
  readonly checkedAt: string;
}

export interface EngineeringIntegritySnapshot {
  readonly timelineReady: boolean;
  readonly healthReady: boolean;
  readonly sessionReady: boolean;
  readonly auditReady: boolean;
  readonly statisticsReady: boolean;
  readonly registryReady: boolean;
  readonly integrityScore: number;
  readonly checkedAt: string;
}
