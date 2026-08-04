/**
 * Guardian Capacity Analysis Engine (GAI-06).
 * Estimates capacity, growth, concurrency, scalability, and resource limits.
 * Analysis only — no execution, load tests, or auto-scaling actions.
 */

import { GuardianEventBus } from "../events/event_bus";
import { PerformanceIntelligenceEngine } from "../performance/performance_intelligence_engine";
import { PerformancePredictionEngine } from "../prediction/performance_prediction_engine";
import {
  PERFORMANCE_PUBLISHED_EVENT,
} from "../performance/performance_intelligence_engine";
import { EngineeringTimeline } from "../timeline/timeline_service";
import type {
  CapacityAnalysisResult,
  GuardianCapacityAnalysis,
  GuardianCapacityScenario,
  GuardianPerformanceMetrics,
  GuardianPerformancePrediction,
  GuardianPerformanceReport,
  PerformanceGuardianPipelineResult,
} from "../types/performance_types";
import { EMPTY_PERFORMANCE_PREPARED_SLOT } from "../types/performance_types";
import type { GuardianRegressionAnalysis } from "../types/regression_types";

export const CAPACITY_ANALYSIS_ENGINE_ID = "guardian-capacity-analysis-engine" as const;

export const CAPACITY_ANALYSIS_STARTED_EVENT = "guardian.capacity.analysis.started" as const;
export const CAPACITY_ANALYSIS_FINISHED_EVENT = "guardian.capacity.analysis.finished" as const;

export type CapacityAnalysisEngineStatus = "inactive" | "ready";

let capacitySeq = 0;
let reportSeq = 0;

function nextCapacityId(): string {
  capacitySeq += 1;
  return `guardian-capacity-${Date.now()}-${capacitySeq}`;
}

function nextReportId(): string {
  reportSeq += 1;
  return `guardian-perf-report-${Date.now()}-${reportSeq}`;
}

function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

function unique(values: readonly (string | null | undefined)[]): string[] {
  return [...new Set(values.filter((v): v is string => Boolean(v && v.trim())))];
}

function sampleValue(
  metrics: GuardianPerformanceMetrics,
  kind: string,
): number {
  return metrics.samples.find((s) => s.kind === kind)?.value ?? metrics.score;
}

function buildScenarios(
  concurrentUsers: number,
  databaseImpact: number,
  ukalImpact: number,
  corporateRagImpact: number,
  vectorIndexImpact: number,
  providersImpact: number,
  runtimeImpact: number,
): GuardianCapacityScenario[] {
  const scales = [
    { id: "cap-current", label: "Current estimated capacity", factor: 1 },
    { id: "cap-growth-2x", label: "2x user growth", factor: 2 },
    { id: "cap-growth-5x", label: "5x user growth", factor: 5 },
  ] as const;

  return scales.map((scale) => {
    const users = Math.max(1, Math.round(concurrentUsers * scale.factor));
    const pressure = clamp(0.2 + Math.log10(users + 1) / 4 + (scale.factor - 1) * 0.08);
    return {
      scenarioId: scale.id,
      label: scale.label,
      concurrentUsers: users,
      databaseImpact: Number(clamp(databaseImpact * (0.8 + scale.factor * 0.15)).toFixed(4)),
      ukalImpact: Number(clamp(ukalImpact * (0.8 + scale.factor * 0.12)).toFixed(4)),
      corporateRagImpact: Number(
        clamp(corporateRagImpact * (0.8 + scale.factor * 0.14)).toFixed(4),
      ),
      vectorIndexImpact: Number(
        clamp(vectorIndexImpact * (0.8 + scale.factor * 0.16)).toFixed(4),
      ),
      providersImpact: Number(clamp(providersImpact * (0.8 + scale.factor * 0.13)).toFixed(4)),
      runtimeImpact: Number(clamp(runtimeImpact * (0.8 + scale.factor * 0.15)).toFixed(4)),
      scalable: pressure < 0.85,
      evidence: [
        `users=${users}`,
        `pressure=${pressure.toFixed(4)}`,
        "analysis_only_no_execution",
      ],
    };
  });
}

class CapacityAnalysisEngineImpl {
  readonly id = CAPACITY_ANALYSIS_ENGINE_ID;
  private status: CapacityAnalysisEngineStatus = "inactive";
  private lastResult: CapacityAnalysisResult | null = null;
  private lastReport: GuardianPerformanceReport | null = null;
  private analysisCount = 0;

  initialize(): void {
    PerformanceIntelligenceEngine.initialize();
    PerformancePredictionEngine.initialize();
    EngineeringTimeline.initialize();
    this.status = "ready";
  }

  getStatus(): CapacityAnalysisEngineStatus {
    return this.status;
  }

  isReady(): boolean {
    return this.status === "ready";
  }

  getLastResult(): CapacityAnalysisResult | null {
    return this.lastResult;
  }

  getLastCapacity(): GuardianCapacityAnalysis | null {
    return this.lastResult?.capacity ?? null;
  }

  getLastReport(): GuardianPerformanceReport | null {
    return this.lastReport;
  }

