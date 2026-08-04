/**
 * Guardian AI - IGuardianEvent contract (GAI-00).
 * Interface only. No implementation.
 */

import type { GuardianEventType } from "../types";

export interface IGuardianEvent<TPayload = unknown> {
  readonly id: string;
  readonly type: GuardianEventType;
  readonly timestamp: string;
  readonly source: string;
  readonly payload: TPayload;
}
