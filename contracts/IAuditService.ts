/**
 * Guardian AI - IAuditService contract (GAI-02).
 * Interface only. Read-only audit trail over Timeline.
 */

import type { EngineeringTimelineEvent } from "../types/timeline_types";

export interface EngineeringAuditEntry {
  readonly auditId: string;
  readonly timelineId: string;
  readonly timestamp: string;
  readonly eventType: string;
  readonly source: string;
  readonly module: string;
  readonly correlationId: string;
  readonly summary: string;
}

export interface IAuditService {
  readonly id: "audit-service";
  readonly ready: boolean;
  readonly name: string;
  list(limit?: number): readonly EngineeringAuditEntry[];
  listFromTimeline(): readonly EngineeringTimelineEvent[];
}
