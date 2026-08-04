/**
 * Guardian Plugin Compatibility (GAI-08A).
 */

import type { GuardianPluginManifest } from "./plugin_manifest";
import { isPluginVersionCompatible } from "./plugin_version";

export function isPluginCompatibleWithCore(manifest: GuardianPluginManifest): boolean {
  return !manifest.active && isPluginVersionCompatible(manifest.version);
}