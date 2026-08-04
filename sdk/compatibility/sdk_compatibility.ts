/**
 * Guardian SDK compatibility helpers (GAI-08A).
 */

import { GuardianCompatibilityLayer } from "../../compatibility/compatibility_layer";
import { GUARDIAN_SDK_VERSION } from "../../version/version_manifest";

export function checkGuardianSdkCompatibility() {
  return GuardianCompatibilityLayer.check({
    publicApiReady: true,
    importsInternalModules: false,
  });
}

export function isGuardianSdkCompatible(): boolean {
  return checkGuardianSdkCompatibility().compatible && GUARDIAN_SDK_VERSION.length > 0;
}