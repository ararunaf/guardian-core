/**
 * Guardian Performance / Prediction / Capacity model types (GAI-06).
 * Deterministic observational analysis only. No generative AI. No auto-optimization.
 */

import type { GuardianPreparedFutureSlot } from "./hypothesis_types";
import { EMPTY_HYPOTHESIS_PREPARED_SLOT } from "./hypothesis_types";

export type GuardianPerformanceStatus =
  | "collecting"
  | "scored"
  | "predicted"
  | "capacity_analyzed"
  | "published"
  | "inconclusive";

export type GuardianPerformanceMetricKind =
  | "render_time"
  | "load_time"
  | "navigation_time"
  | "cpu"
  | "memory"
  | "network"
  | "database"
  | "supabase"
  | "ukal"
  | "corporate_rag"
  | "knowledge_platform"
  | "vector_index"
  | "embedding"
  | "chunking"
  | "providers"
  | "dashboard"
  | "event_bus"
  | "runtime"
  | "session"
  | "timeline"
  | "correlation"
  | "root_cause"
  | "change_intelligence"
  | "regression_intelligence";

export type GuardianPerformanceMetricMode = "observational" | "prepared" | "mock";

export type GuardianPerformanceTrend = "improving" | "stable" | "degrading" | "unknown";

export interface GuardianPerformanceMetricSample {
  readonly kind: GuardianPerformanceMetricKind;
  readonly label: string;
  readonly value: number;
  readonly unit: string;
  readonly mode: GuardianPerformanceMetricMode;
  readonly trend: GuardianPerformanceTrend;
  readonly bottleneck: boolean;
  readonly evidence: readonly string[];
}

export interface GuardianPerformanceHotspot {
  readonly hotspotId: string;
  readonly resource: string;
  readonly severity: "critical" | "high" | "medium" | "low" | "info";
  readonly score: number;
  readonly evidence: readonly string[];
}

export interface GuardianPerformanceTrendPoint {
  readonly timestamp: string;
  readonly performanceScore: number;
  readonly predictionScore: number | null;
  readonly capacityScore: number | null;
}

export interface GuardianCapacityScenario {
  readonly scenarioId: string;
  readonly label: string;
  readonly concurrentUsers: number;
  readonly databaseImpact: number;
  readonly ukalImpact: number;
  readonly corporateRagImpact: number;
  readonly vectorIndexImpact: number;
  readonly providersImpact: number;
  readonly runtimeImpact: number;
  readonly scalable: boolean;
  readonly evidence: readonly string[];
}

export interface GuardianPredictionScenario {
  readonly scenarioId: string;
  readonly label: string;
  readonly degradationProbability: number;
  readonly consumptionIncrease: number;
  readonly changeImpact: number;
  readonly hotspotLikelihood: number;
  readonly evidence: readonly string[];
}

export interface GuardianPerformanceMetrics {
  readonly metricsId: string;
  readonly timestamp: string;
  readonly score: number;
  readonly confidence: number;
  readonly evidence: readonly string[];
  readonly knowledgeReferences: readonly string[];
  readonly relatedIncidents: readonly string[];
  readonly relatedRootCauses: readonly string[];
  readonly relatedChanges: readonly string[];
  readonly relatedRegressionAnalysis: readonly string[];
  readonly status: GuardianPerformanceStatus;
  readonly samples: readonly GuardianPerformanceMetricSample[];
  readonly bottlenecks: readonly string[];
  readonly indicators: readonly string[];
  readonly trends: readonly GuardianPerformanceTrendPoint[];
  readonly hotspots: readonly GuardianPerformanceHotspot[];
  readonly preparedOptimization: GuardianPreparedFutureSlot;
  readonly preparedPatch: GuardianPreparedFutureSlot;
  readonly preparedTests: GuardianPreparedFutureSlot;
  readonly preparedDeployment: GuardianPreparedFutureSlot;
  readonly autoOptimization: false;
  readonly codeExecution: false;
  readonly generativeAi: false;
}

export interface GuardianPerformancePrediction {
  readonly predictionId: string;
  readonly metricsId: string;
  readonly timestamp: string;
  readonly score: number;
  readonly confidence: number;
  readonly evidence: readonly string[];
  readonly knowledgeReferences: readonly string[];
  readonly relatedIncidents: readonly string[];
  readonly relatedRootCauses: readonly string[];
  readonly relatedChanges: readonly string[];
  readonly relatedRegressionAnalysis: readonly string[];
  readonly status: GuardianPerformanceStatus;
  readonly degradationProbability: number;
  readonly consumptionIncrease: number;
  readonly changeImpactScore: number;
  readonly hotspotPredictions: readonly GuardianPerformanceHotspot[];
  readonly scenarios: readonly GuardianPredictionScenario[];
  readonly preparedOptimization: GuardianPreparedFutureSlot;
  readonly preparedPatch: GuardianPreparedFutureSlot;
  readonly preparedTests: GuardianPreparedFutureSlot;
  readonly preparedDeployment: GuardianPreparedFutureSlot;
  readonly autoOptimization: false;
  readonly codeExecution: false;
  readonly generativeAi: false;
}

