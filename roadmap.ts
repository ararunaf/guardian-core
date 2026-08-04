/**
 * Guardian AI official roadmap (GAI-08C).
 */

import type { GuardianRoadmapSprintId } from "./types";

export interface GuardianRoadmapEntry {
  readonly id: GuardianRoadmapSprintId;
  readonly name: string;
  readonly status: "done" | "planned";
}

export const GUARDIAN_ROADMAP: readonly GuardianRoadmapEntry[] = [
  { id: "GAI-00", name: "Guardian Architecture Foundation", status: "done" },
  { id: "GAI-01", name: "Incident Detection Engine", status: "done" },
  { id: "GAI-02", name: "Engineering Observability", status: "done" },
  { id: "GAI-03", name: "Knowledge Diagnosis", status: "done" },
  { id: "GAI-04", name: "Root Cause Analysis", status: "done" },
  { id: "GAI-05", name: "Regression Guardian", status: "done" },
  { id: "GAI-06", name: "Performance Guardian", status: "done" },
  { id: "GAI-07", name: "Security Guardian", status: "done" },
  { id: "GAI-08", name: "Engineering Knowledge Platform", status: "done" },
  { id: "GAI-08A", name: "Guardian Core Extraction", status: "done" },
  { id: "GAI-08B", name: "Guardian Core Publication", status: "done" },
  { id: "GAI-08C", name: "Guardian Core Stabilization & Publication", status: "done" },
  { id: "GAI-09", name: "Software Architecture Specialist", status: "planned" },
  { id: "GAI-10", name: "Patch Generator", status: "planned" },
  { id: "GAI-11", name: "Test Guardian", status: "planned" },
  { id: "GAI-12", name: "Deployment Guardian", status: "planned" },
  { id: "GAI-13", name: "Engineering Director AI", status: "planned" },
  { id: "GAI-14", name: "Guardian AI Certification", status: "planned" },
] as const;

export function getRoadmapEntry(id: GuardianRoadmapSprintId): GuardianRoadmapEntry | null {
  return GUARDIAN_ROADMAP.find((entry) => entry.id === id) ?? null;
}
