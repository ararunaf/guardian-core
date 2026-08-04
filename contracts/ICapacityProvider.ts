/**
 * Guardian AI - ICapacityProvider contract (GAI-06).
 * Capacity Analysis access. Analysis only — no execution.
 */

import type {
  CapacityAnalysisResult,
  GuardianPerformanceMetrics,
  GuardianPerformancePrediction,
  GuardianPerformanceReport,
  PerformanceGuardianPipelineResult,
} from "../types/performance_types";
import type { GuardianRegressionAnalysis } from "../types/regression_types";

export interface ICapacityProvider {
  readonly id: "capacity-provider";
  readonly ready: boolean;
  readonly name: string;
  readonly operational: boolean;
  readonly capabilities: {
    readonly analyzeCapacity: true;
    readonly requiresMetrics: true;
    readonly requiresPrediction: true;
    readonly execution: false;
    readonly autoOptimization: false;
    readonly codeExecution: false;
    readonly generativeAi: false;
  };
  analyze(
    metrics: GuardianPerformanceMetrics,
    prediction: GuardianPerformancePrediction,
  ): CapacityAnalysisResult;
  analyzePipeline(regression: GuardianRegressionAnalysis): PerformanceGuardianPipelineResult;
  getLastReport(): GuardianPerformanceReport | null;
}