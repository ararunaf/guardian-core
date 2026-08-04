/**
 * Guardian Threat Provider factory (GAI-07).
 * Product-agnostic. Delegates to Threat Prediction Engine.
 */
import type { IThreatProvider } from "../../contracts/IThreatProvider";
import { ThreatPredictionEngine } from "../../threat/threat_prediction_engine";
import type { GuardianProviderDescriptor } from "../../types/provider_types";
import { GUARDIAN_PROVIDER_VERSION } from "../../types/provider_types";
import { getThreatProviderConfiguration } from "./configuration";

export function createThreatProvider(): IThreatProvider {
  const config = getThreatProviderConfiguration();
  return {
    id: "threat-provider",
    ready: config.enabled,
    name: "Guardian Threat Provider",
    operational: true,
    capabilities: {
      predictThreats: true,
      requiresAssessment: true,
      requiresRegression: true,
      requiresPerformancePrediction: true,
      requiresKnowledgeDiagnosis: true,
      execution: false,
      autoRemediation: false,
      codeExecution: false,
      generativeAi: false,
    },
    predict(assessment, regression) {
      if (!config.enabled) throw new Error("Threat Provider is not enabled");
      ThreatPredictionEngine.initialize();
      return ThreatPredictionEngine.predictFromAssessment(assessment, regression);
    },
    predictFromRegression(regression) {
      if (!config.enabled) throw new Error("Threat Provider is not enabled");
      ThreatPredictionEngine.initialize();
      return ThreatPredictionEngine.predictFromRegression(regression);
    },
  };
}

export function describeThreatProvider(): GuardianProviderDescriptor {
  const config = getThreatProviderConfiguration();
  return {
    id: "threat",
    name: "Guardian Threat Provider",
    ready: config.enabled,
    operational: true,
    status: config.enabled ? "ready" : "inactive",
    version: GUARDIAN_PROVIDER_VERSION,
  };
}