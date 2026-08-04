/**
 * Guardian AI - IGuardianContext contract (GAI-00).
 * Interface only. No implementation.
 */

import type { GuardianProductId } from "../types";

export interface IGuardianContext {
  readonly productId: GuardianProductId;
  readonly tenantId?: string;
  readonly correlationId?: string;
  readonly metadata?: Readonly<Record<string, string>>;
}
