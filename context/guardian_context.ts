/**
 * Guardian Context factory (GAI-00).
 * Structural context creation only.
 */

import type { IGuardianContext } from "../contracts";
import type { GuardianProductId } from "../types";

export function createGuardianContext(
  productId: GuardianProductId,
  options?: {
    tenantId?: string;
    correlationId?: string;
    metadata?: Readonly<Record<string, string>>;
  },
): IGuardianContext {
  return {
    productId,
    tenantId: options?.tenantId,
    correlationId: options?.correlationId,
    metadata: options?.metadata,
  };
}
