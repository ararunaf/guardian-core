/**
 * Guardian Root Cause Analysis Engine (GAI-04).
 * Analyzes hypotheses, consolidates evidence, determines root cause.
 * Must receive Knowledge Diagnosis — never consults Knowledge Platform directly.
 * Forbidden: patch, auto-heal, tests, deploy, code changes.
 */

import {
  buildEvidenceMatrix,
  expandEvidenceChain,
} from "../diagnosis/evidence_chain";
import { GuardianEventBus } from "../events/event_bus";
import { HypothesisEngine } from "../hypothesis/hypothesis_engine";
import { EngineeringTimeline } from "../timeline/timeline_service";
import type { GuardianDiagnosis } from "../types/diagnosis_types";
import type { GuardianEvidenceMatrix } from "../types/evidence_types";
import type { GuardianHypothesisSet } from "../types/hypothesis_types";
import type {
  GuardianRecoveryComplexity,
  GuardianRecommendedNextStep,
  GuardianRiskLevel,
  GuardianRootCause,
  GuardianRootCauseCategory,
  RootCauseAnalysisResult,
} from "../types/root_cause_types";
import { EMPTY_ROOT_CAUSE_PREPARED_SLOT } from "../types/root_cause_types";
import { IncidentContextBuilder } from "../context/incident_context_builder";

export const ROOT_CAUSE_ENGINE_ID = "guardian-root-cause-engine" as const;

export const ROOT_CAUSE_STARTED_EVENT = "guardian.root_cause.started" as const;
export const ROOT_CAUSE_DETERMINED_EVENT = "guardian.root_cause.determined" as const;
export const EVIDENCE_CONSOLIDATED_EVENT = "guardian.evidence.consolidated" as const;
export const ROOT_CAUSE_PUBLISHED_EVENT = "guardian.root_cause.published" as const;

export type RootCauseEngineStatus = "inactive" | "ready";

let rootCauseSeq = 0;

function nextRootCauseId(): string {
  rootCauseSeq += 1;
  return `guardian-root-cause-${Date.now()}-${rootCauseSeq}`;
}

function mapCategory(category: string): GuardianRootCauseCategory {
  switch (category) {
    case "provider_failure":
      return "provider_defect";
    case "runtime_failure":
      return "runtime_defect";
    case "correlation_cascade":
      return "correlated_cascade";
    case "module_regression":
      return "module_defect";
    case "configuration":
      return "configuration_defect";
    case "knowledge_gap":
      return "insufficient_evidence";
    default:
      return "unknown";
  }
}

function deriveRisk(severity: string, confidence: number): GuardianRiskLevel {
  if (severity === "critical" || confidence >= 0.85) return "critical";
  if (severity === "high" || confidence >= 0.7) return "high";
  if (severity === "medium" || confidence >= 0.45) return "medium";
  if (severity === "low") return "low";
  return "info";
}

function deriveRecovery(confidence: number, evidenceCount: number): GuardianRecoveryComplexity {
  if (evidenceCount === 0 || confidence < 0.3) return "unknown";
  if (confidence >= 0.8 && evidenceCount >= 4) return "low";
  if (confidence >= 0.55) return "moderate";
  if (confidence >= 0.35) return "high";
  return "unknown";
}

function deriveNextStep(
  confidence: number,
  category: GuardianRootCauseCategory,
): GuardianRecommendedNextStep {
  if (category === "insufficient_evidence" || confidence < 0.35) {
    return "investigate_further";
  }
  if (confidence >= 0.75) return "prepare_regression_check";
  if (confidence >= 0.5) return "document";
  return "escalate";
}

class RootCauseAnalysisEngineImpl {
  readonly id = ROOT_CAUSE_ENGINE_ID;
  private status: RootCauseEngineStatus = "inactive";
  private lastResult: RootCauseAnalysisResult | null = null;
  private analysisCount = 0;

  initialize(): void {
    HypothesisEngine.initialize();
    IncidentContextBuilder.initialize();
    EngineeringTimeline.initialize();
    this.status = "ready";
  }

  getStatus(): RootCauseEngineStatus {
    return this.status;
  }

  isReady(): boolean {
    return this.status === "ready";
  }

  getLastResult(): RootCauseAnalysisResult | null {
    return this.lastResult;
  }

  getLastRootCause(): GuardianRootCause | null {
    return this.lastResult?.rootCause ?? null;
  }

  getAnalysisCount(): number {
    return this.analysisCount;
  }

