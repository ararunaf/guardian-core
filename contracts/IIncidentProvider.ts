/**
 * Guardian AI - IIncidentProvider contract (GAI-01).
 * Interface only. Detection capability — no diagnosis or HotFix.
 */

import type {
  GuardianIncident,
  GuardianIncidentSignal,
} from "../types/incident_types";

export interface IIncidentProvider {
  readonly id: "incident-provider";
  readonly ready: boolean;
  readonly name: string;

  /** Detect and materialize a Guardian Incident. No diagnosis. No recovery. */
  detect(signal: GuardianIncidentSignal): GuardianIncident;
}
