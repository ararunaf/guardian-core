/**
 * Guardian Performance Provider factory (GAI-06).
 * Product-agnostic. Delegates to Performance Intelligence Engine.
 */
import type { IPerformanceProvider } from "../../contracts/IPerformanceProvider";
import { PerformanceIntelligenceEngine } from "../../performance/performance_intelligence_engine";
import type { GuardianProviderDescriptor } from "../../types/provider_types";
import { GUARDIAN_PROVIDER_VERSION } from "../../types/provider_types";
import { getPerformanceProviderConfiguration } from "./configuration";

export function createPerformanceProvider(): IPerformanceProvider {
  const config = getPerformanceProviderConfiguration();
  return {
    id: "performance-provider",
    ready: config.enabled,
    name: "Guardian Performance Provider",
    operational: true,
    capabilities: {
      analyzePerformance: true,
      requiresRegression: true,
      requiresChangeContext: true,
      requiresRootCause: true,
      autoOptimization: false,
      codeExecution: false,
      autoPatch: false,
      autoDeploy: false,
      generativeAi: false,
    },
    analyze(regression) {
      if (!config.enabled) throw new Error("Performance Provider is not enabled");
      PerformanceIntelligenceEngine.initialize();
      return PerformanceIntelligenceEngine.analyzeFromRegression(regression);
    },
    analyzeFromRootCause(rootCause) {
      if (!config.enabled) throw new Error("Performance Provider is not enabled");
      PerformanceIntelligenceEngine.initialize();
      return PerformanceIntelligenceEngine.analyzeFromRootCause(rootCause);
    },
  };
}

export function describePerformanceProvider(): GuardianProviderDescriptor {
  const config = getPerformanceProviderConfiguration();
  return {
    id: "performance",
    name: "Guardian Performance Provider",
    ready: config.enabled,
    operational: true,
    status: config.enabled ? "ready" : "inactive",
    version: GUARDIAN_PROVIDER_VERSION,
  };
}