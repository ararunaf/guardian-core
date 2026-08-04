/**
 * Guardian Evidence Engine (GAI-03 / GAI-04).
 * Deterministic evidence assembly and expansion.
 * Every evidence item is fully traceable.
 */

import type {
  GuardianEvidenceChain,
  GuardianEvidenceItem,
  GuardianKnowledgeSource,
} from "../types/diagnosis_types";
import type {
  GuardianEvidenceMatrix,
  GuardianEvidenceMatrixEntry,
  GuardianEvidenceOrigin,
  GuardianEvidenceRelationship,
  GuardianEvidenceValidationStatus,
} from "../types/evidence_types";

let evidenceSeq = 0;
let chainSeq = 0;
let matrixSeq = 0;

function nextEvidenceId(): string {
  evidenceSeq += 1;
  return `guardian-evidence-${Date.now()}-${evidenceSeq}`;
}

function nextChainId(): string {
  chainSeq += 1;
  return `guardian-evidence-chain-${Date.now()}-${chainSeq}`;
}

function nextMatrixId(): string {
  matrixSeq += 1;
  return `guardian-evidence-matrix-${Date.now()}-${matrixSeq}`;
}

function mapSourceToOrigin(
  source: GuardianKnowledgeSource["kind"],
): GuardianEvidenceOrigin {
  return source;
}

export interface EvidenceSeed {
  readonly statement: string;
  readonly source: GuardianKnowledgeSource["kind"];
  readonly referenceId?: string | null;
  readonly weight?: number;
  readonly origin?: GuardianEvidenceOrigin;
  readonly reliability?: number;
  readonly relationships?: readonly GuardianEvidenceRelationship[];
  readonly references?: readonly string[];
  readonly validation?: GuardianEvidenceValidationStatus;
}

export function createEvidenceChain(input: {
  readonly diagnosisId: string;
  readonly incidentId: string;
  readonly contextId: string;
  readonly seeds: readonly EvidenceSeed[];
}): GuardianEvidenceChain {
  const items: GuardianEvidenceItem[] = input.seeds.map((seed, index) => {
    const weight = seed.weight ?? Math.max(0.1, 1 - index * 0.1);
    const reliability = seed.reliability ?? Math.min(1, weight + 0.1);
    const referenceId = seed.referenceId ?? null;
    return {
      evidenceId: nextEvidenceId(),
      order: index + 1,
      source: seed.source,
      statement: seed.statement,
      referenceId,
      weight,
      timestamp: new Date().toISOString(),
      origin: seed.origin ?? mapSourceToOrigin(seed.source),
      reliability,
      relationships: seed.relationships ?? [],
      references: seed.references ?? (referenceId ? [referenceId] : []),
      validation: seed.validation ?? "unvalidated",
    };
  });

  const totalWeight = Number(
    items.reduce((sum, item) => sum + item.weight, 0).toFixed(4),
  );
  const averageReliability =
    items.length === 0
      ? 0
      : Number(
          (
            items.reduce((sum, item) => sum + item.reliability, 0) / items.length
          ).toFixed(4),
        );

  return {
    chainId: nextChainId(),
    diagnosisId: input.diagnosisId,
    incidentId: input.incidentId,
    contextId: input.contextId,
    items,
    generatedAt: new Date().toISOString(),
    totalWeight,
    averageReliability,
  };
}

/**
 * Expand / re-validate an existing evidence chain (GAI-04 Evidence Engine).
 * Does not consult Knowledge Platform — operates on diagnosis evidence only.
 */
export function expandEvidenceChain(
  chain: GuardianEvidenceChain,
  options: {
    readonly linkedHypothesisIdsByEvidence?: ReadonlyMap<string, readonly string[]>;
  } = {},
): GuardianEvidenceChain {
  const items = chain.items.map((item, index, all) => {
    const relationships: GuardianEvidenceRelationship[] =
      item.relationships.length > 0
        ? [...item.relationships]
        : index > 0
          ? [
              {
                relatedEvidenceId: all[index - 1]!.evidenceId,
                relation: "same_source" as const,
              },
            ]
          : [];

    const validation: GuardianEvidenceValidationStatus =
      item.weight >= 0.6 && item.reliability >= 0.5
        ? "consistent"
        : item.weight < 0.3
          ? "partial"
          : item.validation;

    return {
      ...item,
      relationships,
      validation,
      references:
        item.references.length > 0
          ? item.references
          : item.referenceId
            ? [item.referenceId]
            : [],
    };
  });

  const totalWeight = Number(
    items.reduce((sum, item) => sum + item.weight, 0).toFixed(4),
  );
  const averageReliability =
    items.length === 0
      ? 0
      : Number(
          (
            items.reduce((sum, item) => sum + item.reliability, 0) / items.length
          ).toFixed(4),
        );

  void options;

  return {
    ...chain,
    items,
    totalWeight,
    averageReliability,
    generatedAt: new Date().toISOString(),
  };
}

export function buildEvidenceMatrix(input: {
  readonly diagnosisId: string;
  readonly incidentId: string;
  readonly chain: GuardianEvidenceChain;
  readonly hypothesisEvidenceLinks?: ReadonlyMap<string, readonly string[]>;
}): GuardianEvidenceMatrix {
  const entries: GuardianEvidenceMatrixEntry[] = input.chain.items.map((item) => ({
    evidenceId: item.evidenceId,
    origin: item.origin,
    weight: item.weight,
    reliability: item.reliability,
    linkedHypothesisIds: input.hypothesisEvidenceLinks?.get(item.evidenceId) ?? [],
    validation: item.validation,
  }));

  return {
    matrixId: nextMatrixId(),
    diagnosisId: input.diagnosisId,
    incidentId: input.incidentId,
    entries,
    totalWeight: input.chain.totalWeight,
    averageReliability: input.chain.averageReliability,
    generatedAt: new Date().toISOString(),
  };
}

export function computeEvidenceWeight(evidenceIds: readonly string[], chain: GuardianEvidenceChain): number {
  if (evidenceIds.length === 0) return 0;
  const weights = evidenceIds.map((id) => {
    const item = chain.items.find((e) => e.evidenceId === id);
    return item ? item.weight * item.reliability : 0;
  });
  const sum = weights.reduce((a, b) => a + b, 0);
  return Number(Math.min(1, sum / Math.max(1, evidenceIds.length)).toFixed(4));
}

export function resetEvidenceCounters(): void {
  evidenceSeq = 0;
  chainSeq = 0;
  matrixSeq = 0;
}