  getAnalysisCount(): number {
    return this.analysisCount;
  }

  analyzeFromPrediction(
    metrics: GuardianPerformanceMetrics,
    prediction: GuardianPerformancePrediction,
  ): CapacityAnalysisResult {
    if (this.status !== "ready") {
      this.initialize();
    }

    if (!metrics?.metricsId) {
      throw new Error("Capacity Analysis requires Performance Metrics.");
    }
    if (!prediction?.predictionId) {
      throw new Error("Capacity Analysis requires Performance Prediction.");
    }

    const capacityId = nextCapacityId();

    GuardianEventBus.publish(CAPACITY_ANALYSIS_STARTED_EVENT, this.id, {
      capacityId,
      metricsId: metrics.metricsId,
      predictionId: prediction.predictionId,
    });

    const databaseImpact = sampleValue(metrics, "database");
    const ukalImpact = sampleValue(metrics, "ukal");
    const corporateRagImpact = sampleValue(metrics, "corporate_rag");
    const vectorIndexImpact = sampleValue(metrics, "vector_index");
    const providersImpact = sampleValue(metrics, "providers");
    const runtimeImpact = sampleValue(metrics, "runtime");

    const headroom = clamp(1 - metrics.score);
    const estimatedConcurrentUsers = Math.max(
      1,
      Math.round(25 + headroom * 475 - prediction.degradationProbability * 80),
    );
    const growthEstimate = Number(clamp(headroom * 0.7 + (1 - prediction.consumptionIncrease) * 0.3).toFixed(4));
    const concurrencyEstimate = Number(
      clamp(headroom * 0.55 + (1 - runtimeImpact) * 0.45).toFixed(4),
    );
    const scalabilityEstimate = Number(
      clamp(
        (1 - databaseImpact) * 0.25 +
          (1 - ukalImpact) * 0.15 +
          (1 - corporateRagImpact) * 0.15 +
          (1 - vectorIndexImpact) * 0.15 +
          (1 - providersImpact) * 0.15 +
          (1 - runtimeImpact) * 0.15,
      ).toFixed(4),
    );
    const limitEstimate = Number(clamp(1 - scalabilityEstimate * 0.8 + prediction.score * 0.2).toFixed(4));
    const capacityScore = Number(
      clamp(
        scalabilityEstimate * 0.45 +
          concurrencyEstimate * 0.25 +
          growthEstimate * 0.15 +
          (1 - limitEstimate) * 0.15,
      ).toFixed(4),
    );
    const confidence = Number(
      clamp(metrics.confidence * 0.45 + prediction.confidence * 0.55).toFixed(4),
    );

    const criticalResources = unique([
      ...metrics.bottlenecks,
      ...prediction.hotspotPredictions
        .filter((h) => h.severity === "critical" || h.severity === "high")
        .map((h) => h.resource),
      databaseImpact >= 0.65 ? "database" : null,
      ukalImpact >= 0.65 ? "ukal" : null,
      corporateRagImpact >= 0.65 ? "corporate_rag" : null,
      vectorIndexImpact >= 0.65 ? "vector_index" : null,
      providersImpact >= 0.65 ? "providers" : null,
      runtimeImpact >= 0.65 ? "runtime" : null,
    ]);

    const scenarios = buildScenarios(
      estimatedConcurrentUsers,
      databaseImpact,
      ukalImpact,
      corporateRagImpact,
      vectorIndexImpact,
      providersImpact,
      runtimeImpact,
    );

    const evidence = unique([
      ...metrics.evidence,
      ...prediction.evidence,
      `estimatedConcurrentUsers=${estimatedConcurrentUsers}`,
      `databaseImpact=${databaseImpact}`,
      `ukalImpact=${ukalImpact}`,
      `corporateRagImpact=${corporateRagImpact}`,
      `vectorIndexImpact=${vectorIndexImpact}`,
      `providersImpact=${providersImpact}`,
      `runtimeImpact=${runtimeImpact}`,
      "capacity_analysis_only_no_execution",
    ]);

    const capacity: GuardianCapacityAnalysis = {
      capacityId,
      metricsId: metrics.metricsId,
      predictionId: prediction.predictionId,
      timestamp: new Date().toISOString(),
      score: capacityScore,
      confidence,
      evidence,
      knowledgeReferences: unique([
        ...metrics.knowledgeReferences,
        ...prediction.knowledgeReferences,
      ]),
      relatedIncidents: metrics.relatedIncidents,
      relatedRootCauses: metrics.relatedRootCauses,
      relatedChanges: metrics.relatedChanges,
      relatedRegressionAnalysis: metrics.relatedRegressionAnalysis,
      status: "capacity_analyzed",
      estimatedConcurrentUsers,
      growthEstimate,
      concurrencyEstimate,
      scalabilityEstimate,
      limitEstimate,
      databaseImpact: Number(databaseImpact.toFixed(4)),
      ukalImpact: Number(ukalImpact.toFixed(4)),
      corporateRagImpact: Number(corporateRagImpact.toFixed(4)),
      vectorIndexImpact: Number(vectorIndexImpact.toFixed(4)),
      providersImpact: Number(providersImpact.toFixed(4)),
      runtimeImpact: Number(runtimeImpact.toFixed(4)),
      criticalResources,
      scenarios,
      preparedOptimization: EMPTY_PERFORMANCE_PREPARED_SLOT,
      preparedPatch: EMPTY_PERFORMANCE_PREPARED_SLOT,
      preparedTests: EMPTY_PERFORMANCE_PREPARED_SLOT,
      preparedDeployment: EMPTY_PERFORMANCE_PREPARED_SLOT,
      autoOptimization: false,
      codeExecution: false,
      generativeAi: false,
      executionPerformed: false,
    };

    GuardianEventBus.publish(CAPACITY_ANALYSIS_FINISHED_EVENT, this.id, {
      capacityId,
      score: capacityScore,
      estimatedConcurrentUsers,
      criticalResourceCount: criticalResources.length,
    });

    const result: CapacityAnalysisResult = {
      capacity,
      metricsId: metrics.metricsId,
      predictionId: prediction.predictionId,
    };
    this.lastResult = result;
    this.analysisCount += 1;
    return result;
  }

