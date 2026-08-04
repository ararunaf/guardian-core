/**
 * Guardian Plugin Loader (GAI-08A).
 * Loads descriptors/manifests only. Never activates plugins.
 */

import type { GuardianPluginDescriptor } from "./plugin_descriptor";
import { createPluginDescriptor } from "./plugin_descriptor";
import { createPluginManifest, type GuardianPluginManifest } from "./plugin_manifest";
import { createPluginMetadata, type GuardianPluginMetadata } from "./plugin_metadata";
import { GuardianPluginRegistry } from "./plugin_registry";

export interface GuardianPluginLoadRequest {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly description: string;
  readonly capabilities?: readonly string[];
  readonly productTargets?: readonly string[];
  readonly author?: string;
  readonly tags?: readonly string[];
}

export interface GuardianPluginLoadResult {
  readonly loaded: true;
  readonly activated: false;
  readonly manifest: GuardianPluginManifest;
  readonly descriptor: GuardianPluginDescriptor;
  readonly metadata: GuardianPluginMetadata;
}

export const GuardianPluginLoader = {
  load(request: GuardianPluginLoadRequest): GuardianPluginLoadResult {
    const manifest = createPluginManifest({
      id: request.id,
      name: request.name,
      version: request.version,
      description: request.description,
      capabilities: request.capabilities ?? [],
    });
    const descriptor = createPluginDescriptor({
      id: request.id,
      name: request.name,
      version: request.version,
      productTargets: request.productTargets ?? ["supercontab"],
    });
    const metadata = createPluginMetadata({
      id: request.id,
      author: request.author ?? "guardian-core",
      description: request.description,
      tags: request.tags ?? ["declared"],
    });

    GuardianPluginRegistry.register(
      {
        id: manifest.id,
        name: manifest.name,
        version: manifest.version,
        description: manifest.description,
        capabilities: manifest.capabilities,
      },
      descriptor,
      metadata,
    );

    return {
      loaded: true,
      activated: false,
      manifest,
      descriptor,
      metadata,
    };
  },

  listLoaded(): readonly GuardianPluginDescriptor[] {
    return GuardianPluginRegistry.listDescriptors();
  },
};