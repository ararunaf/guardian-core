/**
 * Guardian Plugin Version helpers (GAI-08A).
 */

import { GUARDIAN_PLUGIN_VERSION } from "../version/version_manifest";

export function describeGuardianPluginVersion() {
  return {
    pluginVersion: GUARDIAN_PLUGIN_VERSION,
    semver: true as const,
    activationForbiddenUntilCertified: true as const,
  };
}

export function isPluginVersionCompatible(version: string): boolean {
  return typeof version === "string" && version.length > 0;
}