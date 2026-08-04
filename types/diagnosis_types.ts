/**
 * Guardian Diagnosis model types (GAI-03 / GAI-04).
 * Knowledge-assisted diagnosis only.
 * No automatic correction suggestions. No code execution.
 */

import type {
  GuardianEvidenceOrigin,
  GuardianEvidenceRelationship,
  GuardianEvidenceValidationStatus,
} from "./evidence_types";

export type GuardianDiagnosisStatus =
  | "created"
  | "knowledge_queried"
  | "evidence_ready"
  | "complete"
  | "empty_knowledge";

export interface GuardianKnowledgeSource {
  readonly sourceId: string;
  readonly kind: "ukal" | "corporate_rag" | "knowledge_platform";
  readonly accessId: string | null;
  readonly label: string;
  readonly consultedAt: string;
}

export interface GuardianEvidenceItem {
  readonly evidenceId: string;
  readonly order: number;
  readonly source: GuardianKnowledgeSource["kind"];
  readonly statement: string;
  readonly referenceId: string | null;
  readonly weight: number;
  readonly timestamp: string;
  /** GAI-04 Evidence Engine expansions (traceable). */
  readonly origin: GuardianEvidenceOrigin;
  readonly reliability: number;
  readonly relationships: readonly GuardianEvidenceRelationship[];
  readonly references: readonly string[];
  readonly validation: GuardianEvidenceValidationStatus;
}

export interface GuardianEvidenceChain {
  readonly chainId: string;
  readonly diagnosisId: string;
  readonly incidentId: string;
  readonly contextId: string;
  readonly items: readonly GuardianEvidenceItem[];
  readonly generatedAt: string;
  /** GAI-04 total weight across chain. */
  readonly totalWeight: number;
  readonly averageReliability: number;
}

export interface GuardianPossibleCause {
  readonly causeId: string;
  readonly description: string;
  readonly likelihood: number;
  readonly evidenceIds: readonly string[];
}

export interface GuardianRecommendedAction {
  readonly actionId: string;
  readonly description: string;
  /** Investigative / observational only — never patch/deploy/execute. */
  readonly kind: "investigate" | "observe" | "escalate" | "document";
  readonly automatic: false;
}

export interface GuardianDiagnosis {
  readonly diagnosisId: string;
  readonly incidentId: string;
  readonly contextId: string;
  readonly timestamp: string;
  readonly knowledgeSources: readonly GuardianKnowledgeSource[];
  readonly evidenceChain: GuardianEvidenceChain;
  readonly confidenceScore: number;
  readonly possibleCauses: readonly GuardianPossibleCause[];
  readonly affectedComponents: readonly string[];
  readonly recommendedActions: readonly GuardianRecommendedAction[];
  readonly explanation: string;
  readonly references: readonly string[];
  readonly status: GuardianDiagnosisStatus;
  /** Explicitly forbidden capabilities in GAI-03. */
  readonly autoCorrection: false;
  readonly codeExecution: false;
  readonly patchSuggested: false;
}