  buildReport(
    metrics: GuardianPerformanceMetrics,
    prediction: GuardianPerformancePrediction,
    capacity: GuardianCapacityAnalysis,
  ): GuardianPerformanceReport {
    const reportScore = Number(
      clamp(metrics.score * 0.4 + prediction.score * 0.35 + (1 - capacity.score) * 0.25).toFixed(4),
    );
    const confidence = Number(
      clamp(metrics.confidence * 0.34 + prediction.confidence * 0.33 + capacity.confidence * 0.33).toFixed(
        4,
      ),
    );

    const report: GuardianPerformanceReport = {
      reportId: nextReportId(),
      timestamp: new Date().toISOString(),
      score: reportScore,
      confidence,
      evidence: unique([...metrics.evidence, ...prediction.evidence, ...capacity.evidence]),
      knowledgeReferences: unique([
        ...metrics.knowledgeReferences,
        ...prediction.knowledgeReferences,
        ...capacity.knowledgeReferences,
      ]),
      relatedIncidents: metrics.relatedIncidents,
      relatedRootCauses: metrics.relatedRootCauses,
      relatedChanges: metrics.relatedChanges,
      relatedRegressionAnalysis: metrics.relatedRegressionAnalysis,
      status: "published",
      metrics,
      prediction,
      capacity,
      performanceScore: metrics.score,
      predictionScore: prediction.score,
      capacityScore: capacity.score,
      hotspots: uniqueIds([
        ...metrics.hotspots,
        ...prediction.hotspotPredictions,
      ]),
      criticalResources: capacity.criticalResources,
      preparedOptimization: EMPTY_PERFORMANCE_PREPARED_SLOT,
      preparedPatch: EMPTY_PERFORMANCE_PREPARED_SLOT,
      preparedTests: EMPTY_PERFORMANCE_PREPARED_SLOT,
      preparedDeployment: EMPTY_PERFORMANCE_PREPARED_SLOT,
      autoOptimization: false,
      codeExecution: false,
      generativeAi: false,
    };

    GuardianEventBus.publish(PERFORMANCE_PUBLISHED_EVENT, this.id, {
      reportId: report.reportId,
      metricsId: metrics.metricsId,
      predictionId: prediction.predictionId,
      capacityId: capacity.capacityId,
      performanceScore: report.performanceScore,
      predictionScore: report.predictionScore,
      capacityScore: report.capacityScore,
      status: report.status,
    });

    this.lastReport = report;
    return report;
  }

  analyzePipeline(regression: GuardianRegressionAnalysis): PerformanceGuardianPipelineResult {
    const metricsResult = PerformanceIntelligenceEngine.analyzeFromRegression(regression);
    const predictionResult = PerformancePredictionEngine.predictFromMetrics(
      metricsResult.metrics,
      regression,
    );
    const capacityResult = this.analyzeFromPrediction(
      metricsResult.metrics,
      predictionResult.prediction,
    );
    const report = this.buildReport(
      metricsResult.metrics,
      predictionResult.prediction,
      capacityResult.capacity,
    );
    return {
      metrics: metricsResult.metrics,
      prediction: predictionResult.prediction,
      capacity: capacityResult.capacity,
      report,
    };
  }

  reset(): void {
    this.status = "inactive";
    this.lastResult = null;
    this.lastReport = null;
    this.analysisCount = 0;
    capacitySeq = 0;
    reportSeq = 0;
  }
}

function uniqueIds<T extends { hotspotId: string }>(items: readonly T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of items) {
    if (seen.has(item.hotspotId)) continue;
    seen.add(item.hotspotId);
    out.push(item);
  }
  return out;
}

export const CapacityAnalysisEngine = new CapacityAnalysisEngineImpl();

export function createCapacityAnalysisEngine(): CapacityAnalysisEngineImpl {
  return new CapacityAnalysisEngineImpl();
}
