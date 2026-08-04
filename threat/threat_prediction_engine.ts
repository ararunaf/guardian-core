/**
 * Guardian Threat Prediction Engine (GAI-07).
 * Predicts isolation breach, privilege escalation, data exposure, change security impact.
 * Inputs: Change, Regression, Performance Prediction, Root Cause, Evidence Chain, Knowledge Diagnosis.
 * No execution. No generative AI.
 */

import { KnowledgeDiagnosisEngine } from "../diagnosis/knowledge_diagnosis_engine";
import { GuardianEventBus } from "../events/event_bus";
import { PerformancePredictionEngine } from "../prediction/performance_prediction_engine";
import { RegressionIntelligenceEngine } from "../regression/regression_intelligence_engine";
import { SecurityIntelligenceEngine } from "../security/security_intelligence_engine";
import { EngineeringTimeline } from "../timeline/timeline_service";
import type {
  GuardianSecurityAssessment,
  GuardianThreatPrediction,
  GuardianThreatScenario,
  ThreatPredictionResult,
} from "../types/security_types";
import { EMPTY_SECURITY_PREPARED_SLOT } from "../types/security_types";
import type { GuardianRegressionAnalysis } from "../types/regression_types";
import type { GuardianRootCause } from "../types/root_cause_types";
import type { GuardianSecuritySeverity } from "../types/security_types";

export const THREAT_PREDICTION_ENGINE_ID =
  "guardian-threat-prediction-engine" as const;

export const THREAT_PREDICTION_STARTED_EVENT =
  "guardian.threat.prediction.started" as const;
export const THREAT_PREDICTION_FINISHED_EVENT =
  "guardian.threat.prediction.finished" as const;

export type ThreatPredictionEngineStatus = "inactive" | "ready";

let predictionSeq = 0;

function nextPredictionId(): string {
  predictionSeq += 1;
  return `guardian-threat-prediction-${Date.now()}-${predictionSeq}`;
}

function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

function unique(values: readonly (string | null | undefined)[]): string[] {
  return [...new Set(values.filter((v): v is string => Boolean(v && v.trim())))];
}

function severityFromScore(score: number): GuardianSecuritySeverity {
  if (score >= 0.85) return "critical";
  if (score >= 0.7) return "high";
  if (score >= 0.5) return "medium";
  if (score >= 0.3) return "low";
  return "info";
}

function buildScenarios(
  threatScore: number,
  probability: number,
  confidence: number,
  isolation: number,
  privilege: number,
  exposure: number,
  changeImpact: number,
): GuardianThreatScenario[] {
  return [
    {
      scenarioId: "threat-baseline",
      label: "Baseline threat projection",
      threatScore: Number(clamp(threatScore * 0.9).toFixed(4)),
      probability: Number(clamp(probability * 0.9).toFixed(4)),
      confidence: Number(clamp(confidence).toFixed(4)),
      evidence: ["baseline_from_security_assessment"],
    },
    {
      scenarioId: "threat-isolation-breach",
      label: "Tenant isolation breach path",
      threatScore: Number(clamp(isolation * 1.05).toFixed(4)),
      probability: Number(clamp(isolation).toFixed(4)),
      confidence: Number(clamp(confidence * 0.95).toFixed(4)),
      evidence: ["isolation_breach_prediction", "multi_tenant_signal"],
    },
    {
      scenarioId: "threat-privilege-escalation",
      label: "Privilege escalation path",
      threatScore: Number(clamp(privilege * 1.05).toFixed(4)),
      probability: Number(clamp(privilege).toFixed(4)),
      confidence: Number(clamp(confidence * 0.92).toFixed(4)),
      evidence: ["privilege_escalation_prediction", "authz_signal"],
    },
    {
      scenarioId: "threat-data-exposure",
      label: "Data exposure path",
      threatScore: Number(clamp(exposure * 1.08 + changeImpact * 0.1).toFixed(4)),
      probability: Number(clamp(exposure).toFixed(4)),
      confidence: Number(clamp(confidence * 0.9).toFixed(4)),
      evidence: ["data_exposure_prediction", "change_security_impact"],
    },
  ];
}

class ThreatPredictionEngineImpl {
  readonly id = THREAT_PREDICTION_ENGINE_ID;
  private status: ThreatPredictionEngineStatus = "inactive";
  private lastResult: ThreatPredictionResult | null = null;
  private analysisCount = 0;

  initialize(): void {
    SecurityIntelligenceEngine.initialize();
    RegressionIntelligenceEngine.initialize();
    PerformancePredictionEngine.initialize();
    KnowledgeDiagnosisEngine.initialize();
    EngineeringTimeline.initialize();
    this.status = "ready";
  }

  getStatus(): ThreatPredictionEngineStatus {
    return this.status;
  }

  isReady(): boolean {
    return this.status === "ready";
  }

  getLastResult(): ThreatPredictionResult | null {
    return this.lastResult;
  }

  getLastPrediction(): GuardianThreatPrediction | null {
    return this.lastResult?.prediction ?? null;
  }

  getAnalysisCount(): number {
    return this.analysisCount;
  }

