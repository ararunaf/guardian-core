/**
 * Guardian Plugin Model (GAI-00).
 * Declarative model only. Zero active plugins.
 */

import type { GuardianPluginManifest } from "./plugin_manifest";
import { createPluginManifest } from "./plugin_manifest";

const manifests = new Map<string, GuardianPluginManifest>();

export const GuardianPluginModel = {
  /** Declares a plugin without activating it. */
  declare(manifest: Omit<GuardianPluginManifest, "state" | "active">): GuardianPluginManifest {
    const declared = createPluginManifest(manifest);
    manifests.set(declared.id, declared);
    return declared;
  },

  get(id: string): GuardianPluginManifest | null {
    return manifests.get(id) ?? null;
  },

  list(): readonly GuardianPluginManifest[] {
    return [...manifests.values()];
  },

  listActive(): readonly GuardianPluginManifest[] {
    return [];
  },

  reset(): void {
    manifests.clear();
  },
};
