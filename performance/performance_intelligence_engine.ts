/**
 * Guardian Performance Intelligence Engine (GAI-06).
 * Consolidates observational metrics, bottlenecks, indicators, and trends.
 * Consumes Regression Intelligence + Change + Root Cause + Knowledge Diagnosis only.
 * Forbidden: auto-optimization, patch, deploy, code execution, generative AI.
 */

import { ChangeIntelligenceEngine } from "../change/change_intelligence_engine";
import { KnowledgeDiagnosisEngine } from "../diagnosis/knowledge_diagnosis_engine";
import { GuardianEventBus } from "../events/event_bus";
import { RegressionIntelligenceEngine } from "../regression/regression_intelligence_engine";
import { RootCauseAnalysisEngine } from "../root_cause/root_cause_engine";
import { EngineeringTimeline } from "../timeline/timeline_service";
import type { GuardianChangeContext } from "../types/change_types";
import type { GuardianDiagnosis } from "../types/diagnosis_types";
import type {
  GuardianPerformanceHotspot,
  GuardianPerformanceMetricSample,
  GuardianPerformanceMetrics,
  GuardianPerformanceTrendPoint,
  PerformanceIntelligenceResult,
} from "../types/performance_types";
import {
  EMPTY_PERFORMANCE_PREPARED_SLOT,
  PERFORMANCE_METRIC_KINDS,
} from "../types/performance_types";
import type { GuardianRegressionAnalysis } from "../types/regression_types";
import type { GuardianRootCause } from "../types/root_cause_types";

export const PERFORMANCE_INTELLIGENCE_ENGINE_ID =
  "guardian-performance-intelligence-engine" as const;

export const PERFORMANCE_COLLECTION_STARTED_EVENT =
  "guardian.performance.collection.started" as const;
export const PERFORMANCE_METRICS_GENERATED_EVENT =
  "guardian.performance.metrics.generated" as const;
export const PERFORMANCE_PUBLISHED_EVENT = "guardian.performance.published" as const;

export type PerformanceIntelligenceEngineStatus = "inactive" | "ready";

let metricsSeq = 0;

function nextMetricsId(): string {
  metricsSeq += 1;
  return `guardian-perf-metrics-${Date.now()}-${metricsSeq}`;
}

function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

function unique(values: readonly (string | null | undefined)[]): string[] {
  return [...new Set(values.filter((v): v is string => Boolean(v && v.trim())))];
}

function metricBase(
  kind: (typeof PERFORMANCE_METRIC_KINDS)[number],
  value: number,
  unit: string,
  bottleneck: boolean,
  evidence: readonly string[],
): GuardianPerformanceMetricSample {
  const trend =
    value >= 0.75 ? "degrading" : value >= 0.45 ? "stable" : value > 0 ? "improving" : "unknown";
  return {
    kind,
    label: kind.replace(/_/g, " "),
    value: Number(clamp(value).toFixed(4)),
    unit,
    mode: "observational",
    trend,
    bottleneck,
    evidence,
  };
}

