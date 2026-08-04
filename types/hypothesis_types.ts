/**
 * Guardian Hypothesis model types (GAI-04).
 * Deterministic technical hypotheses only. No generative AI. No patches.
 */

export type GuardianHypothesisStatus =
  | "generated"
  | "ranked"
  | "discarded"
  | "selected"
  | "superseded";

export type GuardianHypothesisCategory =
  | "provider_failure"
  | "runtime_failure"
  | "correlation_cascade"
  | "module_regression"
  | "knowledge_gap"
  | "configuration"
  | "unknown";

export interface GuardianPreparedFutureSlot {
  readonly prepared: true;
  readonly referenceId: null;
  readonly executed: false;
}

export const EMPTY_HYPOTHESIS_PREPARED_SLOT: GuardianPreparedFutureSlot = {
  prepared: true,
  referenceId: null,
  executed: false,
};

export interface GuardianHypothesis {
  readonly hypothesisId: string;
  readonly incidentId: string;
  readonly contextId: string;
  readonly diagnosisId: string;
  readonly timestamp: string;
  readonly title: string;
  readonly description: string;
  readonly category: GuardianHypothesisCategory;
  readonly probability: number;
  readonly confidence: number;
  readonly evidenceWeight: number;
  readonly supportingEvidence: readonly string[];
  readonly contradictoryEvidence: readonly string[];
  readonly affectedComponents: readonly string[];
  readonly affectedProviders: readonly string[];
  readonly affectedWorkspace: string | null;
  readonly affectedTenant: string | null;
  readonly affectedCompany: string | null;
  readonly severity: "critical" | "high" | "medium" | "low" | "info";
  readonly status: GuardianHypothesisStatus;
  readonly references: readonly string[];
  readonly preparedPatch: GuardianPreparedFutureSlot;
  readonly preparedTests: GuardianPreparedFutureSlot;
  readonly preparedDeployment: GuardianPreparedFutureSlot;
}

export interface GuardianHypothesisRanking {
  readonly rankingId: string;
  readonly diagnosisId: string;
  readonly incidentId: string;
  readonly rankedHypothesisIds: readonly string[];
  readonly discardedHypothesisIds: readonly string[];
  readonly generatedAt: string;
}

export interface GuardianHypothesisSet {
  readonly setId: string;
  readonly diagnosisId: string;
  readonly incidentId: string;
  readonly contextId: string;
  readonly hypotheses: readonly GuardianHypothesis[];
  readonly ranking: GuardianHypothesisRanking;
  readonly generatedAt: string;
}
