/**
 * Guardian Runtime (GAI-02).
 * Records incidents from the Event Bus and publishes lifecycle events to Timeline.
 * No processing. No AI. No diagnosis.
 */

import type { IGuardianContext, IGuardianRuntime } from "../contracts";
import type { IGuardianEvent } from "../contracts";
import { GuardianEventBus } from "../events/event_bus";
import type { GuardianEventUnsubscribe } from "../events/types";
import { EngineeringSessionService } from "../observability/session_service";
import { EngineeringTimeline } from "../timeline/timeline_service";
import type { GuardianIncident } from "../types/incident_types";
import type { GuardianStatus } from "../types";
import { createInitialRuntimeState, type GuardianRuntimeRecentEvent, type GuardianRuntimeState } from "./runtime_state";

class GuardianRuntimeImpl implements IGuardianRuntime {
  readonly id = "guardian-runtime" as const;
  private state: GuardianRuntimeState = createInitialRuntimeState();
  private unsubscribe: GuardianEventUnsubscribe | null = null;
  private unsubscribeTimelineActivity: GuardianEventUnsubscribe | null = null;

  get status(): GuardianStatus {
    return this.state.status;
  }

  initialize(_context: IGuardianContext): void {
    this.detach();
    EngineeringTimeline.initialize();

    this.state = {
      ...createInitialRuntimeState(),
      status: "ready",
      initialized: true,
      startedAt: new Date().toISOString(),
      incidentEngineReady: true,
    };

    EngineeringSessionService.open({
      runtime: this.id,
      health: "ready",
    });

    GuardianEventBus.publish("guardian.started", this.id, {
      runtimeId: this.id,
      startedAt: this.state.startedAt,
    });

    GuardianEventBus.publish("guardian.runtime.started", this.id, {
      runtimeId: this.id,
      startedAt: this.state.startedAt,
    });

    GuardianEventBus.publish("guardian.lifecycle.initialized", this.id, {
      runtimeId: this.id,
    });

    GuardianEventBus.publish("guardian.lifecycle.ready", this.id, {
      runtimeId: this.id,
    });

    this.unsubscribe = GuardianEventBus.subscribe<GuardianIncident>(
      "guardian.incident.detected",
      (event) => {
        this.recordIncidentFromEvent(event);
      },
    );

    this.unsubscribeTimelineActivity = GuardianEventBus.subscribe(
      "guardian.timeline.recorded",
      () => {
        EngineeringSessionService.recordActivity("event");
      },
    );
  }

  getStatus(): GuardianStatus {
    return this.state.status;
  }

  getState(): Readonly<GuardianRuntimeState> {
    return this.state;
  }

  listIncidents(): readonly GuardianIncident[] {
    return this.state.incidents;
  }

  getIncidentCount(): number {
    return this.state.incidents.length;
  }

  listRecentEvents(): readonly GuardianRuntimeRecentEvent[] {
    return this.state.recentEvents;
  }

  /** Internal Event Bus consumer only. No diagnosis or recovery. */
  private recordIncidentFromEvent(event: IGuardianEvent<GuardianIncident>): void {
    const incident: GuardianIncident = {
      ...event.payload,
      status: "recorded",
    };

    this.state = {
      ...this.state,
      incidents: [incident, ...this.state.incidents].slice(0, 200),
      recentEvents: [
        {
          eventId: event.id,
          type: event.type,
          timestamp: event.timestamp,
          incidentId: incident.incidentId,
        },
        ...this.state.recentEvents,
      ].slice(0, 50),
    };

    EngineeringSessionService.recordActivity("incident");

    GuardianEventBus.publish(
      "guardian.runtime.incident_recorded",
      this.id,
      { incidentId: incident.incidentId, eventId: event.id },
    );
  }

  shutdown(): void {
    if (this.state.initialized) {
      GuardianEventBus.publish("guardian.runtime.stopped", this.id, {
        runtimeId: this.id,
        stoppedAt: new Date().toISOString(),
      });
      GuardianEventBus.publish("guardian.stopped", this.id, {
        runtimeId: this.id,
        stoppedAt: new Date().toISOString(),
      });
      EngineeringSessionService.close();
    }

    this.detach();
    this.state = createInitialRuntimeState();
  }

  private detach(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    if (this.unsubscribeTimelineActivity) {
      this.unsubscribeTimelineActivity();
      this.unsubscribeTimelineActivity = null;
    }
  }
}

/** Singleton runtime. */
export const GuardianRuntime: IGuardianRuntime & {
  getState(): Readonly<GuardianRuntimeState>;
  listIncidents(): readonly GuardianIncident[];
  getIncidentCount(): number;
  listRecentEvents(): readonly GuardianRuntimeRecentEvent[];
} = new GuardianRuntimeImpl();

export function createGuardianRuntime(): IGuardianRuntime & {
  getState(): Readonly<GuardianRuntimeState>;
  listIncidents(): readonly GuardianIncident[];
  getIncidentCount(): number;
  listRecentEvents(): readonly GuardianRuntimeRecentEvent[];
} {
  return new GuardianRuntimeImpl();
}