function buildSamples(
  regression: GuardianRegressionAnalysis,
  change: GuardianChangeContext,
  rootCause: GuardianRootCause,
  diagnosis: GuardianDiagnosis | null,
): GuardianPerformanceMetricSample[] {
  const reg = regression.regressionScore;
  const techBoost =
    regression.technicalRisk === "critical"
      ? 0.2
      : regression.technicalRisk === "high"
        ? 0.12
        : 0.05;
  const providerPressure = Math.min(0.35, change.providers.length * 0.05);
  const modulePressure = Math.min(0.3, change.modules.length * 0.04);
  const knowledgePressure = Math.min(
    0.25,
    (diagnosis?.knowledgeSources.length ?? 0) * 0.05 + (diagnosis ? 0.1 : 0.05),
  );
  const runtimePressure = clamp(reg * 0.55 + techBoost);
  const dbPressure = clamp(reg * 0.4 + providerPressure * 0.5);
  const ukalPressure = clamp(knowledgePressure + (rootCause.confidenceScore < 0.5 ? 0.15 : 0.05));
  const ragPressure = clamp(knowledgePressure * 0.9 + modulePressure * 0.2);
  const vectorPressure = clamp(ragPressure * 0.85 + 0.08);
  const navPressure = clamp(modulePressure + (change.routes.length ? 0.12 : 0.04));

  const samples: GuardianPerformanceMetricSample[] = [
    metricBase("render_time", clamp(runtimePressure * 0.7), "ms_index", runtimePressure >= 0.7, [
      "derived_from_regression_score",
    ]),
    metricBase("load_time", clamp(runtimePressure * 0.75 + 0.05), "ms_index", runtimePressure >= 0.65, [
      "derived_from_technical_risk",
    ]),
    metricBase("navigation_time", navPressure, "ms_index", navPressure >= 0.6, [
      `routes=${change.routes.length}`,
    ]),
    metricBase("cpu", clamp(runtimePressure * 0.8), "utilization_index", runtimePressure >= 0.7, [
      "observational_runtime_pressure",
    ]),
    metricBase("memory", clamp(runtimePressure * 0.65 + providerPressure * 0.2), "utilization_index", false, [
      "observational_memory_pressure",
    ]),
    metricBase("network", clamp(providerPressure + 0.15), "latency_index", providerPressure >= 0.25, [
      `providers=${change.providers.length}`,
    ]),
    metricBase("database", dbPressure, "load_index", dbPressure >= 0.65, [
      "observational_database_load",
    ]),
    metricBase("supabase", clamp(dbPressure * 0.9), "load_index", dbPressure >= 0.7, [
      "prepared_supabase_observation",
    ]),
    metricBase("ukal", ukalPressure, "latency_index", ukalPressure >= 0.6, [
      "knowledge_path_pressure",
    ]),
    metricBase("corporate_rag", ragPressure, "latency_index", ragPressure >= 0.6, [
      "corporate_rag_observation",
    ]),
    metricBase("knowledge_platform", clamp(ragPressure * 0.95), "latency_index", false, [
      "knowledge_platform_observation",
    ]),
    metricBase("vector_index", vectorPressure, "query_cost_index", vectorPressure >= 0.65, [
      "vector_index_observation",
    ]),
    metricBase("embedding", clamp(vectorPressure * 0.9), "cost_index", false, [
      "embedding_observation",
    ]),
    metricBase("chunking", clamp(vectorPressure * 0.75), "cost_index", false, [
      "chunking_observation",
    ]),
    metricBase("providers", clamp(providerPressure + reg * 0.3), "pressure_index", providerPressure >= 0.2, [
      ...change.providers.map((p) => `provider:${p}`),
    ]),
    metricBase("dashboard", clamp(0.2 + reg * 0.2), "render_index", false, [
      "dashboard_observational",
    ]),
    metricBase("event_bus", clamp(0.15 + regression.evidenceChain.length * 0.02), "throughput_index", false, [
      "event_bus_observational",
    ]),
    metricBase("runtime", runtimePressure, "pressure_index", runtimePressure >= 0.7, [
      "runtime_observational",
    ]),
    metricBase("session", clamp(0.2 + (change.tenantScope.length ? 0.15 : 0.05)), "load_index", false, [
      "session_observational",
    ]),
    metricBase("timeline", clamp(0.18 + regression.regressionHistory.length * 0.03), "volume_index", false, [
      "timeline_observational",
    ]),
    metricBase("correlation", clamp(0.25 + (1 - rootCause.confidenceScore) * 0.3), "cost_index", false, [
      "correlation_layer_observation",
    ]),
    metricBase("root_cause", clamp(rootCause.confidenceScore * 0.4 + techBoost), "analysis_index", false, [
      `rootCauseId=${rootCause.rootCauseId}`,
    ]),
    metricBase("change_intelligence", clamp(0.2 + change.riskIndicators.count * 0.04), "analysis_index", false, [
      `changeId=${change.changeId}`,
    ]),
    metricBase("regression_intelligence", reg, "score_index", reg >= 0.7, [
      `regressionId=${regression.regressionId}`,
    ]),
  ];

  return samples;
}

function buildHotspots(samples: readonly GuardianPerformanceMetricSample[]): GuardianPerformanceHotspot[] {
  return samples
    .filter((s) => s.bottleneck || s.value >= 0.65)
    .map((s, index) => ({
      hotspotId: `hotspot-${s.kind}-${index + 1}`,
      resource: s.kind,
      severity:
        s.value >= 0.85
          ? ("critical" as const)
          : s.value >= 0.75
            ? ("high" as const)
            : s.value >= 0.65
              ? ("medium" as const)
              : ("low" as const),
      score: s.value,
      evidence: s.evidence,
    }));
}

class PerformanceIntelligenceEngineImpl {
  readonly id = PERFORMANCE_INTELLIGENCE_ENGINE_ID;
  private status: PerformanceIntelligenceEngineStatus = "inactive";
  private lastResult: PerformanceIntelligenceResult | null = null;
  private analysisCount = 0;
  private history: GuardianPerformanceTrendPoint[] = [];

  initialize(): void {
    RegressionIntelligenceEngine.initialize();
    ChangeIntelligenceEngine.initialize();
    RootCauseAnalysisEngine.initialize();
    KnowledgeDiagnosisEngine.initialize();
    EngineeringTimeline.initialize();
    this.status = "ready";
  }

  getStatus(): PerformanceIntelligenceEngineStatus {
    return this.status;
  }

  isReady(): boolean {
    return this.status === "ready";
  }

  getLastResult(): PerformanceIntelligenceResult | null {
    return this.lastResult;
  }

  getLastMetrics(): GuardianPerformanceMetrics | null {
    return this.lastResult?.metrics ?? null;
  }

  getAnalysisCount(): number {
    return this.analysisCount;
  }

