/**
 * Shared Guardian Provider types (GAI-01).
 * Product-agnostic. No SuperContab specifics.
 */

import type { GuardianProviderId } from "./incident_types";
import type { GuardianStatus } from "./guardian_types";

export type GuardianProviderKind = GuardianProviderId;

export interface GuardianProviderDescriptor {
  readonly id: GuardianProviderKind;
  readonly name: string;
  readonly ready: boolean;
  readonly operational: boolean;
  readonly status: GuardianStatus;
  readonly version: string;
}

export interface GuardianProviderConfiguration {
  readonly enabled: boolean;
  readonly version: string;
  readonly options: Readonly<Record<string, string | number | boolean>>;
}

export const GUARDIAN_PROVIDER_IDS: readonly GuardianProviderKind[] = [
  "incident",
  "knowledge",
  "deployment",
  "observability",
  "performance",
  "security",
  "diagnostics",
  "hypothesis",
  "root-cause",
  "change-intelligence",
  "regression",
  "prediction",
  "capacity",
  "threat",
  "compliance",
  "engineering-memory",
  "engineering-ontology",
] as const;

export const GUARDIAN_PROVIDER_VERSION = "1.0.0" as const;
