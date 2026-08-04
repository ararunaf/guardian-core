/**
 * Guardian Change Intelligence Provider factory (GAI-05).
 * Product-agnostic. Delegates to Change Intelligence Engine.
 * Requires Root Cause Analysis input.
 */
import type { IChangeIntelligenceProvider } from "../../contracts/IChangeIntelligenceProvider";
import { ChangeIntelligenceEngine } from "../../change/change_intelligence_engine";
import type { GuardianProviderDescriptor } from "../../types/provider_types";
import { GUARDIAN_PROVIDER_VERSION } from "../../types/provider_types";
import { getChangeIntelligenceProviderConfiguration } from "./configuration";

export function createChangeIntelligenceProvider(): IChangeIntelligenceProvider {
  const config = getChangeIntelligenceProviderConfiguration();
  return {
    id: "change-intelligence-provider",
    ready: config.enabled,
    name: "Guardian Change Intelligence Provider",
    operational: true,
    capabilities: {
      analyzeChange: true,
      requiresRootCause: true,
      codeExecution: false,
      autoPatch: false,
      autoDeploy: false,
      autoTest: false,
    },
    analyze(rootCause) {
      if (!config.enabled) throw new Error("Change Intelligence Provider is not enabled");
      ChangeIntelligenceEngine.initialize();
      return ChangeIntelligenceEngine.analyzeFromRootCause(rootCause);
    },
  };
}

export function describeChangeIntelligenceProvider(): GuardianProviderDescriptor {
  const config = getChangeIntelligenceProviderConfiguration();
  return {
    id: "change-intelligence",
    name: "Guardian Change Intelligence Provider",
    ready: config.enabled,
    operational: true,
    status: config.enabled ? "ready" : "inactive",
    version: GUARDIAN_PROVIDER_VERSION,
  };
}
