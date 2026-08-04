/**
 * Guardian Incident model helpers (GAI-01).
 */

import type { GuardianIncident } from "../types/incident_types";
import { GUARDIAN_INCIDENT_CATEGORIES } from "../types/incident_types";

export type { GuardianIncident };

export function isGuardianIncident(value: unknown): value is GuardianIncident {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<GuardianIncident>;
  return (
    typeof v.incidentId === "string" &&
    typeof v.timestamp === "string" &&
    typeof v.message === "string" &&
    typeof v.category === "string" &&
    v.diagnosis === null &&
    v.provider === "incident"
  );
}

export function listDetectableCategories() {
  return GUARDIAN_INCIDENT_CATEGORIES;
}

export function assertDiagnosisEmpty(incident: GuardianIncident): boolean {
  return incident.diagnosis === null;
}