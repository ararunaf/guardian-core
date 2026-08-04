/**
 * Guardian AI - ISessionService contract (GAI-02).
 * Interface only. Engineering session surface.
 */

import type {
  EngineeringSession,
  EngineeringSessionOpenInput,
} from "../types/session_types";

export interface ISessionService {
  readonly id: "session-service";
  readonly ready: boolean;
  readonly name: string;
  open(input?: EngineeringSessionOpenInput): EngineeringSession;
  close(sessionId?: string): EngineeringSession | null;
  current(): EngineeringSession | null;
  list(): readonly EngineeringSession[];
  get(sessionId: string): EngineeringSession | null;
}
