/**
 * Guardian Core Freeze inventory (GAI-08A freeze / GAI-08B publication).
 * Audits ownership: Core / SuperContab / Shared / SDK candidates.
 * No runtime behavior changes.
 */

export type GuardianOwnershipClass =
  | "guardian_core"
  | "supercontab"
  | "shared"
  | "sdk_candidate";

export interface GuardianFreezeEntry {
  readonly path: string;
  readonly ownership: GuardianOwnershipClass;
  readonly extractable: boolean;
  readonly notes: string;
}

export const GUARDIAN_CORE_FREEZE_INVENTORY: readonly GuardianFreezeEntry[] = [
  { path: "core", ownership: "guardian_core", extractable: true, notes: "Guardian Core shell" },
  { path: "contracts", ownership: "guardian_core", extractable: true, notes: "Public contracts" },
  { path: "runtime", ownership: "guardian_core", extractable: true, notes: "Guardian Runtime" },
  { path: "events", ownership: "guardian_core", extractable: true, notes: "Event Bus" },
  { path: "registry", ownership: "guardian_core", extractable: true, notes: "Module/service registry" },
  { path: "sdk", ownership: "sdk_candidate", extractable: true, notes: "Official public SDK" },
  { path: "plugins", ownership: "guardian_core", extractable: true, notes: "Plugin model" },
  { path: "dashboard", ownership: "guardian_core", extractable: true, notes: "Read-only dashboard" },
  { path: "context", ownership: "guardian_core", extractable: true, notes: "Incident context" },
  { path: "types", ownership: "guardian_core", extractable: true, notes: "Shared foundation types" },
  { path: "adapters", ownership: "shared", extractable: true, notes: "Adapter base + registry" },
  { path: "supercontab", ownership: "supercontab", extractable: false, notes: "Product adapter only" },
  { path: "adapters/guardian_supercontab_adapter", ownership: "supercontab", extractable: false, notes: "Official product adapter facade" },
  { path: "providers", ownership: "guardian_core", extractable: true, notes: "Product-agnostic providers" },
  { path: "incident", ownership: "guardian_core", extractable: true, notes: "Incident Detection Engine" },
  { path: "timeline", ownership: "guardian_core", extractable: true, notes: "Engineering Timeline" },
  { path: "observability", ownership: "guardian_core", extractable: true, notes: "EOC services" },
  { path: "correlation", ownership: "guardian_core", extractable: true, notes: "Correlation Engine" },
  { path: "diagnosis", ownership: "guardian_core", extractable: true, notes: "Knowledge Diagnosis" },
  { path: "hypothesis", ownership: "guardian_core", extractable: true, notes: "Hypothesis Engine" },
  { path: "root_cause", ownership: "guardian_core", extractable: true, notes: "Root Cause Analysis" },
  { path: "change", ownership: "guardian_core", extractable: true, notes: "Change Intelligence" },
  { path: "regression", ownership: "guardian_core", extractable: true, notes: "Regression Intelligence" },
  { path: "performance", ownership: "guardian_core", extractable: true, notes: "Performance Intelligence" },
  { path: "prediction", ownership: "guardian_core", extractable: true, notes: "Performance Prediction" },
  { path: "capacity", ownership: "guardian_core", extractable: true, notes: "Capacity Analysis" },
  { path: "security", ownership: "guardian_core", extractable: true, notes: "Security Intelligence" },
  { path: "threat", ownership: "guardian_core", extractable: true, notes: "Threat Prediction" },
  { path: "compliance", ownership: "guardian_core", extractable: true, notes: "Compliance Analysis" },
  { path: "engineering_knowledge", ownership: "guardian_core", extractable: true, notes: "Knowledge Platform" },
  { path: "engineering_memory", ownership: "guardian_core", extractable: true, notes: "Engineering Memory" },
  { path: "engineering_ontology", ownership: "guardian_core", extractable: true, notes: "Engineering Ontology" },
  { path: "version", ownership: "guardian_core", extractable: true, notes: "Version Manifest" },
  { path: "compatibility", ownership: "guardian_core", extractable: true, notes: "Compatibility Layer" },
] as const;

export interface GuardianCoreFreezeSnapshot {
  readonly frozen: true;
  readonly sprintId: "GAI-08B";
  readonly coreEntries: number;
  readonly supercontabEntries: number;
  readonly sharedEntries: number;
  readonly sdkCandidates: number;
  readonly inventory: typeof GUARDIAN_CORE_FREEZE_INVENTORY;
}

export function describeGuardianCoreFreeze(): GuardianCoreFreezeSnapshot {
  const inventory = GUARDIAN_CORE_FREEZE_INVENTORY;
  return {
    frozen: true,
    sprintId: "GAI-08B",
    coreEntries: inventory.filter((e) => e.ownership === "guardian_core").length,
    supercontabEntries: inventory.filter((e) => e.ownership === "supercontab").length,
    sharedEntries: inventory.filter((e) => e.ownership === "shared").length,
    sdkCandidates: inventory.filter((e) => e.ownership === "sdk_candidate").length,
    inventory,
  };
}

export function listExtractableCorePaths(): readonly string[] {
  return GUARDIAN_CORE_FREEZE_INVENTORY.filter((e) => e.extractable).map((e) => e.path);
}