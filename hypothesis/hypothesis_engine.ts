/**
 * Guardian Hypothesis Engine (GAI-04).
 * Generates, ranks, consolidates and discards technical hypotheses.
 * Inputs: Timeline, Incident Context, Knowledge Diagnosis, Evidence Chain.
 * No generative AI. No patch / deploy / test execution.
 */

import { KnowledgeDiagnosisEngine } from "../diagnosis/knowledge_diagnosis_engine";
import {
  computeEvidenceWeight,
  expandEvidenceChain,
} from "../diagnosis/evidence_chain";
import { GuardianEventBus } from "../events/event_bus";
import { EngineeringTimeline } from "../timeline/timeline_service";
import type { GuardianDiagnosis } from "../types/diagnosis_types";
import type { GuardianIncidentContext } from "../types/incident_context_types";
import type {
  GuardianHypothesis,
  GuardianHypothesisCategory,
  GuardianHypothesisRanking,
  GuardianHypothesisSet,
} from "../types/hypothesis_types";
import { EMPTY_HYPOTHESIS_PREPARED_SLOT } from "../types/hypothesis_types";
import { IncidentContextBuilder } from "../context/incident_context_builder";

export const HYPOTHESIS_ENGINE_ID = "guardian-hypothesis-engine" as const;

export const HYPOTHESIS_STARTED_EVENT = "guardian.hypothesis.started" as const;
export const HYPOTHESIS_GENERATED_EVENT = "guardian.hypothesis.generated" as const;
export const HYPOTHESIS_RANKED_EVENT = "guardian.hypothesis.ranked" as const;
export const HYPOTHESIS_DISCARDED_EVENT = "guardian.hypothesis.discarded" as const;

export type HypothesisEngineStatus = "inactive" | "ready";

let hypothesisSeq = 0;
let rankingSeq = 0;
let setSeq = 0;

function nextHypothesisId(): string {
  hypothesisSeq += 1;
  return `guardian-hypothesis-${Date.now()}-${hypothesisSeq}`;
}

function nextRankingId(): string {
  rankingSeq += 1;
  return `guardian-hypothesis-ranking-${Date.now()}-${rankingSeq}`;
}

function nextSetId(): string {
  setSeq += 1;
  return `guardian-hypothesis-set-${Date.now()}-${setSeq}`;
}

function clamp01(value: number): number {
  return Number(Math.min(1, Math.max(0, value)).toFixed(4));
}

function categorizeCause(description: string, category: string): GuardianHypothesisCategory {
  const text = `${description} ${category}`.toLowerCase();
  if (text.includes("provider")) return "provider_failure";
  if (text.includes("correlat")) return "correlation_cascade";
  if (text.includes("module") || text.includes("modulo")) return "module_regression";
  if (text.includes("runtime") || text.includes("falha")) return "runtime_failure";
  if (text.includes("knowledge") || text.includes("conhecimento")) return "knowledge_gap";
  if (text.includes("config")) return "configuration";
  return "unknown";
}

function normalizeKey(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .slice(0, 80);
}

function deriveTitle(category: GuardianHypothesisCategory, description: string): string {
  const prefix: Record<GuardianHypothesisCategory, string> = {
    provider_failure: "Falha de Provider",
    runtime_failure: "Falha de Runtime",
    correlation_cascade: "Cascata Correlacionada",
    module_regression: "Regressao de Modulo",
    knowledge_gap: "Lacuna de Conhecimento",
    configuration: "Configuracao",
    unknown: "Hipotese Tecnica",
  };
  return `${prefix[category]}: ${description.slice(0, 72)}`;
}

class HypothesisEngineImpl {
  readonly id = HYPOTHESIS_ENGINE_ID;
  private status: HypothesisEngineStatus = "inactive";
  private lastSet: GuardianHypothesisSet | null = null;
  private hypothesisCount = 0;

  initialize(): void {
    KnowledgeDiagnosisEngine.initialize();
    IncidentContextBuilder.initialize();
    EngineeringTimeline.initialize();
    this.status = "ready";
  }

  getStatus(): HypothesisEngineStatus {
    return this.status;
  }

  isReady(): boolean {
    return this.status === "ready";
  }

  getLastHypothesisSet(): GuardianHypothesisSet | null {
    return this.lastSet;
  }

  getHypothesisCount(): number {
    return this.hypothesisCount;
  }

