/**
 * Guardian Plugin Manifest (GAI-00).
 * Declarative plugin model. No active plugins.
 */

import type { GuardianPluginState } from "../types";

export interface GuardianPluginManifest {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly description: string;
  readonly capabilities: readonly string[];
  readonly state: GuardianPluginState;
  readonly active: false;
}

export function createPluginManifest(
  input: Omit<GuardianPluginManifest, "state" | "active"> & {
    state?: GuardianPluginState;
  },
): GuardianPluginManifest {
  return {
    id: input.id,
    name: input.name,
    version: input.version,
    description: input.description,
    capabilities: input.capabilities,
    state: input.state ?? "declared",
    active: false,
  };
}
