/**
 * Guardian Plugin Descriptor (GAI-08A).
 */

import type { GuardianPluginState } from "../types";
import { GUARDIAN_PLUGIN_VERSION } from "../version/version_manifest";

export interface GuardianPluginDescriptor {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly pluginVersion: typeof GUARDIAN_PLUGIN_VERSION;
  readonly productTargets: readonly string[];
  readonly state: GuardianPluginState;
  readonly active: false;
  readonly multiProductReady: true;
}

export function createPluginDescriptor(
  input: Omit<GuardianPluginDescriptor, "pluginVersion" | "state" | "active" | "multiProductReady"> & {
    state?: GuardianPluginState;
  },
): GuardianPluginDescriptor {
  return {
    id: input.id,
    name: input.name,
    version: input.version,
    pluginVersion: GUARDIAN_PLUGIN_VERSION,
    productTargets: input.productTargets,
    state: input.state ?? "declared",
    active: false,
    multiProductReady: true,
  };
}