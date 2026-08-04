/**
 * Guardian AI - IHealthService contract (GAI-02).
 * Interface only. Infrastructure health surface.
 */

import type {
  EngineeringHealthModel,
  EngineeringIntegritySnapshot,
} from "../types/health_types";

export interface IHealthService {
  readonly id: "health-service";
  readonly ready: boolean;
  readonly name: string;
  getHealth(): EngineeringHealthModel;
  getIntegrity(): EngineeringIntegritySnapshot;
}
