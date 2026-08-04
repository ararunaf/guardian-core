/**
 * Engineering Audit Service (GAI-02).
 * Read-only audit trail derived from Engineering Timeline.
 */

import type {
  EngineeringAuditEntry,
  IAuditService,
} from "../contracts/IAuditService";
import { EngineeringTimeline } from "../timeline/timeline_service";
import type { EngineeringTimelineEvent } from "../types/timeline_types";

class AuditServiceImpl implements IAuditService {
  readonly id = "audit-service" as const;
  readonly name = "Engineering Audit Service";
  readonly ready = true;

  list(limit = 100): readonly EngineeringAuditEntry[] {
    return EngineeringTimeline.list({ limit }).map((event) => ({
      auditId: `audit-${event.timelineId}`,
      timelineId: event.timelineId,
      timestamp: event.timestamp,
      eventType: event.eventType,
      source: event.source,
      module: event.module,
      correlationId: event.correlationId,
      summary: event.observations ?? `${event.eventType} @ ${event.source}`,
    }));
  }

  listFromTimeline(): readonly EngineeringTimelineEvent[] {
    return EngineeringTimeline.list();
  }
}

export const EngineeringAuditService: IAuditService = new AuditServiceImpl();

export function createAuditService(): IAuditService {
  return new AuditServiceImpl();
}
