/**
 * Incident Provider types (GAI-01).
 * Product-agnostic detection types.
 */

import type {
  GuardianIncidentCategory,
  GuardianIncidentSeverity,
} from "../../types/incident_types";

export type IncidentProviderState = "ready" | "inactive";

export interface IncidentProviderMeta {
  readonly kind: "incident";
  readonly contractId: "incident-provider";
}

export interface IncidentSeverityMap {
  readonly [key: string]: GuardianIncidentSeverity;
}

export const DEFAULT_CATEGORY_SEVERITY: Readonly<
  Record<GuardianIncidentCategory, GuardianIncidentSeverity>
> = {
  react_error: "high",
  runtime_error: "high",
  unhandled_exception: "critical",
  promise_rejection: "high",
  network_error: "medium",
  http_error: "medium",
  supabase_error: "high",
  ukal_error: "high",
  corporate_rag_error: "high",
  navigation_error: "medium",
  composition_error: "critical",
  provider_error: "high",
  context_error: "medium",
};