/**
 * Guardian AI - IGuardianRuntime contract (GAI-00).
 * Interface only. No implementation.
 */

import type { GuardianStatus } from "../types";
import type { IGuardianContext } from "./IGuardianContext";

export interface IGuardianRuntime {
  readonly id: "guardian-runtime";
  readonly status: GuardianStatus;

  /** Structural lifecycle hook - no operational logic in GAI-00. */
  initialize(context: IGuardianContext): Promise<void> | void;

  /** Returns current structural status. */
  getStatus(): GuardianStatus;

  /** Structural shutdown hook - no operational logic in GAI-00. */
  shutdown(): Promise<void> | void;
}