  /**
   * Official entrypoint: requires a Knowledge Diagnosis.
   * Never consults Knowledge Platform directly.
   */
  generateFromDiagnosis(
    diagnosis: GuardianDiagnosis,
    context?: GuardianIncidentContext | null,
  ): GuardianHypothesisSet {
    if (this.status !== "ready") {
      this.initialize();
    }

    const resolvedContext =
      context ??
      IncidentContextBuilder.getLastContext() ??
      null;

    GuardianEventBus.publish(HYPOTHESIS_STARTED_EVENT, this.id, {
      diagnosisId: diagnosis.diagnosisId,
      incidentId: diagnosis.incidentId,
      contextId: diagnosis.contextId,
    });

    const expandedChain = expandEvidenceChain(diagnosis.evidenceChain);
    const incident = resolvedContext?.primaryIncident;
    const timelineCount = EngineeringTimeline.count();

    const raw: GuardianHypothesis[] = diagnosis.possibleCauses.map((cause) => {
      const evidenceWeight = computeEvidenceWeight(cause.evidenceIds, expandedChain);
      const confidence = clamp01(
        diagnosis.confidenceScore * 0.45 +
          evidenceWeight * 0.35 +
          cause.likelihood * 0.15 +
          Math.min(0.05, timelineCount * 0.002),
      );
      const probability = clamp01(
        cause.likelihood * 0.5 + evidenceWeight * 0.35 + confidence * 0.15,
      );
      const category = categorizeCause(cause.description, incident?.category ?? "");
      const supporting = cause.evidenceIds;
      const contradictory = expandedChain.items
        .filter((item) => !supporting.includes(item.evidenceId) && item.weight < 0.35)
        .map((item) => item.evidenceId)
        .slice(0, 3);

      return {
        hypothesisId: nextHypothesisId(),
        incidentId: diagnosis.incidentId,
        contextId: diagnosis.contextId,
        diagnosisId: diagnosis.diagnosisId,
        timestamp: new Date().toISOString(),
        title: deriveTitle(category, cause.description),
        description: cause.description,
        category,
        probability,
        confidence,
        evidenceWeight,
        supportingEvidence: supporting,
        contradictoryEvidence: contradictory,
        affectedComponents: diagnosis.affectedComponents,
        affectedProviders: resolvedContext?.providersInvolved ?? [
          incident?.provider ?? "diagnostics",
        ],
        affectedWorkspace: incident?.workspace ?? null,
        affectedTenant: incident?.tenant ?? null,
        affectedCompany: incident?.company ?? null,
        severity: incident?.severity ?? "medium",
        status: "generated",
        references: [...diagnosis.references, cause.causeId],
        preparedPatch: EMPTY_HYPOTHESIS_PREPARED_SLOT,
        preparedTests: EMPTY_HYPOTHESIS_PREPARED_SLOT,
        preparedDeployment: EMPTY_HYPOTHESIS_PREPARED_SLOT,
      };
    });

    // Context-based supplemental hypotheses (deterministic, no generative AI).
    if (resolvedContext && resolvedContext.relatedIncidents.length > 0) {
      const evidenceIds = expandedChain.items.map((i) => i.evidenceId);
      const evidenceWeight = computeEvidenceWeight(evidenceIds, expandedChain);
      raw.push({
        hypothesisId: nextHypothesisId(),
        incidentId: diagnosis.incidentId,
        contextId: diagnosis.contextId,
        diagnosisId: diagnosis.diagnosisId,
        timestamp: new Date().toISOString(),
        title: "Cascata de incidentes correlacionados",
        description: `Incidentes correlacionados (${resolvedContext.relatedIncidents.length}) sugerem causa compartilhada.`,
        category: "correlation_cascade",
        probability: clamp01(resolvedContext.correlationScore * 0.7 + evidenceWeight * 0.3),
        confidence: clamp01(resolvedContext.confidence * 0.6 + evidenceWeight * 0.4),
        evidenceWeight,
        supportingEvidence: evidenceIds.slice(0, 4),
        contradictoryEvidence: [],
        affectedComponents: resolvedContext.modulesInvolved,
        affectedProviders: resolvedContext.providersInvolved,
        affectedWorkspace: incident?.workspace ?? null,
        affectedTenant: incident?.tenant ?? null,
        affectedCompany: incident?.company ?? null,
        severity: resolvedContext.severity,
        status: "generated",
        references: [resolvedContext.correlationId, ...diagnosis.references],
        preparedPatch: EMPTY_HYPOTHESIS_PREPARED_SLOT,
        preparedTests: EMPTY_HYPOTHESIS_PREPARED_SLOT,
        preparedDeployment: EMPTY_HYPOTHESIS_PREPARED_SLOT,
      });
    }

    GuardianEventBus.publish(HYPOTHESIS_GENERATED_EVENT, this.id, {
      diagnosisId: diagnosis.diagnosisId,
      count: raw.length,
    });

    const consolidated = this.consolidateEquivalents(raw);
    const { kept, discarded } = this.eliminateInconsistent(consolidated);
    const ranked = this.rankHypotheses(kept);

    for (const discardedHypothesis of discarded) {
      GuardianEventBus.publish(HYPOTHESIS_DISCARDED_EVENT, this.id, {
        hypothesisId: discardedHypothesis.hypothesisId,
        reason: "inconsistent_or_low_evidence",
      });
    }

    const ranking: GuardianHypothesisRanking = {
      rankingId: nextRankingId(),
      diagnosisId: diagnosis.diagnosisId,
      incidentId: diagnosis.incidentId,
      rankedHypothesisIds: ranked.map((h) => h.hypothesisId),
      discardedHypothesisIds: discarded.map((h) => h.hypothesisId),
      generatedAt: new Date().toISOString(),
    };

    GuardianEventBus.publish(HYPOTHESIS_RANKED_EVENT, this.id, {
      rankingId: ranking.rankingId,
      rankedCount: ranking.rankedHypothesisIds.length,
      discardedCount: ranking.discardedHypothesisIds.length,
    });

    const set: GuardianHypothesisSet = {
      setId: nextSetId(),
      diagnosisId: diagnosis.diagnosisId,
      incidentId: diagnosis.incidentId,
      contextId: diagnosis.contextId,
      hypotheses: [...ranked, ...discarded],
      ranking,
      generatedAt: new Date().toISOString(),
    };

    this.lastSet = set;
    this.hypothesisCount += ranked.length;
    return set;
  }

