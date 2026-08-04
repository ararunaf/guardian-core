/**
 * Engineering Timeline in-memory store (GAI-02).
 * Official event record. No processing beyond append/list.
 */

import type { EngineeringTimelineEvent } from "../types/timeline_types";

const MAX_EVENTS = 2000;

export class TimelineStore {
  private events: EngineeringTimelineEvent[] = [];

  append(event: EngineeringTimelineEvent): void {
    this.events = [event, ...this.events].slice(0, MAX_EVENTS);
  }

  list(): readonly EngineeringTimelineEvent[] {
    return this.events;
  }

  get(timelineId: string): EngineeringTimelineEvent | null {
    return this.events.find((e) => e.timelineId === timelineId) ?? null;
  }

  count(): number {
    return this.events.length;
  }

  clear(): void {
    this.events = [];
  }
}
