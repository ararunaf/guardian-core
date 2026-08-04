/**
 * Guardian Evidence Engine types (GAI-04).
 * Expands Evidence Chain with full traceability metadata.
 */

export type GuardianEvidenceOrigin =
  | "timeline"
  | "incident_context"
  | "knowledge_diagnosis"
  | "correlation"
  | "ukal"
  | "corporate_rag"
  | "knowledge_platform"
  | "diagnostics"
  | "hypothesis";

export type GuardianEvidenceValidationStatus =
  | "unvalidated"
  | "consistent"
  | "contradicted"
  | "partial";

export interface GuardianEvidenceRelationship {
  readonly relatedEvidenceId: string;
  readonly relation: "supports" | "contradicts" | "derived_from" | "same_source";
}

export interface GuardianTraceableEvidence {
  readonly evidenceId: string;
  readonly order: number;
  /** Legacy source kind kept for GAI-03 compatibility. */
  readonly source: "ukal" | "corporate_rag" | "knowledge_platform";
  readonly origin: GuardianEvidenceOrigin;
  readonly statement: string;
  readonly weight: number;
  readonly reliability: number;
  readonly timestamp: string;
  readonly relationships: readonly GuardianEvidenceRelationship[];
  readonly references: readonly string[];
  readonly validation: GuardianEvidenceValidationStatus;
  readonly referenceId: string | null;
}

export interface GuardianEvidenceMatrixEntry {
  readonly evidenceId: string;
  readonly origin: GuardianEvidenceOrigin;
  readonly weight: number;
  readonly reliability: number;
  readonly linkedHypothesisIds: readonly string[];
  readonly validation: GuardianEvidenceValidationStatus;
}

export interface GuardianEvidenceMatrix {
  readonly matrixId: string;
  readonly diagnosisId: string;
  readonly incidentId: string;
  readonly entries: readonly GuardianEvidenceMatrixEntry[];
  readonly totalWeight: number;
  readonly averageReliability: number;
  readonly generatedAt: string;
}