  analyzeFromRegression(regression: GuardianRegressionAnalysis): PerformanceIntelligenceResult {
    if (this.status !== "ready") {
      this.initialize();
    }

    if (!regression?.regressionId) {
      throw new Error(
        "Performance Intelligence requires Regression Analysis. Bypass is forbidden.",
      );
    }

    const change = ChangeIntelligenceEngine.getLastChangeContext();
    if (!change?.changeId || change.changeId !== regression.changeId) {
      throw new Error(
        "Performance Intelligence requires Change Context from Change Intelligence matching the regression.",
      );
    }

    const rootCause = RootCauseAnalysisEngine.getLastResult()?.rootCause;
    if (!rootCause?.rootCauseId || rootCause.rootCauseId !== regression.rootCauseId) {
      throw new Error("Performance Intelligence requires Root Cause Analysis matching the regression.");
    }

    const diagnosis = KnowledgeDiagnosisEngine.getLastDiagnosis();
    const metricsId = nextMetricsId();

    GuardianEventBus.publish(PERFORMANCE_COLLECTION_STARTED_EVENT, this.id, {
      metricsId,
      regressionId: regression.regressionId,
      changeId: change.changeId,
      rootCauseId: rootCause.rootCauseId,
    });

    const samples = buildSamples(regression, change, rootCause, diagnosis);
    const hotspots = buildHotspots(samples);
    const bottlenecks = unique(samples.filter((s) => s.bottleneck).map((s) => s.kind));
    const avgPressure =
      samples.reduce((sum, s) => sum + s.value, 0) / Math.max(1, samples.length);
    const score = Number(clamp(avgPressure).toFixed(4));
    const confidence = Number(
      clamp(
        regression.confidence * 0.5 +
          rootCause.confidenceScore * 0.3 +
          Math.min(0.2, samples.length * 0.005),
      ).toFixed(4),
    );

    const knowledgeReferences = unique([
      ...(diagnosis?.references ?? []),
      ...(diagnosis?.knowledgeSources.map((s) => s.sourceId) ?? []),
      ...regression.evidenceChain,
    ]);

    const evidence = unique([
      `regressionScore=${regression.regressionScore}`,
      `technicalRisk=${regression.technicalRisk}`,
      `bottlenecks=${bottlenecks.length}`,
      `hotspots=${hotspots.length}`,
      ...samples.filter((s) => s.bottleneck).flatMap((s) => s.evidence),
    ]);

    const indicators = unique([
      ...bottlenecks.map((b) => `bottleneck:${b}`),
      ...hotspots.map((h) => `hotspot:${h.resource}`),
      `performanceScore=${score}`,
      `trend=${score >= 0.7 ? "degrading" : score >= 0.45 ? "stable" : "improving"}`,
    ]);

    const trendPoint: GuardianPerformanceTrendPoint = {
      timestamp: new Date().toISOString(),
      performanceScore: score,
      predictionScore: null,
      capacityScore: null,
    };
    this.history = [...this.history.slice(-19), trendPoint];

    GuardianEventBus.publish(PERFORMANCE_METRICS_GENERATED_EVENT, this.id, {
      metricsId,
      score,
      confidence,
      bottleneckCount: bottlenecks.length,
      hotspotCount: hotspots.length,
    });

    const metrics: GuardianPerformanceMetrics = {
      metricsId,
      timestamp: new Date().toISOString(),
      score,
      confidence,
      evidence,
      knowledgeReferences,
      relatedIncidents: unique([
        ...regression.similarIncidents,
        ...regression.regressionHistory.map((h) => h.incidentId),
      ]),
      relatedRootCauses: [rootCause.rootCauseId],
      relatedChanges: [change.changeId],
      relatedRegressionAnalysis: [regression.regressionId],
      status: "scored",
      samples,
      bottlenecks,
      indicators,
      trends: [...this.history],
      hotspots,
      preparedOptimization: EMPTY_PERFORMANCE_PREPARED_SLOT,
      preparedPatch: EMPTY_PERFORMANCE_PREPARED_SLOT,
      preparedTests: EMPTY_PERFORMANCE_PREPARED_SLOT,
      preparedDeployment: EMPTY_PERFORMANCE_PREPARED_SLOT,
      autoOptimization: false,
      codeExecution: false,
      generativeAi: false,
    };

    const result: PerformanceIntelligenceResult = {
      metrics,
      regressionId: regression.regressionId,
      changeId: change.changeId,
      rootCauseId: rootCause.rootCauseId,
    };
    this.lastResult = result;
    this.analysisCount += 1;
    return result;
  }

  analyzeFromRootCause(rootCause: GuardianRootCause): PerformanceIntelligenceResult {
    const regressionResult = RegressionIntelligenceEngine.analyzeFromRootCause(rootCause);
    return this.analyzeFromRegression(regressionResult.regression);
  }

  reset(): void {
    this.status = "inactive";
    this.lastResult = null;
    this.analysisCount = 0;
    this.history = [];
    metricsSeq = 0;
  }
}

export const PerformanceIntelligenceEngine = new PerformanceIntelligenceEngineImpl();

export function createPerformanceIntelligenceEngine(): PerformanceIntelligenceEngineImpl {
  return new PerformanceIntelligenceEngineImpl();
}
