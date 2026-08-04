/**
 * Guardian Event Bus (GAI-00).
 * Structural pub/sub infrastructure. No operational consumers.
 */

import type { IGuardianEvent } from "../contracts";
import type { GuardianEventType } from "../types";
import { GuardianEventPublisher } from "./publisher";
import { GuardianEventSubscriber } from "./subscriber";
import { GuardianEventRegistry } from "./event_registry";
import type { GuardianEventHandler, GuardianEventUnsubscribe } from "./types";

type HandlerMap = Map<GuardianEventType, Set<GuardianEventHandler>>;

class GuardianEventBusImpl {
  private handlers: HandlerMap = new Map();

  publish<TPayload>(
    type: GuardianEventType,
    source: string,
    payload: TPayload,
  ): IGuardianEvent<TPayload> {
    return GuardianEventPublisher.publish(this.handlers, type, source, payload);
  }

  subscribe<TPayload>(
    type: GuardianEventType,
    handler: GuardianEventHandler<TPayload>,
  ): GuardianEventUnsubscribe {
    return GuardianEventSubscriber.subscribe(this.handlers, type, handler);
  }

  listTypes(): readonly GuardianEventType[] {
    return GuardianEventRegistry.listTypes();
  }

  reset(): void {
    this.handlers.clear();
    GuardianEventRegistry.reset();
  }
}

export const GuardianEventBus = new GuardianEventBusImpl();
