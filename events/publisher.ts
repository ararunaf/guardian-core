/**
 * Guardian Event publisher (GAI-00).
 * Publishes to in-memory subscribers. No external consumers.
 */

import type { IGuardianEvent } from "../contracts";
import type { GuardianEventType } from "../types";
import { GuardianEventRegistry } from "./event_registry";
import type { GuardianEventHandler } from "./types";

type HandlerMap = Map<GuardianEventType, Set<GuardianEventHandler>>;

let seq = 0;

export function createEventId(): string {
  seq += 1;
  return `guardian-evt-${Date.now()}-${seq}`;
}

export const GuardianEventPublisher = {
  publish<TPayload>(
    handlers: HandlerMap,
    type: GuardianEventType,
    source: string,
    payload: TPayload,
  ): IGuardianEvent<TPayload> {
    if (!GuardianEventRegistry.has(type)) {
      GuardianEventRegistry.registerType(type);
    }

    const event: IGuardianEvent<TPayload> = {
      id: createEventId(),
      type,
      timestamp: new Date().toISOString(),
      source,
      payload,
    };

    const set = handlers.get(type);
    if (set) {
      for (const handler of set) {
        handler(event);
      }
    }

    return event;
  },
};
