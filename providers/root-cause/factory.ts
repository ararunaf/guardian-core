/**
 * Guardian Root Cause Provider factory (GAI-04).
 * Product-agnostic. Delegates to Root Cause Analysis Engine.
 * Never consults Knowledge Platform directly.
 */
import type { IRootCauseProvider } from "../../contracts/IRootCauseProvider";
import { RootCauseAnalysisEngine } from "../../root_cause/root_cause_engine";
import type { GuardianProviderDescriptor } from "../../types/provider_types";
import { GUARDIAN_PROVIDER_VERSION } from "../../types/provider_types";
import { getRootCauseProviderConfiguration } from "./configuration";

export function createRootCauseProvider(): IRootCauseProvider {
  const config = getRootCauseProviderConfiguration();
  return {
    id: "root-cause-provider",
    ready: config.enabled,
    name: "Guardian Root Cause Provider",
    operational: true,
    capabilities: {
      analyzeRootCause: true,
      requiresDiagnosis: true,
      codeExecution: false,
      autoPatch: false,
      autoDeploy: false,
      autoTest: false,
    },
    analyze(diagnosis) {
      if (!config.enabled) throw new Error("Root Cause Provider is not enabled");
      RootCauseAnalysisEngine.initialize();
      return RootCauseAnalysisEngine.analyze(diagnosis);
    },
  };
}

export function describeRootCauseProvider(): GuardianProviderDescriptor {
  const config = getRootCauseProviderConfiguration();
  return {
    id: "root-cause",
    name: "Guardian Root Cause Provider",
    ready: config.enabled,
    operational: true,
    status: config.enabled ? "ready" : "inactive",
    version: GUARDIAN_PROVIDER_VERSION,
  };
}
