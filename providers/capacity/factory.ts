/**
 * Guardian Capacity Provider factory (GAI-06).
 * Product-agnostic. Delegates to Capacity Analysis Engine.
 */
import type { ICapacityProvider } from "../../contracts/ICapacityProvider";
import { CapacityAnalysisEngine } from "../../capacity/capacity_analysis_engine";
import type { GuardianProviderDescriptor } from "../../types/provider_types";
import { GUARDIAN_PROVIDER_VERSION } from "../../types/provider_types";
import { getCapacityProviderConfiguration } from "./configuration";

export function createCapacityProvider(): ICapacityProvider {
  const config = getCapacityProviderConfiguration();
  return {
    id: "capacity-provider",
    ready: config.enabled,
    name: "Guardian Capacity Provider",
    operational: true,
    capabilities: {
      analyzeCapacity: true,
      requiresMetrics: true,
      requiresPrediction: true,
      execution: false,
      autoOptimization: false,
      codeExecution: false,
      generativeAi: false,
    },
    analyze(metrics, prediction) {
      if (!config.enabled) throw new Error("Capacity Provider is not enabled");
      CapacityAnalysisEngine.initialize();
      return CapacityAnalysisEngine.analyzeFromPrediction(metrics, prediction);
    },
    analyzePipeline(regression) {
      if (!config.enabled) throw new Error("Capacity Provider is not enabled");
      CapacityAnalysisEngine.initialize();
      return CapacityAnalysisEngine.analyzePipeline(regression);
    },
    getLastReport() {
      return CapacityAnalysisEngine.getLastReport();
    },
  };
}

export function describeCapacityProvider(): GuardianProviderDescriptor {
  const config = getCapacityProviderConfiguration();
  return {
    id: "capacity",
    name: "Guardian Capacity Provider",
    ready: config.enabled,
    operational: true,
    status: config.enabled ? "ready" : "inactive",
    version: GUARDIAN_PROVIDER_VERSION,
  };
}