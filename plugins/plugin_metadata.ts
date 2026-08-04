/**
 * Guardian Plugin Metadata (GAI-08A).
 */

export interface GuardianPluginMetadata {
  readonly id: string;
  readonly author: string;
  readonly description: string;
  readonly tags: readonly string[];
  readonly createdAt: string;
  readonly multiProduct: true;
}

export function createPluginMetadata(
  input: Omit<GuardianPluginMetadata, "multiProduct" | "createdAt"> & { createdAt?: string },
): GuardianPluginMetadata {
  return {
    id: input.id,
    author: input.author,
    description: input.description,
    tags: input.tags,
    createdAt: input.createdAt ?? new Date().toISOString(),
    multiProduct: true,
  };
}