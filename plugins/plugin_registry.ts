/**
 * Guardian Plugin Registry (GAI-08A).
 * Multi-product ready. No active plugin execution.
 */

import type { GuardianPluginDescriptor } from "./plugin_descriptor";
import type { GuardianPluginManifest } from "./plugin_manifest";
import type { GuardianPluginMetadata } from "./plugin_metadata";
import { GuardianPluginModel } from "./plugin_model";
import { GuardianEventBus } from "../events/event_bus";

const descriptors = new Map<string, GuardianPluginDescriptor>();
const metadata = new Map<string, GuardianPluginMetadata>();

export const GuardianPluginRegistry = {
  register(
    manifest: Omit<GuardianPluginManifest, "state" | "active">,
    descriptor: GuardianPluginDescriptor,
    meta: GuardianPluginMetadata,
  ): GuardianPluginManifest {
    const declared = GuardianPluginModel.declare(manifest);
    descriptors.set(descriptor.id, descriptor);
    metadata.set(meta.id, meta);
    GuardianEventBus.publish("guardian.plugin.registered", "guardian-plugin-registry", {
      pluginId: declared.id,
      version: declared.version,
    });
    return declared;
  },

  getDescriptor(id: string): GuardianPluginDescriptor | null {
    return descriptors.get(id) ?? null;
  },

  getMetadata(id: string): GuardianPluginMetadata | null {
    return metadata.get(id) ?? null;
  },

  listDescriptors(): readonly GuardianPluginDescriptor[] {
    return [...descriptors.values()];
  },

  listMetadata(): readonly GuardianPluginMetadata[] {
    return [...metadata.values()];
  },

  listActive(): readonly GuardianPluginDescriptor[] {
    return [];
  },

  reset(): void {
    descriptors.clear();
    metadata.clear();
    GuardianPluginModel.reset();
  },
};