  private consolidateEquivalents(
    hypotheses: readonly GuardianHypothesis[],
  ): GuardianHypothesis[] {
    const byKey = new Map<string, GuardianHypothesis>();
    for (const hypothesis of hypotheses) {
      const key = `${hypothesis.category}:${normalizeKey(hypothesis.description)}`;
      const existing = byKey.get(key);
      if (!existing) {
        byKey.set(key, hypothesis);
        continue;
      }
      const merged: GuardianHypothesis = {
        ...existing,
        probability: clamp01(Math.max(existing.probability, hypothesis.probability)),
        confidence: clamp01(Math.max(existing.confidence, hypothesis.confidence)),
        evidenceWeight: clamp01(
          Math.max(existing.evidenceWeight, hypothesis.evidenceWeight),
        ),
        supportingEvidence: [
          ...new Set([...existing.supportingEvidence, ...hypothesis.supportingEvidence]),
        ],
        contradictoryEvidence: [
          ...new Set([
            ...existing.contradictoryEvidence,
            ...hypothesis.contradictoryEvidence,
          ]),
        ],
        references: [...new Set([...existing.references, ...hypothesis.references])],
        status: "superseded",
      };
      // Keep the stronger as primary; mark weaker conceptually via higher scores.
      byKey.set(key, {
        ...merged,
        status: "generated",
        title: existing.probability >= hypothesis.probability ? existing.title : hypothesis.title,
        description:
          existing.probability >= hypothesis.probability
            ? existing.description
            : hypothesis.description,
      });
    }
    return [...byKey.values()];
  }

  private eliminateInconsistent(hypotheses: readonly GuardianHypothesis[]): {
    kept: GuardianHypothesis[];
    discarded: GuardianHypothesis[];
  } {
    const kept: GuardianHypothesis[] = [];
    const discarded: GuardianHypothesis[] = [];
    for (const hypothesis of hypotheses) {
      const inconsistent =
        hypothesis.evidenceWeight < 0.15 ||
        hypothesis.probability < 0.12 ||
        (hypothesis.contradictoryEvidence.length > hypothesis.supportingEvidence.length &&
          hypothesis.confidence < 0.35);
      if (inconsistent) {
        discarded.push({ ...hypothesis, status: "discarded" });
      } else {
        kept.push(hypothesis);
      }
    }
    return { kept, discarded };
  }

  private rankHypotheses(hypotheses: readonly GuardianHypothesis[]): GuardianHypothesis[] {
    return [...hypotheses]
      .sort((a, b) => {
        const scoreA = a.probability * 0.45 + a.confidence * 0.35 + a.evidenceWeight * 0.2;
        const scoreB = b.probability * 0.45 + b.confidence * 0.35 + b.evidenceWeight * 0.2;
        return scoreB - scoreA;
      })
      .map((hypothesis, index) => ({
        ...hypothesis,
        status: index === 0 ? ("selected" as const) : ("ranked" as const),
      }));
  }

  reset(): void {
    this.status = "inactive";
    this.lastSet = null;
    this.hypothesisCount = 0;
    hypothesisSeq = 0;
    rankingSeq = 0;
    setSeq = 0;
  }
}

export const HypothesisEngine = new HypothesisEngineImpl();

export function createHypothesisEngine(): HypothesisEngineImpl {
  return new HypothesisEngineImpl();
}
