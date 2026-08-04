/**
 * Guardian Event subscriber (GAI-00).
 * Subscription infrastructure only. No active consumers in GAI-00.
 */

import type { GuardianEventType } from "../types";
import { GuardianEventRegistry } from "./event_registry";
import type { GuardianEventHandler, GuardianEventUnsubscribe } from "./types";

type HandlerMap = Map<GuardianEventType, Set<GuardianEventHandler>>;

export const GuardianEventSubscriber = {
  subscribe<TPayload>(
    handlers: HandlerMap,
    type: GuardianEventType,
    handler: GuardianEventHandler<TPayload>,
  ): GuardianEventUnsubscribe {
    if (!GuardianEventRegistry.has(type)) {
      GuardianEventRegistry.registerType(type);
    }

    let set = handlers.get(type);
    if (!set) {
      set = new Set();
      handlers.set(type, set);
    }

    set.add(handler as GuardianEventHandler);
    GuardianEventRegistry.incrementHandlers(type);

    return () => {
      set?.delete(handler as GuardianEventHandler);
      GuardianEventRegistry.decrementHandlers(type);
    };
  },
};
