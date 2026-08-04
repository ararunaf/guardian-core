/**
 * Engineering Session model types (GAI-02).
 * Observability session envelope. No autonomous actions.
 */

export type EngineeringSessionStatus = "open" | "closed";

export interface EngineeringSession {
  readonly sessionId: string;
  readonly start: string;
  readonly finish: string | null;
  readonly duration: number | null;
  readonly events: number;
  readonly incidents: number;
  readonly runtime: string;
  readonly providers: readonly string[];
  readonly health: string;
  readonly workspace: string | null;
  readonly tenant: string | null;
  readonly company: string | null;
  readonly correlationId: string;
  readonly status: EngineeringSessionStatus;
}

export interface EngineeringSessionOpenInput {
  readonly runtime?: string;
  readonly providers?: readonly string[];
  readonly health?: string;
  readonly workspace?: string | null;
  readonly tenant?: string | null;
  readonly company?: string | null;
  readonly correlationId?: string;
}
