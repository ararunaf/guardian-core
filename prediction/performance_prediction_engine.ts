/**
 * Guardian Performance Prediction Engine (GAI-06).
 * Predicts degradation, consumption growth, change impact, and hotspots.
 * Inputs: Regression, Change, Root Cause, Evidence Chain, Knowledge Diagnosis.
 * Forbidden: generative AI, auto-optimization, code execution.
 */

import { KnowledgeDiagnosisEngine } from "../diagnosis/knowledge_diagnosis_engine";
import { GuardianEventBus } from "../events/event_bus";
import { PerformanceIntelligenceEngine } from "../performance/performance_intelligence_engine";
import { RegressionIntelligenceEngine } from "../regression/regression_intelligence_engine";
import { EngineeringTimeline } from "../timeline/timeline_service";
import type {
  GuardianPerformanceHotspot,
  GuardianPerformanceMetrics,
  GuardianPerformancePrediction,
  GuardianPredictionScenario,
  PerformancePredictionResult,
} from "../types/performance_types";
import { EMPTY_PERFORMANCE_PREPARED_SLOT } from "../types/performance_types";
import type { GuardianRegressionAnalysis } from "../types/regression_types";
import type { GuardianRootCause } from "../types/root_cause_types";

export const PERFORMANCE_PREDICTION_ENGINE_ID =
  "guardian-performance-prediction-engine" as const;

export const PERFORMANCE_PREDICTION_STARTED_EVENT =
  "guardian.performance.prediction.started" as const;
export const PERFORMANCE_PREDICTION_FINISHED_EVENT =
  "guardian.performance.prediction.finished" as const;

export type PerformancePredictionEngineStatus = "inactive" | "ready";

let predictionSeq = 0;

function nextPredictionId(): string {
  predictionSeq += 1;
  return `guardian-perf-prediction-${Date.now()}-${predictionSeq}`;
}

function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

function unique(values: readonly (string | null | undefined)[]): string[] {
  return [...new Set(values.filter((v): v is string => Boolean(v && v.trim())))];
}

function buildScenarios(
  degradation: number,
  consumption: number,
  changeImpact: number,
  hotspotLikelihood: number,
): GuardianPredictionScenario[] {
  return [
    {
      scenarioId: "pred-baseline",
      label: "Baseline observational",
      degradationProbability: Number(clamp(degradation * 0.7).toFixed(4)),
      consumptionIncrease: Number(clamp(consumption * 0.7).toFixed(4)),
      changeImpact: Number(clamp(changeImpact * 0.7).toFixed(4)),
      hotspotLikelihood: Number(clamp(hotspotLikelihood * 0.7).toFixed(4)),
      evidence: ["baseline_from_current_metrics"],
    },
    {
      scenarioId: "pred-stress",
      label: "Stress under concurrent load",
      degradationProbability: Number(clamp(degradation * 1.15).toFixed(4)),
      consumptionIncrease: Number(clamp(consumption * 1.2).toFixed(4)),
      changeImpact: Number(clamp(changeImpact * 1.1).toFixed(4)),
      hotspotLikelihood: Number(clamp(hotspotLikelihood * 1.15).toFixed(4)),
      evidence: ["stress_projection_deterministic"],
    },
    {
      scenarioId: "pred-change-sensitive",
      label: "Change-sensitive regression path",
      degradationProbability: Number(clamp(degradation * 0.95 + changeImpact * 0.2).toFixed(4)),
      consumptionIncrease: Number(clamp(consumption * 0.9 + changeImpact * 0.15).toFixed(4)),
      changeImpact: Number(clamp(changeImpact).toFixed(4)),
      hotspotLikelihood: Number(clamp(hotspotLikelihood * 0.9 + changeImpact * 0.2).toFixed(4)),
      evidence: ["change_intelligence_signal", "regression_probability"],
    },
  ];
}

class PerformancePredictionEngineImpl {
  readonly id = PERFORMANCE_PREDICTION_ENGINE_ID;
  private status: PerformancePredictionEngineStatus = "inactive";
  private lastResult: PerformancePredictionResult | null = null;
  private analysisCount = 0;

  initialize(): void {
    PerformanceIntelligenceEngine.initialize();
    RegressionIntelligenceEngine.initialize();
    KnowledgeDiagnosisEngine.initialize();
    EngineeringTimeline.initialize();
    this.status = "ready";
  }

  getStatus(): PerformancePredictionEngineStatus {
    return this.status;
  }

  isReady(): boolean {
    return this.status === "ready";
  }

  getLastResult(): PerformancePredictionResult | null {
    return this.lastResult;
  }

  getLastPrediction(): GuardianPerformancePrediction | null {
    return this.lastResult?.prediction ?? null;
  }

  getAnalysisCount(): number {
    return this.analysisCount;
  }

