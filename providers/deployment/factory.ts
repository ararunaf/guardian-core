/**
 * Guardian Deployment Provider factory (GAI-01).
 * Creates a ready shell provider. No product-specific logic.
 */

import type { IDeploymentProvider } from "../../contracts/IDeploymentProvider";
import type { GuardianProviderDescriptor } from "../../types/provider_types";
import { GUARDIAN_PROVIDER_VERSION } from "../../types/provider_types";
import { getDeploymentProviderConfiguration } from "./configuration";

export function createDeploymentProvider(): IDeploymentProvider {
  const config = getDeploymentProviderConfiguration();
  return {
    id: "deployment-provider",
    ready: config.enabled,
    name: "Guardian Deployment Provider",
  };
}

export function describeDeploymentProvider(): GuardianProviderDescriptor {
  const config = getDeploymentProviderConfiguration();
  return {
    id: "deployment",
    name: "Guardian Deployment Provider",
    ready: config.enabled,
    operational: false,
    status: config.enabled ? "ready" : "inactive",
    version: GUARDIAN_PROVIDER_VERSION,
  };
}