/**
 * Guardian Hypothesis Provider factory (GAI-04).
 * Product-agnostic. Delegates to Hypothesis Engine.
 */
import type { IHypothesisProvider } from "../../contracts/IHypothesisProvider";
import { HypothesisEngine } from "../../hypothesis/hypothesis_engine";
import type { GuardianProviderDescriptor } from "../../types/provider_types";
import { GUARDIAN_PROVIDER_VERSION } from "../../types/provider_types";
import { getHypothesisProviderConfiguration } from "./configuration";

export function createHypothesisProvider(): IHypothesisProvider {
  const config = getHypothesisProviderConfiguration();
  return {
    id: "hypothesis-provider",
    ready: config.enabled,
    name: "Guardian Hypothesis Provider",
    operational: true,
    capabilities: {
      generateHypotheses: true,
      rankHypotheses: true,
      codeExecution: false,
      autoPatch: false,
      autoDeploy: false,
    },
    generate(diagnosis) {
      if (!config.enabled) throw new Error("Hypothesis Provider is not enabled");
      HypothesisEngine.initialize();
      return HypothesisEngine.generateFromDiagnosis(diagnosis);
    },
  };
}

export function describeHypothesisProvider(): GuardianProviderDescriptor {
  const config = getHypothesisProviderConfiguration();
  return {
    id: "hypothesis",
    name: "Guardian Hypothesis Provider",
    ready: config.enabled,
    operational: true,
    status: config.enabled ? "ready" : "inactive",
    version: GUARDIAN_PROVIDER_VERSION,
  };
}
