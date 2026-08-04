/**
 * Guardian AI - ITimelineService contract (GAI-02).
 * Interface only. Official Engineering Timeline record surface.
 */

import type {
  EngineeringTimelineEvent,
  EngineeringTimelineFilter,
  EngineeringTimelineInput,
} from "../types/timeline_types";

export interface ITimelineService {
  readonly id: "timeline-service";
  readonly ready: boolean;
  readonly name: string;
  record(input: EngineeringTimelineInput): EngineeringTimelineEvent;
  list(filter?: EngineeringTimelineFilter): readonly EngineeringTimelineEvent[];
  get(timelineId: string): EngineeringTimelineEvent | null;
  count(): number;
}
