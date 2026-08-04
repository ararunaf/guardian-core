/**
 * Guardian AI - IPerformanceProvider contract (GAI-06).
 * Performance Intelligence access. No auto-optimization.
 */

import type { PerformanceIntelligenceResult } from "../types/performance_types";
import type { GuardianRegressionAnalysis } from "../types/regression_types";
import type { GuardianRootCause } from "../types/root_cause_types";

export interface IPerformanceProvider {
  readonly id: "performance-provider";
  readonly ready: boolean;
  readonly name: string;
  readonly operational: boolean;
  readonly capabilities: {
    readonly analyzePerformance: true;
    readonly requiresRegression: true;
    readonly requiresChangeContext: true;
    readonly requiresRootCause: true;
    readonly autoOptimization: false;
    readonly codeExecution: false;
    readonly autoPatch: false;
    readonly autoDeploy: false;
    readonly generativeAi: false;
  };
  analyze(regression: GuardianRegressionAnalysis): PerformanceIntelligenceResult;
  analyzeFromRootCause(rootCause: GuardianRootCause): PerformanceIntelligenceResult;
}