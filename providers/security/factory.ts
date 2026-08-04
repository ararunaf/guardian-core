/**
 * Guardian Security Provider factory (GAI-07).
 * Product-agnostic. Delegates to Security Intelligence Engine.
 */
import type { ISecurityProvider } from "../../contracts/ISecurityProvider";
import { SecurityIntelligenceEngine } from "../../security/security_intelligence_engine";
import type { GuardianProviderDescriptor } from "../../types/provider_types";
import { GUARDIAN_PROVIDER_VERSION } from "../../types/provider_types";
import { getSecurityProviderConfiguration } from "./configuration";

export function createSecurityProvider(): ISecurityProvider {
  const config = getSecurityProviderConfiguration();
  return {
    id: "security-provider",
    ready: config.enabled,
    name: "Guardian Security Provider",
    operational: true,
    capabilities: {
      analyzeSecurity: true,
      requiresRegression: true,
      requiresChangeContext: true,
      requiresRootCause: true,
      autoRemediation: false,
      codeExecution: false,
      autoPatch: false,
      autoDeploy: false,
      generativeAi: false,
      fileMutation: false,
    },
    analyze(regression) {
      if (!config.enabled) throw new Error("Security Provider is not enabled");
      SecurityIntelligenceEngine.initialize();
      return SecurityIntelligenceEngine.analyzeFromRegression(regression);
    },
    analyzeFromRootCause(rootCause) {
      if (!config.enabled) throw new Error("Security Provider is not enabled");
      SecurityIntelligenceEngine.initialize();
      return SecurityIntelligenceEngine.analyzeFromRootCause(rootCause);
    },
  };
}

export function describeSecurityProvider(): GuardianProviderDescriptor {
  const config = getSecurityProviderConfiguration();
  return {
    id: "security",
    name: "Guardian Security Provider",
    ready: config.enabled,
    operational: true,
    status: config.enabled ? "ready" : "inactive",
    version: GUARDIAN_PROVIDER_VERSION,
  };
}
