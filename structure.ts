/**
 * Canonical Guardian Core product structure (GAI-08B).
 */

export const GUARDIAN_STRUCTURE = [
  "core",
  "contracts",
  "runtime",
  "events",
  "registry",
  "sdk",
  "plugins",
  "dashboard",
  "context",
  "types",
  "adapters",
  "providers",
  "incident",
  "timeline",
  "observability",
  "correlation",
  "diagnosis",
  "hypothesis",
  "root_cause",
  "change",
  "regression",
  "performance",
  "prediction",
  "capacity",
  "security",
  "threat",
  "compliance",
  "engineering_knowledge",
  "engineering_memory",
  "engineering_ontology",
  "version",
  "compatibility",
  "knowledge",
  "memory",
  "ontology",
  "public-api",
] as const;

export type GuardianStructureFolder = (typeof GUARDIAN_STRUCTURE)[number];