  /**
   * Official RCA entrypoint.
   * Requires Knowledge Diagnosis — never queries Knowledge Platform.
   */
  analyze(diagnosis: GuardianDiagnosis): RootCauseAnalysisResult {
    if (this.status !== "ready") {
      this.initialize();
    }

    if (!diagnosis?.diagnosisId || !diagnosis.evidenceChain) {
      throw new Error(
        "Root Cause Analysis requires a Knowledge Diagnosis. Direct Knowledge Platform access is forbidden.",
      );
    }

    const context = IncidentContextBuilder.getLastContext();

    GuardianEventBus.publish(ROOT_CAUSE_STARTED_EVENT, this.id, {
      diagnosisId: diagnosis.diagnosisId,
      incidentId: diagnosis.incidentId,
      contextId: diagnosis.contextId,
    });

    const hypothesisSet = HypothesisEngine.generateFromDiagnosis(diagnosis, context);
    const expandedChain = expandEvidenceChain(diagnosis.evidenceChain);

    const linkMap = new Map<string, string[]>();
    for (const hypothesis of hypothesisSet.hypotheses) {
      for (const evidenceId of hypothesis.supportingEvidence) {
        const current = linkMap.get(evidenceId) ?? [];
        current.push(hypothesis.hypothesisId);
        linkMap.set(evidenceId, current);
      }
    }

    const evidenceMatrix = buildEvidenceMatrix({
      diagnosisId: diagnosis.diagnosisId,
      incidentId: diagnosis.incidentId,
      chain: expandedChain,
      hypothesisEvidenceLinks: linkMap,
    });

    GuardianEventBus.publish(EVIDENCE_CONSOLIDATED_EVENT, this.id, {
      matrixId: evidenceMatrix.matrixId,
      entryCount: evidenceMatrix.entries.length,
      totalWeight: evidenceMatrix.totalWeight,
    });

    const topId = hypothesisSet.ranking.rankedHypothesisIds[0];
    const top =
      hypothesisSet.hypotheses.find((h) => h.hypothesisId === topId) ??
      hypothesisSet.hypotheses.find((h) => h.status === "selected") ??
      null;

    const rootCauseCategory = top
      ? mapCategory(top.category)
      : ("insufficient_evidence" as const);

    const confidenceScore = top
      ? Number(
          (
            top.confidence * 0.4 +
            top.probability * 0.35 +
            top.evidenceWeight * 0.25
          ).toFixed(4),
        )
      : 0.15;

    const riskLevel = deriveRisk(top?.severity ?? "info", confidenceScore);
    const recoveryComplexity = deriveRecovery(
      confidenceScore,
      expandedChain.items.length,
    );
    const recommendedNextStep = deriveNextStep(confidenceScore, rootCauseCategory);

    const businessImpact = top
      ? `Impacto potencial em workspace/tenant (${top.affectedWorkspace ?? "n/a"} / ${top.affectedTenant ?? "n/a"}) com severidade ${top.severity}.`
      : "Impacto de negocio inconclusivo por falta de hipotese dominante.";

    const technicalImpact = top
      ? `Componentes afetados: ${top.affectedComponents.join(", ") || "n/a"}. Providers: ${top.affectedProviders.join(", ") || "n/a"}.`
      : "Impacto tecnico inconclusivo — evidencias insuficientes.";

    const supportingFacts = [
      `Diagnosis ${diagnosis.diagnosisId} com confianca ${diagnosis.confidenceScore}.`,
      `Evidence Chain ${expandedChain.chainId} com peso total ${expandedChain.totalWeight}.`,
      top
        ? `Hipotese dominante ${top.hypothesisId} (probabilidade ${top.probability}).`
        : "Nenhuma hipotese dominante selecionada.",
      `Correlation/contexto: ${context?.correlationScore ?? "n/a"}.`,
    ];

    const rootCause: GuardianRootCause = {
      rootCauseId: nextRootCauseId(),
      incidentId: diagnosis.incidentId,
      contextId: diagnosis.contextId,
      diagnosisId: diagnosis.diagnosisId,
      hypothesisId: top?.hypothesisId ?? "none",
      timestamp: new Date().toISOString(),
      rootCauseCategory,
      description: top
        ? `Causa raiz determinada a partir da hipotese "${top.title}": ${top.description}`
        : "Causa raiz inconclusiva — hipoteses inconsistentes ou evidencias insuficientes.",
      confidenceScore,
      evidenceChain: expandedChain.items.map((item) => item.evidenceId),
      supportingFacts,
      affectedComponents: top?.affectedComponents ?? diagnosis.affectedComponents,
      affectedProviders: top?.affectedProviders ?? [],
      impactAnalysis: {
        businessImpact,
        technicalImpact,
        riskLevel,
        recoveryComplexity,
        affectedUserFacing: top?.severity === "critical" || top?.severity === "high",
      },
      riskLevel,
      businessImpact,
      technicalImpact,
      recoveryComplexity,
      recommendedNextStep,
      preparedPatch: EMPTY_ROOT_CAUSE_PREPARED_SLOT,
      preparedValidation: EMPTY_ROOT_CAUSE_PREPARED_SLOT,
      preparedDeployment: EMPTY_ROOT_CAUSE_PREPARED_SLOT,
      status: top && confidenceScore >= 0.35 ? "determined" : "inconclusive",
      autoCorrection: false,
      codeExecution: false,
      patchGenerated: false,
      testsExecuted: false,
      deploymentExecuted: false,
    };

    GuardianEventBus.publish(ROOT_CAUSE_DETERMINED_EVENT, this.id, {
      rootCauseId: rootCause.rootCauseId,
      hypothesisId: rootCause.hypothesisId,
      confidenceScore: rootCause.confidenceScore,
      status: rootCause.status,
    });

    const published: GuardianRootCause = {
      ...rootCause,
      status: rootCause.status === "inconclusive" ? "inconclusive" : "published",
    };

    GuardianEventBus.publish(ROOT_CAUSE_PUBLISHED_EVENT, this.id, {
      rootCauseId: published.rootCauseId,
      status: published.status,
      riskLevel: published.riskLevel,
    });

    const result: RootCauseAnalysisResult = {
      rootCause: published,
      hypothesisSet,
      evidenceMatrix,
    };

    this.lastResult = result;
    this.analysisCount += 1;
    return result;
  }

  reset(): void {
    this.status = "inactive";
    this.lastResult = null;
    this.analysisCount = 0;
    rootCauseSeq = 0;
  }
}

export const RootCauseAnalysisEngine = new RootCauseAnalysisEngineImpl();

export function createRootCauseAnalysisEngine(): RootCauseAnalysisEngineImpl {
  return new RootCauseAnalysisEngineImpl();
}
