/**
 * Guardian SDK (GAI-08A).
 * Official public API entry for Guardian Core.
 * Adapters must consume only this surface.
 */

import { describeGuardianCore } from "../core";
import { GUARDIAN_FOUNDATION_VERSION, GUARDIAN_SPRINT_ID } from "../types";
import { GUARDIAN_SDK_VERSION } from "../version/version_manifest";
import { getGuardianPublicApi } from "./public-api/public_api";
import { GUARDIAN_SDK_PRODUCT_TARGETS } from "./products";
import { listGuardianSdkExports } from "./exports/sdk_exports";
import { GuardianSdkContracts } from "./contracts/sdk_contracts";
import { checkGuardianSdkCompatibility } from "./compatibility/sdk_compatibility";

export interface GuardianSdkDescriptor {
  readonly id: "guardian-sdk";
  readonly version: typeof GUARDIAN_SDK_VERSION;
  readonly foundationVersion: typeof GUARDIAN_FOUNDATION_VERSION;
  readonly sprintId: typeof GUARDIAN_SPRINT_ID;
  readonly functional: true;
  readonly publicApiReady: true;
  readonly productTargets: typeof GUARDIAN_SDK_PRODUCT_TARGETS;
  readonly coreExtractable: true;
  readonly contracts: typeof GuardianSdkContracts;
}

export const GuardianSdk: GuardianSdkDescriptor = {
  id: "guardian-sdk",
  version: GUARDIAN_SDK_VERSION,
  foundationVersion: GUARDIAN_FOUNDATION_VERSION,
  sprintId: GUARDIAN_SPRINT_ID,
  functional: true,
  publicApiReady: true,
  productTargets: GUARDIAN_SDK_PRODUCT_TARGETS,
  coreExtractable: true,
  contracts: GuardianSdkContracts,
};

export function describeGuardianSdk(): GuardianSdkDescriptor {
  return GuardianSdk;
}

/** Official SDK bootstrap. Public API only. */
export function createGuardianSdkHandle() {
  return {
    sdk: GuardianSdk,
    core: describeGuardianCore(),
    publicApi: getGuardianPublicApi(),
    exports: listGuardianSdkExports(),
    compatibility: checkGuardianSdkCompatibility(),
    ready: true as const,
    operational: false as const,
    publicApiReady: true as const,
  };
}