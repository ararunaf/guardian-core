/**
 * Guardian Regression Analysis model types (GAI-05).
 * Deterministic regression risk estimation only. No generative AI. No patches.
 */

import type { GuardianPreparedFutureSlot } from "./hypothesis_types";
import { EMPTY_HYPOTHESIS_PREPARED_SLOT } from "./hypothesis_types";
import type { GuardianRiskLevel } from "./root_cause_types";

export type GuardianRegressionStatus =
  | "analyzing"
  | "scored"
  | "published"
  | "inconclusive";

export type GuardianRegressionRiskBand = GuardianRiskLevel;

export interface GuardianRiskMatrixCell {
  readonly technicalRisk: GuardianRegressionRiskBand;
  readonly businessRisk: GuardianRegressionRiskBand;
  readonly probabilityBand: "low" | "medium" | "high" | "critical";
  readonly regressionScore: number;
}

export interface GuardianRiskMatrix {
  readonly matrixId: string;
  readonly changeId: string;
  readonly technicalRisk: GuardianRegressionRiskBand;
  readonly businessRisk: GuardianRegressionRiskBand;
  readonly probability: number;
  readonly regressionScore: number;
  readonly cells: readonly GuardianRiskMatrixCell[];
  readonly generatedAt: string;
}

export interface GuardianImpactMap {
  readonly mapId: string;
  readonly changeId: string;
  readonly components: readonly string[];
  readonly modules: readonly string[];
  readonly providers: readonly string[];
  readonly workspaces: readonly string[];
  readonly tenants: readonly string[];
  readonly criticalAreas: readonly string[];
  readonly dependencies: readonly string[];
}

export interface GuardianRegressionHistoryEntry {
  readonly incidentId: string;
  readonly rootCauseId: string | null;
  readonly category: string;
  readonly recurrence: boolean;
  readonly timestamp: string;
}

export interface GuardianRegressionAnalysis {
  readonly regressionId: string;
  readonly changeId: string;
  readonly contextId: string;
  readonly rootCauseId: string;
  readonly timestamp: string;
  readonly regressionScore: number;
  readonly technicalRisk: GuardianRegressionRiskBand;
  readonly businessRisk: GuardianRegressionRiskBand;
  readonly probability: number;
  readonly confidence: number;
  readonly affectedComponents: readonly string[];
  readonly affectedModules: readonly string[];
  readonly affectedProviders: readonly string[];
  readonly affectedWorkspaces: readonly string[];
  readonly affectedTenants: readonly string[];
  readonly criticalAreas: readonly string[];
  readonly regressionHistory: readonly GuardianRegressionHistoryEntry[];
  readonly similarIncidents: readonly string[];
  readonly evidenceChain: readonly string[];
  readonly recommendedTestScope: readonly string[];
  readonly preparedPatch: GuardianPreparedFutureSlot;
  readonly preparedDeployment: GuardianPreparedFutureSlot;
  readonly riskMatrix: GuardianRiskMatrix;
  readonly impactMap: GuardianImpactMap;
  readonly status: GuardianRegressionStatus;
  readonly autoCorrection: false;
  readonly codeExecution: false;
  readonly patchGenerated: false;
  readonly testsExecuted: false;
  readonly deploymentExecuted: false;
}

export const EMPTY_REGRESSION_PREPARED_SLOT: GuardianPreparedFutureSlot =
  EMPTY_HYPOTHESIS_PREPARED_SLOT;

export interface RegressionIntelligenceResult {
  readonly regression: GuardianRegressionAnalysis;
  readonly changeId: string;
  readonly rootCauseId: string;
}