  predictFromAssessment(
    assessment: GuardianSecurityAssessment,
    regression: GuardianRegressionAnalysis,
    rootCause?: GuardianRootCause | null,
  ): ThreatPredictionResult {
    if (this.status !== "ready") {
      this.initialize();
    }

    if (!assessment?.assessmentId) {
      throw new Error("Threat Prediction requires Security Assessment.");
    }
    if (!regression?.regressionId) {
      throw new Error("Threat Prediction requires Regression Intelligence.");
    }

    const diagnosis = KnowledgeDiagnosisEngine.getLastDiagnosis();
    const performancePrediction = PerformancePredictionEngine.getLastPrediction();
    if (!performancePrediction?.predictionId) {
      throw new Error("Threat Prediction requires Performance Prediction.");
    }
    if (!diagnosis?.diagnosisId) {
      throw new Error("Threat Prediction requires Knowledge Diagnosis.");
    }

    const rca = rootCause ?? undefined;
    const predictionId = nextPredictionId();

    GuardianEventBus.publish(THREAT_PREDICTION_STARTED_EVENT, this.id, {
      predictionId,
      assessmentId: assessment.assessmentId,
      regressionId: regression.regressionId,
    });

    const isolationBreachProbability = clamp(
      assessment.tenantIsolationRisk * 0.55 +
        assessment.rlsRisk * 0.3 +
        regression.probability * 0.15,
    );
    const privilegeEscalationProbability = clamp(
      assessment.authorizationRisk * 0.5 +
        assessment.authenticationRisk * 0.3 +
        (regression.technicalRisk === "critical" ? 0.2 : 0.08),
    );
    const dataExposureProbability = clamp(
      assessment.secretsRisk * 0.35 +
        assessment.apiRisk * 0.3 +
        assessment.providerRisk * 0.2 +
        performancePrediction.degradationProbability * 0.15,
    );
    const changeSecurityImpact = clamp(
      regression.regressionScore * 0.45 +
        assessment.providerRisk * 0.25 +
        Math.min(0.2, assessment.relatedChanges.length * 0.1) +
        (regression.technicalRisk === "critical"
          ? 0.2
          : regression.technicalRisk === "high"
            ? 0.12
            : 0.04),
    );

    const threatScore = Number(
      clamp(
        isolationBreachProbability * 0.28 +
          privilegeEscalationProbability * 0.28 +
          dataExposureProbability * 0.24 +
          changeSecurityImpact * 0.2,
      ).toFixed(4),
    );
    const probability = Number(
      clamp(
        threatScore * 0.55 +
          regression.probability * 0.25 +
          performancePrediction.degradationProbability * 0.2,
      ).toFixed(4),
    );
    const confidence = Number(
      clamp(
        assessment.confidence * 0.35 +
          regression.confidence * 0.25 +
          performancePrediction.confidence * 0.2 +
          (rca?.confidenceScore ?? diagnosis.confidenceScore) * 0.2,
      ).toFixed(4),
    );

    const scenarios = buildScenarios(
      threatScore,
      probability,
      confidence,
      isolationBreachProbability,
      privilegeEscalationProbability,
      dataExposureProbability,
      changeSecurityImpact,
    );

    const evidenceChain = unique([
      ...assessment.evidenceChain,
      ...regression.evidenceChain,
      ...(diagnosis.possibleCauses?.map((c) => c.description) ?? []),
      `threat_score=${threatScore}`,
      `probability=${probability}`,
      `isolation_breach=${isolationBreachProbability}`,
      `privilege_escalation=${privilegeEscalationProbability}`,
      `data_exposure=${dataExposureProbability}`,
      `change_security_impact=${changeSecurityImpact}`,
      `performance_prediction=${performancePrediction.predictionId}`,
      `knowledge_diagnosis=${diagnosis.diagnosisId}`,
    ]);

    const prediction: GuardianThreatPrediction = {
      predictionId,
      assessmentId: assessment.assessmentId,
      timestamp: new Date().toISOString(),
      confidence,
      evidenceChain,
      knowledgeReferences: unique([
        ...assessment.knowledgeReferences,
        ...(diagnosis.references ?? []),
      ]),
      relatedIncidents: assessment.relatedIncidents,
      relatedRootCauses: assessment.relatedRootCauses,
      relatedChanges: assessment.relatedChanges,
      relatedRegression: assessment.relatedRegression,
      relatedPerformance: unique([
        ...assessment.relatedPerformance,
        performancePrediction.predictionId,
      ]),
      severity: severityFromScore(threatScore),
      status: "threat_predicted",
      threatScore,
      probability,
      isolationBreachProbability: Number(isolationBreachProbability.toFixed(4)),
      privilegeEscalationProbability: Number(privilegeEscalationProbability.toFixed(4)),
      dataExposureProbability: Number(dataExposureProbability.toFixed(4)),
      changeSecurityImpact: Number(changeSecurityImpact.toFixed(4)),
      scenarios,
      preparedPatch: EMPTY_SECURITY_PREPARED_SLOT,
      preparedTests: EMPTY_SECURITY_PREPARED_SLOT,
      preparedDeployment: EMPTY_SECURITY_PREPARED_SLOT,
      autoRemediation: false,
      codeExecution: false,
      generativeAi: false,
      execution: false,
    };

    GuardianEventBus.publish(THREAT_PREDICTION_FINISHED_EVENT, this.id, {
      predictionId,
      threatScore,
      probability,
      confidence,
    });

    const result: ThreatPredictionResult = {
      prediction,
      assessmentId: assessment.assessmentId,
      regressionId: regression.regressionId,
    };
    this.lastResult = result;
    this.analysisCount += 1;
    return result;
  }

  predictFromRegression(regression: GuardianRegressionAnalysis): ThreatPredictionResult {
    const securityResult = SecurityIntelligenceEngine.analyzeFromRegression(regression);
    return this.predictFromAssessment(securityResult.assessment, regression);
  }

  reset(): void {
    this.status = "inactive";
    this.lastResult = null;
    this.analysisCount = 0;
    predictionSeq = 0;
  }
}

export const ThreatPredictionEngine = new ThreatPredictionEngineImpl();

export function createThreatPredictionEngine(): ThreatPredictionEngineImpl {
  return new ThreatPredictionEngineImpl();
}
