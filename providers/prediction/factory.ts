/**
 * Guardian Prediction Provider factory (GAI-06).
 * Product-agnostic. Delegates to Performance Prediction Engine.
 */
import type { IPredictionProvider } from "../../contracts/IPredictionProvider";
import { PerformancePredictionEngine } from "../../prediction/performance_prediction_engine";
import type { GuardianProviderDescriptor } from "../../types/provider_types";
import { GUARDIAN_PROVIDER_VERSION } from "../../types/provider_types";
import { getPredictionProviderConfiguration } from "./configuration";

export function createPredictionProvider(): IPredictionProvider {
  const config = getPredictionProviderConfiguration();
  return {
    id: "prediction-provider",
    ready: config.enabled,
    name: "Guardian Prediction Provider",
    operational: true,
    capabilities: {
      predictPerformance: true,
      requiresMetrics: true,
      requiresRegression: true,
      autoOptimization: false,
      codeExecution: false,
      generativeAi: false,
    },
    predict(metrics, regression) {
      if (!config.enabled) throw new Error("Prediction Provider is not enabled");
      PerformancePredictionEngine.initialize();
      return PerformancePredictionEngine.predictFromMetrics(metrics, regression);
    },
    predictFromRegression(regression) {
      if (!config.enabled) throw new Error("Prediction Provider is not enabled");
      PerformancePredictionEngine.initialize();
      return PerformancePredictionEngine.predictFromRegression(regression);
    },
  };
}

export function describePredictionProvider(): GuardianProviderDescriptor {
  const config = getPredictionProviderConfiguration();
  return {
    id: "prediction",
    name: "Guardian Prediction Provider",
    ready: config.enabled,
    operational: true,
    status: config.enabled ? "ready" : "inactive",
    version: GUARDIAN_PROVIDER_VERSION,
  };
}