  predictFromMetrics(
    metrics: GuardianPerformanceMetrics,
    regression: GuardianRegressionAnalysis,
    rootCause?: GuardianRootCause | null,
  ): PerformancePredictionResult {
    if (this.status !== "ready") {
      this.initialize();
    }

    if (!metrics?.metricsId) {
      throw new Error("Performance Prediction requires Performance Metrics.");
    }
    if (!regression?.regressionId) {
      throw new Error("Performance Prediction requires Regression Intelligence.");
    }

    const diagnosis = KnowledgeDiagnosisEngine.getLastDiagnosis();
    const rca = rootCause ?? undefined;
    const predictionId = nextPredictionId();

    GuardianEventBus.publish(PERFORMANCE_PREDICTION_STARTED_EVENT, this.id, {
      predictionId,
      metricsId: metrics.metricsId,
      regressionId: regression.regressionId,
    });

    const hotspotPressure =
      metrics.hotspots.reduce((sum, h) => sum + h.score, 0) /
      Math.max(1, metrics.hotspots.length);
    const degradation = clamp(
      metrics.score * 0.45 +
        regression.probability * 0.35 +
        hotspotPressure * 0.2,
    );
    const consumption = clamp(
      metrics.score * 0.4 +
        Math.min(0.35, metrics.bottlenecks.length * 0.05) +
        regression.regressionScore * 0.25,
    );
    const changeImpact = clamp(
      regression.regressionScore * 0.5 +
        (regression.technicalRisk === "critical"
          ? 0.25
          : regression.technicalRisk === "high"
            ? 0.15
            : 0.08) +
        Math.min(0.2, metrics.relatedChanges.length * 0.1),
    );
    const hotspotLikelihood = clamp(hotspotPressure * 0.6 + degradation * 0.4);
    const predictionScore = Number(
      clamp(degradation * 0.4 + consumption * 0.25 + changeImpact * 0.2 + hotspotLikelihood * 0.15).toFixed(
        4,
      ),
    );
    const confidence = Number(
      clamp(
        metrics.confidence * 0.4 +
          regression.confidence * 0.35 +
          (rca?.confidenceScore ?? diagnosis?.confidenceScore ?? 0.5) * 0.25,
      ).toFixed(4),
    );

    const hotspotPredictions: GuardianPerformanceHotspot[] = metrics.hotspots.map((h) => ({
      ...h,
      hotspotId: `pred-${h.hotspotId}`,
      score: Number(clamp(h.score * 0.85 + degradation * 0.15).toFixed(4)),
      evidence: unique([...h.evidence, "predicted_from_metrics", `degradation=${degradation}`]),
    }));

    const scenarios = buildScenarios(degradation, consumption, changeImpact, hotspotLikelihood);
    const evidence = unique([
      ...metrics.evidence,
      ...regression.evidenceChain,
      ...(diagnosis?.possibleCauses.map((c) => c.description) ?? []),
      `degradationProbability=${degradation}`,
      `consumptionIncrease=${consumption}`,
      `changeImpact=${changeImpact}`,
    ]);
    const knowledgeReferences = unique([
      ...metrics.knowledgeReferences,
      ...(diagnosis?.references ?? []),
    ]);

    const prediction: GuardianPerformancePrediction = {
      predictionId,
      metricsId: metrics.metricsId,
      timestamp: new Date().toISOString(),
      score: predictionScore,
      confidence,
      evidence,
      knowledgeReferences,
      relatedIncidents: metrics.relatedIncidents,
      relatedRootCauses: metrics.relatedRootCauses,
      relatedChanges: metrics.relatedChanges,
      relatedRegressionAnalysis: metrics.relatedRegressionAnalysis,
      status: "predicted",
      degradationProbability: Number(degradation.toFixed(4)),
      consumptionIncrease: Number(consumption.toFixed(4)),
      changeImpactScore: Number(changeImpact.toFixed(4)),
      hotspotPredictions,
      scenarios,
      preparedOptimization: EMPTY_PERFORMANCE_PREPARED_SLOT,
      preparedPatch: EMPTY_PERFORMANCE_PREPARED_SLOT,
      preparedTests: EMPTY_PERFORMANCE_PREPARED_SLOT,
      preparedDeployment: EMPTY_PERFORMANCE_PREPARED_SLOT,
      autoOptimization: false,
      codeExecution: false,
      generativeAi: false,
    };

    GuardianEventBus.publish(PERFORMANCE_PREDICTION_FINISHED_EVENT, this.id, {
      predictionId,
      score: predictionScore,
      confidence,
      degradationProbability: prediction.degradationProbability,
    });

    const result: PerformancePredictionResult = {
      prediction,
      metricsId: metrics.metricsId,
      regressionId: regression.regressionId,
    };
    this.lastResult = result;
    this.analysisCount += 1;
    return result;
  }

  predictFromRegression(regression: GuardianRegressionAnalysis): PerformancePredictionResult {
    const metricsResult = PerformanceIntelligenceEngine.analyzeFromRegression(regression);
    return this.predictFromMetrics(metricsResult.metrics, regression);
  }

  reset(): void {
    this.status = "inactive";
    this.lastResult = null;
    this.analysisCount = 0;
    predictionSeq = 0;
  }
}

export const PerformancePredictionEngine = new PerformancePredictionEngineImpl();

export function createPerformancePredictionEngine(): PerformancePredictionEngineImpl {
  return new PerformancePredictionEngineImpl();
}
