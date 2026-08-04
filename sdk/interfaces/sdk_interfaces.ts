/**
 * Guardian SDK interfaces (GAI-08A).
 * Structural public interfaces for adapters and products.
 */

import type { GuardianProductId, GuardianStatus } from "../../types";

export interface IGuardianSdkBootstrap {
  readonly productId: GuardianProductId;
  readonly adapterId: string;
  readonly status: GuardianStatus;
}

export interface IGuardianSdkHandle {
  readonly ready: true;
  readonly operational: boolean;
  readonly publicApiReady: true;
  readonly coreExtractable: true;
}

export interface IGuardianProductBridge {
  readonly productId: GuardianProductId;
  readonly initialize: () => void;
  readonly inject: () => void;
  readonly configure: () => void;
  readonly bridgeEvents: () => void;
}