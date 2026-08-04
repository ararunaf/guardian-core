/**
 * Guardian Core official repository metadata (GAI-08B).
 * Product publication surface. No engine behavior changes. No product imports.
 */

export const GUARDIAN_CORE_REPOSITORY = {
  id: "guardian-core",
  name: "Guardian Core",
  product: "Guardian Core",
  organization: "IAeasy",
  localPath: "d:/Projetos/guardian-core",
  remoteUrl: "https://github.com/ararunaf/guardian-core",
  tag: "guardian-core-v1.0.0",
  version: "1.0.0",
  published: true,
  independent: true,
  supercontabReferences: false,
} as const;

export function describeGuardianCoreRepository() {
  return GUARDIAN_CORE_REPOSITORY;
}