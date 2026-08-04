/**
 * Engineering Session Service (GAI-02).
 * Tracks observability sessions. No autonomous actions.
 */

import type { ISessionService } from "../contracts/ISessionService";
import type {
  EngineeringSession,
  EngineeringSessionOpenInput,
} from "../types/session_types";

let sessionSeq = 0;

function createSessionId(): string {
  sessionSeq += 1;
  return `guardian-sess-${Date.now()}-${sessionSeq}`;
}

function createCorrelationId(): string {
  return `guardian-corr-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

class SessionServiceImpl implements ISessionService {
  readonly id = "session-service" as const;
  readonly name = "Engineering Session Service";
  readonly ready = true;
  private sessions: EngineeringSession[] = [];
  private currentSessionId: string | null = null;

  open(input: EngineeringSessionOpenInput = {}): EngineeringSession {
    if (this.currentSessionId) {
      this.close(this.currentSessionId);
    }

    const session: EngineeringSession = {
      sessionId: createSessionId(),
      start: new Date().toISOString(),
      finish: null,
      duration: null,
      events: 0,
      incidents: 0,
      runtime: input.runtime ?? "guardian-runtime",
      providers: input.providers ?? [],
      health: input.health ?? "unknown",
      workspace: input.workspace ?? null,
      tenant: input.tenant ?? null,
      company: input.company ?? null,
      correlationId: input.correlationId ?? createCorrelationId(),
      status: "open",
    };

    this.sessions = [session, ...this.sessions].slice(0, 200);
    this.currentSessionId = session.sessionId;
    return session;
  }

  close(sessionId?: string): EngineeringSession | null {
    const id = sessionId ?? this.currentSessionId;
    if (!id) return null;

    const index = this.sessions.findIndex((s) => s.sessionId === id);
    if (index < 0) return null;

    const current = this.sessions[index];
    if (current.status === "closed") return current;

    const finish = new Date().toISOString();
    const duration = Math.max(
      0,
      new Date(finish).getTime() - new Date(current.start).getTime(),
    );

    const closed: EngineeringSession = {
      ...current,
      finish,
      duration,
      status: "closed",
    };

    this.sessions = [
      ...this.sessions.slice(0, index),
      closed,
      ...this.sessions.slice(index + 1),
    ];

    if (this.currentSessionId === id) {
      this.currentSessionId = null;
    }

    return closed;
  }

  current(): EngineeringSession | null {
    if (!this.currentSessionId) return null;
    return this.get(this.currentSessionId);
  }

  list(): readonly EngineeringSession[] {
    return this.sessions;
  }

  get(sessionId: string): EngineeringSession | null {
    return this.sessions.find((s) => s.sessionId === sessionId) ?? null;
  }

  /** Increment counters for the open session. Infrastructure only. */
  recordActivity(kind: "event" | "incident"): void {
    if (!this.currentSessionId) return;
    const index = this.sessions.findIndex((s) => s.sessionId === this.currentSessionId);
    if (index < 0) return;
    const current = this.sessions[index];
    if (current.status !== "open") return;

    const updated: EngineeringSession = {
      ...current,
      events: kind === "event" ? current.events + 1 : current.events,
      incidents: kind === "incident" ? current.incidents + 1 : current.incidents,
    };

    this.sessions = [
      ...this.sessions.slice(0, index),
      updated,
      ...this.sessions.slice(index + 1),
    ];
  }

  updateHealth(health: string): void {
    if (!this.currentSessionId) return;
    const index = this.sessions.findIndex((s) => s.sessionId === this.currentSessionId);
    if (index < 0) return;
    const current = this.sessions[index];
    this.sessions = [
      ...this.sessions.slice(0, index),
      { ...current, health },
      ...this.sessions.slice(index + 1),
    ];
  }

  reset(): void {
    this.sessions = [];
    this.currentSessionId = null;
  }
}

export const EngineeringSessionService: ISessionService & {
  recordActivity(kind: "event" | "incident"): void;
  updateHealth(health: string): void;
  reset(): void;
} = new SessionServiceImpl();

export function createSessionService(): ISessionService & {
  recordActivity(kind: "event" | "incident"): void;
  updateHealth(health: string): void;
  reset(): void;
} {
  return new SessionServiceImpl();
}
