/**
 * Guardian Compliance Provider factory (GAI-07).
 * Product-agnostic. Delegates to Compliance Analysis Engine.
 */
import type { IComplianceProvider } from "../../contracts/IComplianceProvider";
import { ComplianceAnalysisEngine } from "../../compliance/compliance_analysis_engine";
import type { GuardianProviderDescriptor } from "../../types/provider_types";
import { GUARDIAN_PROVIDER_VERSION } from "../../types/provider_types";
import { getComplianceProviderConfiguration } from "./configuration";

export function createComplianceProvider(): IComplianceProvider {
  const config = getComplianceProviderConfiguration();
  return {
    id: "compliance-provider",
    ready: config.enabled,
    name: "Guardian Compliance Provider",
    operational: true,
    capabilities: {
      analyzeCompliance: true,
      requiresAssessment: true,
      requiresThreatPrediction: true,
      execution: false,
      autoRemediation: false,
      codeExecution: false,
      generativeAi: false,
      fileMutation: false,
    },
    analyze(assessment, threat) {
      if (!config.enabled) throw new Error("Compliance Provider is not enabled");
      ComplianceAnalysisEngine.initialize();
      return ComplianceAnalysisEngine.analyzeFromThreat(assessment, threat);
    },
    analyzePipeline(regression) {
      if (!config.enabled) throw new Error("Compliance Provider is not enabled");
      ComplianceAnalysisEngine.initialize();
      return ComplianceAnalysisEngine.analyzePipeline(regression);
    },
    getLastDashboard() {
      return ComplianceAnalysisEngine.getLastDashboard();
    },
  };
}

export function describeComplianceProvider(): GuardianProviderDescriptor {
  const config = getComplianceProviderConfiguration();
  return {
    id: "compliance",
    name: "Guardian Compliance Provider",
    ready: config.enabled,
    operational: true,
    status: config.enabled ? "ready" : "inactive",
    version: GUARDIAN_PROVIDER_VERSION,
  };
}