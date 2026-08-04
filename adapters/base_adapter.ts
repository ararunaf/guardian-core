/**
 * Guardian Adapter base infrastructure (GAI-01).
 * Product adapters bind Providers. Core remains product-agnostic.
 */

import type { GuardianProductId, GuardianStatus } from "../types";
import type { GuardianProviderKind } from "../types/provider_types";

export interface GuardianAdapterDescriptor {
  readonly id: string;
  readonly productId: GuardianProductId;
  readonly name: string;
  readonly status: GuardianStatus;
  /** True only when autonomous/AI actions are enabled. Remains false in GAI-01. */
  readonly functional: boolean;
  readonly implementsProviders: boolean;
  readonly boundProviders: readonly GuardianProviderKind[];
  readonly bindsBusinessRules: false;
  readonly bindsApis: false;
  readonly bindsDatabase: false;
}

export function createAdapterDescriptor(
  input: Pick<GuardianAdapterDescriptor, "id" | "productId" | "name"> & {
    implementsProviders?: boolean;
    boundProviders?: readonly GuardianProviderKind[];
    functional?: boolean;
    status?: GuardianStatus;
  },
): GuardianAdapterDescriptor {
  return {
    id: input.id,
    productId: input.productId,
    name: input.name,
    status: input.status ?? "ready",
    functional: input.functional ?? false,
    implementsProviders: input.implementsProviders ?? false,
    boundProviders: input.boundProviders ?? [],
    bindsBusinessRules: false,
    bindsApis: false,
    bindsDatabase: false,
  };
}