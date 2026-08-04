/**
 * Guardian AI - IPredictionProvider contract (GAI-06).
 * Performance Prediction access. No generative AI.
 */

import type {
  GuardianPerformanceMetrics,
  PerformancePredictionResult,
} from "../types/performance_types";
import type { GuardianRegressionAnalysis } from "../types/regression_types";

export interface IPredictionProvider {
  readonly id: "prediction-provider";
  readonly ready: boolean;
  readonly name: string;
  readonly operational: boolean;
  readonly capabilities: {
    readonly predictPerformance: true;
    readonly requiresMetrics: true;
    readonly requiresRegression: true;
    readonly autoOptimization: false;
    readonly codeExecution: false;
    readonly generativeAi: false;
  };
  predict(
    metrics: GuardianPerformanceMetrics,
    regression: GuardianRegressionAnalysis,
  ): PerformancePredictionResult;
  predictFromRegression(regression: GuardianRegressionAnalysis): PerformancePredictionResult;
}