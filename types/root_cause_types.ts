/**
 * Guardian Root Cause model types (GAI-04).
 * Investigative conclusion only. No corrective execution.
 */

import type { GuardianEvidenceMatrix } from "./evidence_types";
import type { GuardianHypothesisSet, GuardianPreparedFutureSlot } from "./hypothesis_types";
import { EMPTY_HYPOTHESIS_PREPARED_SLOT } from "./hypothesis_types";

export type GuardianRootCauseStatus =
  | "analyzing"
  | "determined"
  | "published"
  | "inconclusive";

export type GuardianRootCauseCategory =
  | "provider_defect"
  | "runtime_defect"
  | "correlated_cascade"
  | "module_defect"
  | "configuration_defect"
  | "insufficient_evidence"
  | "unknown";

export type GuardianRiskLevel = "critical" | "high" | "medium" | "low" | "info";

export type GuardianRecoveryComplexity = "trivial" | "low" | "moderate" | "high" | "unknown";

export type GuardianRecommendedNextStep =
  | "observe"
  | "investigate_further"
  | "escalate"
  | "document"
  | "prepare_regression_check";

export interface GuardianImpactAnalysis {
  readonly businessImpact: string;
  readonly technicalImpact: string;
  readonly riskLevel: GuardianRiskLevel;
  readonly recoveryComplexity: GuardianRecoveryComplexity;
  readonly affectedUserFacing: boolean;
}

export interface GuardianRootCause {
  readonly rootCauseId: string;
  readonly incidentId: string;
  readonly contextId: string;
  readonly diagnosisId: string;
  readonly hypothesisId: string;
  readonly timestamp: string;
  readonly rootCauseCategory: GuardianRootCauseCategory;
  readonly description: string;
  readonly confidenceScore: number;
  readonly evidenceChain: readonly string[];
  readonly supportingFacts: readonly string[];
  readonly affectedComponents: readonly string[];
  readonly affectedProviders: readonly string[];
  readonly impactAnalysis: GuardianImpactAnalysis;
  readonly riskLevel: GuardianRiskLevel;
  readonly businessImpact: string;
  readonly technicalImpact: string;
  readonly recoveryComplexity: GuardianRecoveryComplexity;
  readonly recommendedNextStep: GuardianRecommendedNextStep;
  readonly preparedPatch: GuardianPreparedFutureSlot;
  readonly preparedValidation: GuardianPreparedFutureSlot;
  readonly preparedDeployment: GuardianPreparedFutureSlot;
  readonly status: GuardianRootCauseStatus;
  readonly autoCorrection: false;
  readonly codeExecution: false;
  readonly patchGenerated: false;
  readonly testsExecuted: false;
  readonly deploymentExecuted: false;
}

export const EMPTY_ROOT_CAUSE_PREPARED_SLOT: GuardianPreparedFutureSlot =
  EMPTY_HYPOTHESIS_PREPARED_SLOT;

export interface RootCauseAnalysisResult {
  readonly rootCause: GuardianRootCause;
  readonly hypothesisSet: GuardianHypothesisSet;
  readonly evidenceMatrix: GuardianEvidenceMatrix;
}
