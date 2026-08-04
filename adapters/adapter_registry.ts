/**
 * Guardian Adapter Registry (GAI-08A).
 * Product-agnostic registry. Dashboard reads adapters from here - never SuperContab directly.
 */

import type { GuardianAdapterDescriptor } from "./base_adapter";
import { GuardianEventBus } from "../events/event_bus";

const adapters = new Map<string, GuardianAdapterDescriptor>();
let boundAdapterId: string | null = null;

export const GuardianAdapterRegistry = {
  register(adapter: GuardianAdapterDescriptor): void {
    adapters.set(adapter.id, adapter);
  },

  bind(adapterId: string): GuardianAdapterDescriptor | null {
    const adapter = adapters.get(adapterId) ?? null;
    if (!adapter) return null;
    boundAdapterId = adapterId;
    GuardianEventBus.publish("guardian.adapter.bound", "guardian-adapter-registry", {
      adapterId,
      productId: adapter.productId,
    });
    return adapter;
  },

  getBound(): GuardianAdapterDescriptor | null {
    if (!boundAdapterId) return null;
    return adapters.get(boundAdapterId) ?? null;
  },

  get(id: string): GuardianAdapterDescriptor | null {
    return adapters.get(id) ?? null;
  },

  list(): readonly GuardianAdapterDescriptor[] {
    return [...adapters.values()];
  },

  status(): "ready" | "unbound" | "empty" {
    if (adapters.size === 0) return "empty";
    if (!boundAdapterId) return "unbound";
    return "ready";
  },

  reset(): void {
    adapters.clear();
    boundAdapterId = null;
  },
};