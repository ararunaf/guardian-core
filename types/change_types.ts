/**
 * Guardian Change Context model types (GAI-05).
 * Deterministic change impact analysis only. No generative AI. No patches.
 */

import type { GuardianPreparedFutureSlot } from "./hypothesis_types";
import { EMPTY_HYPOTHESIS_PREPARED_SLOT } from "./hypothesis_types";

export type GuardianChangeContextStatus =
  | "detected"
  | "context_built"
  | "ready_for_regression"
  | "inconclusive";

export type GuardianChangeRiskIndicator =
  | "provider_surface"
  | "workspace_surface"
  | "cockpit_surface"
  | "route_surface"
  | "context_surface"
  | "knowledge_surface"
  | "module_regression_signal"
  | "high_severity_incident"
  | "correlated_cascade"
  | "multi_tenant_scope";

export interface GuardianChangeRiskIndicators {
  readonly indicators: readonly GuardianChangeRiskIndicator[];
  readonly count: number;
  readonly highRisk: boolean;
}

export interface GuardianChangeContext {
  readonly changeId: string;
  readonly commitHash: string;
  readonly timestamp: string;
  readonly author: string;
  readonly filesChanged: readonly string[];
  readonly components: readonly string[];
  readonly modules: readonly string[];
  readonly providers: readonly string[];
  readonly workspaces: readonly string[];
  readonly cockpits: readonly string[];
  readonly routes: readonly string[];
  readonly contexts: readonly string[];
  readonly knowledgeObjects: readonly string[];
  readonly dependencies: readonly string[];
  readonly tenantScope: readonly string[];
  readonly businessScope: readonly string[];
  readonly technicalScope: readonly string[];
  readonly relatedIncidents: readonly string[];
  readonly relatedRootCauses: readonly string[];
  readonly riskIndicators: GuardianChangeRiskIndicators;
  readonly preparedRegression: GuardianPreparedFutureSlot;
  readonly preparedTests: GuardianPreparedFutureSlot;
  readonly preparedPatch: GuardianPreparedFutureSlot;
  readonly preparedDeployment: GuardianPreparedFutureSlot;
  readonly contextId: string;
  readonly rootCauseId: string;
  readonly incidentId: string;
  readonly diagnosisId: string;
  readonly status: GuardianChangeContextStatus;
}

export const EMPTY_CHANGE_PREPARED_SLOT: GuardianPreparedFutureSlot =
  EMPTY_HYPOTHESIS_PREPARED_SLOT;

export interface ChangeIntelligenceResult {
  readonly changeContext: GuardianChangeContext;
}
