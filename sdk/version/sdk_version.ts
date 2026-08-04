/**
 * Guardian SDK version module (GAI-08A).
 */

import { GUARDIAN_SDK_VERSION, GUARDIAN_VERSION_MANIFEST } from "../../version/version_manifest";

export { GUARDIAN_SDK_VERSION };

export function describeGuardianSdkVersion() {
  return {
    sdkVersion: GUARDIAN_SDK_VERSION,
    alignedWithCore: GUARDIAN_VERSION_MANIFEST.coreVersion === GUARDIAN_SDK_VERSION,
    manifest: GUARDIAN_VERSION_MANIFEST,
  };
}