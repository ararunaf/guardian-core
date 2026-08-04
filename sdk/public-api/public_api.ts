/**
 * Guardian SDK Public API surface (GAI-08B).
 * Sole public entry for product adapters. No internal module leakage.
 */

import { describeGuardianCore } from "../../core/guardian_core";
import { describeGuardianCoreFreeze } from "../../core/core_freeze";
import { GuardianCompatibilityLayer } from "../../compatibility/compatibility_layer";
import { GUARDIAN_VERSION_MANIFEST, GUARDIAN_SDK_VERSION } from "../../version/version_manifest";
import { GUARDIAN_SDK_PRODUCT_TARGETS } from "../products";
import { bindProductAdapter } from "./adapter_runtime_api";

export interface GuardianPublicApiSurface {
  readonly id: "guardian-public-api";
  readonly sdkVersion: typeof GUARDIAN_SDK_VERSION;
  readonly ready: true;
  readonly soleEntry: true;
  readonly exports: readonly string[];
}

export const GUARDIAN_PUBLIC_API_EXPORTS = [
  "describeGuardianSdk",
  "createGuardianSdkHandle",
  "getGuardianPublicApi",
  "describeGuardianVersionManifest",
  "runCompatibilityCheck",
  "describeGuardianCore",
  "describeGuardianCoreFreeze",
  "GuardianPluginRegistry",
  "GuardianPluginLoader",
  "GuardianAdapterRegistry",
  "bindProductAdapter",
  "getGuardianAdapterRuntimeApi",
] as const;

export const GuardianPublicApi: GuardianPublicApiSurface = {
  id: "guardian-public-api",
  sdkVersion: GUARDIAN_SDK_VERSION,
  ready: true,
  soleEntry: true,
  exports: GUARDIAN_PUBLIC_API_EXPORTS,
};

export function getGuardianPublicApi(): GuardianPublicApiSurface {
  return GuardianPublicApi;
}

export function describeGuardianPublicApiSnapshot() {
  return {
    api: GuardianPublicApi,
    core: describeGuardianCore(),
    freeze: describeGuardianCoreFreeze(),
    version: GUARDIAN_VERSION_MANIFEST,
    productTargets: GUARDIAN_SDK_PRODUCT_TARGETS,
    compatibility: GuardianCompatibilityLayer.check({ publicApiReady: true }),
  };
}

export { bindProductAdapter };
export * from "./adapter_runtime_api";

export function getGuardianAdapterRuntimeApi() {
  return {
    id: "guardian-adapter-runtime-api" as const,
    version: GUARDIAN_SDK_VERSION,
    soleEntryForAdapters: true as const,
    bindProductAdapter,
  };
}