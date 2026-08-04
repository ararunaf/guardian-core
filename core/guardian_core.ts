/**
 * Guardian Core shell (GAI-00).
 * Reusable, product-agnostic foundation. No SuperContab coupling.
 * Prepared for future extraction into Guardian Core repository.
 */

import {
  GUARDIAN_FOUNDATION_VERSION,
  GUARDIAN_SPRINT_ID,
  type GuardianStatus,
} from "../types";
import { GUARDIAN_CORE_ID, GUARDIAN_CORE_NAME, GUARDIAN_CORE_EXTRACTABLE } from "./constants";

export interface GuardianCoreDescriptor {
  readonly id: typeof GUARDIAN_CORE_ID;
  readonly name: typeof GUARDIAN_CORE_NAME;
  readonly version: typeof GUARDIAN_FOUNDATION_VERSION;
  readonly sprintId: typeof GUARDIAN_SPRINT_ID;
  readonly extractable: typeof GUARDIAN_CORE_EXTRACTABLE;
  readonly productAgnostic: true;
  readonly status: GuardianStatus;
}

export const GuardianCore: GuardianCoreDescriptor = {
  id: GUARDIAN_CORE_ID,
  name: GUARDIAN_CORE_NAME,
  version: GUARDIAN_FOUNDATION_VERSION,
  sprintId: GUARDIAN_SPRINT_ID,
  extractable: GUARDIAN_CORE_EXTRACTABLE,
  productAgnostic: true,
  status: "foundation_ready",
};

export function describeGuardianCore(): GuardianCoreDescriptor {
  return GuardianCore;
}
