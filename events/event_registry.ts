/**
 * Guardian Event type registry (GAI-00).
 * Registration of event types only. No consumers.
 */

import type { GuardianEventType } from "../types";
import { GUARDIAN_EVENT_TYPES, type GuardianEventRegistration } from "./types";

const registeredTypes = new Set<GuardianEventType>(GUARDIAN_EVENT_TYPES);
const handlerCounts = new Map<GuardianEventType, number>();

export const GuardianEventRegistry = {
  listTypes(): readonly GuardianEventType[] {
    return [...registeredTypes];
  },

  has(type: GuardianEventType): boolean {
    return registeredTypes.has(type);
  },

  registerType(type: GuardianEventType): void {
    registeredTypes.add(type);
    if (!handlerCounts.has(type)) {
      handlerCounts.set(type, 0);
    }
  },

  incrementHandlers(type: GuardianEventType): void {
    handlerCounts.set(type, (handlerCounts.get(type) ?? 0) + 1);
  },

  decrementHandlers(type: GuardianEventType): void {
    const current = handlerCounts.get(type) ?? 0;
    handlerCounts.set(type, Math.max(0, current - 1));
  },

  describe(): readonly GuardianEventRegistration[] {
    return this.listTypes().map((type) => ({
      type,
      handlerCount: handlerCounts.get(type) ?? 0,
    }));
  },

  reset(): void {
    registeredTypes.clear();
    for (const type of GUARDIAN_EVENT_TYPES) {
      registeredTypes.add(type);
    }
    handlerCounts.clear();
  },
};