export interface GuardianCapacityAnalysis {
  readonly capacityId: string;
  readonly metricsId: string;
  readonly predictionId: string;
  readonly timestamp: string;
  readonly score: number;
  readonly confidence: number;
  readonly evidence: readonly string[];
  readonly knowledgeReferences: readonly string[];
  readonly relatedIncidents: readonly string[];
  readonly relatedRootCauses: readonly string[];
  readonly relatedChanges: readonly string[];
  readonly relatedRegressionAnalysis: readonly string[];
  readonly status: GuardianPerformanceStatus;
  readonly estimatedConcurrentUsers: number;
  readonly growthEstimate: number;
  readonly concurrencyEstimate: number;
  readonly scalabilityEstimate: number;
  readonly limitEstimate: number;
  readonly databaseImpact: number;
  readonly ukalImpact: number;
  readonly corporateRagImpact: number;
  readonly vectorIndexImpact: number;
  readonly providersImpact: number;
  readonly runtimeImpact: number;
  readonly criticalResources: readonly string[];
  readonly scenarios: readonly GuardianCapacityScenario[];
  readonly preparedOptimization: GuardianPreparedFutureSlot;
  readonly preparedPatch: GuardianPreparedFutureSlot;
  readonly preparedTests: GuardianPreparedFutureSlot;
  readonly preparedDeployment: GuardianPreparedFutureSlot;
  readonly autoOptimization: false;
  readonly codeExecution: false;
  readonly generativeAi: false;
  readonly executionPerformed: false;
}

export interface GuardianPerformanceReport {
  readonly reportId: string;
  readonly timestamp: string;
  readonly score: number;
  readonly confidence: number;
  readonly evidence: readonly string[];
  readonly knowledgeReferences: readonly string[];
  readonly relatedIncidents: readonly string[];
  readonly relatedRootCauses: readonly string[];
  readonly relatedChanges: readonly string[];
  readonly relatedRegressionAnalysis: readonly string[];
  readonly status: GuardianPerformanceStatus;
  readonly metrics: GuardianPerformanceMetrics;
  readonly prediction: GuardianPerformancePrediction;
  readonly capacity: GuardianCapacityAnalysis;
  readonly performanceScore: number;
  readonly predictionScore: number;
  readonly capacityScore: number;
  readonly hotspots: readonly GuardianPerformanceHotspot[];
  readonly criticalResources: readonly string[];
  readonly preparedOptimization: GuardianPreparedFutureSlot;
  readonly preparedPatch: GuardianPreparedFutureSlot;
  readonly preparedTests: GuardianPreparedFutureSlot;
  readonly preparedDeployment: GuardianPreparedFutureSlot;
  readonly autoOptimization: false;
  readonly codeExecution: false;
  readonly generativeAi: false;
}

export const EMPTY_PERFORMANCE_PREPARED_SLOT: GuardianPreparedFutureSlot =
  EMPTY_HYPOTHESIS_PREPARED_SLOT;

export const PERFORMANCE_METRIC_KINDS: readonly GuardianPerformanceMetricKind[] = [
  "render_time",
  "load_time",
  "navigation_time",
  "cpu",
  "memory",
  "network",
  "database",
  "supabase",
  "ukal",
  "corporate_rag",
  "knowledge_platform",
  "vector_index",
  "embedding",
  "chunking",
  "providers",
  "dashboard",
  "event_bus",
  "runtime",
  "session",
  "timeline",
  "correlation",
  "root_cause",
  "change_intelligence",
  "regression_intelligence",
] as const;

export interface PerformanceIntelligenceResult {
  readonly metrics: GuardianPerformanceMetrics;
  readonly regressionId: string;
  readonly changeId: string;
  readonly rootCauseId: string;
}

export interface PerformancePredictionResult {
  readonly prediction: GuardianPerformancePrediction;
  readonly metricsId: string;
  readonly regressionId: string;
}

export interface CapacityAnalysisResult {
  readonly capacity: GuardianCapacityAnalysis;
  readonly metricsId: string;
  readonly predictionId: string;
}

export interface PerformanceGuardianPipelineResult {
  readonly metrics: GuardianPerformanceMetrics;
  readonly prediction: GuardianPerformancePrediction;
  readonly capacity: GuardianCapacityAnalysis;
  readonly report: GuardianPerformanceReport;
}
