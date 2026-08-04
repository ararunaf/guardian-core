/**
 * Guardian AI - IGuardianPlugin contract (GAI-00).
 * Interface only. No implementation.
 */

import type { GuardianPluginState } from "../types";
import type { IGuardianContext } from "./IGuardianContext";

export interface IGuardianPlugin {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly state: GuardianPluginState;

  /** Declarative registration hook - inactive in GAI-00. */
  register(context: IGuardianContext): Promise<void> | void;

  /** Declarative unregistration hook - inactive in GAI-00. */
  unregister(): Promise<void> | void;
}
