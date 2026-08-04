/**
 * Guardian Regression Provider factory (GAI-05).
 * Product-agnostic. Delegates to Regression Intelligence Engine.
 * Requires Change Context + Root Cause Analysis.
 */
import type { IRegressionProvider } from "../../contracts/IRegressionProvider";
import { RegressionIntelligenceEngine } from "../../regression/regression_intelligence_engine";
import type { GuardianProviderDescriptor } from "../../types/provider_types";
import { GUARDIAN_PROVIDER_VERSION } from "../../types/provider_types";
import { getRegressionProviderConfiguration } from "./configuration";

export function createRegressionProvider(): IRegressionProvider {
  const config = getRegressionProviderConfiguration();
  return {
    id: "regression-provider",
    ready: config.enabled,
    name: "Guardian Regression Provider",
    operational: true,
    capabilities: {
      analyzeRegression: true,
      requiresChangeContext: true,
      requiresRootCause: true,
      codeExecution: false,
      autoPatch: false,
      autoDeploy: false,
      autoTest: false,
    },
    analyze(rootCause) {
      if (!config.enabled) throw new Error("Regression Provider is not enabled");
      RegressionIntelligenceEngine.initialize();
      return RegressionIntelligenceEngine.analyzeFromRootCause(rootCause);
    },
    analyzeFromChange(changeContext, rootCause) {
      if (!config.enabled) throw new Error("Regression Provider is not enabled");
      RegressionIntelligenceEngine.initialize();
      return RegressionIntelligenceEngine.analyzeFromChangeContext(changeContext, rootCause);
    },
  };
}

export function describeRegressionProvider(): GuardianProviderDescriptor {
  const config = getRegressionProviderConfiguration();
  return {
    id: "regression",
    name: "Guardian Regression Provider",
    ready: config.enabled,
    operational: true,
    status: config.enabled ? "ready" : "inactive",
    version: GUARDIAN_PROVIDER_VERSION,
  };
}
