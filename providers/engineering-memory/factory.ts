/**
 * Guardian Engineering Memory Provider factory (GAI-08).
 * Product-agnostic. Delegates to Engineering Memory.
 */

import type { IEngineeringMemoryProvider } from "../../contracts/IEngineeringMemoryProvider";
import { EngineeringMemory } from "../../engineering_memory/engineering_memory_engine";
import type { GuardianProviderDescriptor } from "../../types/provider_types";
import { GUARDIAN_PROVIDER_VERSION } from "../../types/provider_types";
import { getEngineeringMemoryProviderConfiguration } from "./configuration";

export function createEngineeringMemoryProvider(): IEngineeringMemoryProvider {
  const config = getEngineeringMemoryProviderConfiguration();
  return {
    id: "engineering-memory-provider",
    ready: config.enabled,
    name: "Guardian Engineering Memory Provider",
    operational: true,
    capabilities: {
      registerMemory: true,
      listMemory: true,
      autoLearning: false,
      generativeAi: false,
      ml: false,
      codeExecution: false,
      autoPatch: false,
      autoDeploy: false,
    },
    register(input) {
      if (!config.enabled) throw new Error("Engineering Memory Provider is not enabled");
      EngineeringMemory.initialize();
      return EngineeringMemory.register(input);
    },
    list(kind) {
      if (!config.enabled) throw new Error("Engineering Memory Provider is not enabled");
      EngineeringMemory.initialize();
      return EngineeringMemory.list(kind);
    },
  };
}

export function describeEngineeringMemoryProvider(): GuardianProviderDescriptor {
  const config = getEngineeringMemoryProviderConfiguration();
  return {
    id: "engineering-memory",
    name: "Guardian Engineering Memory Provider",
    ready: config.enabled,
    operational: true,
    status: config.enabled ? "ready" : "inactive",
    version: GUARDIAN_PROVIDER_VERSION,
  };
}
