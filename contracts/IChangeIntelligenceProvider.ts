/**
 * Guardian AI - IChangeIntelligenceProvider contract (GAI-05).
 * Builds Change Context from Root Cause Analysis only.
 * Never analyzes commits directly. No corrective actions.
 */

import type { ChangeIntelligenceResult } from "../types/change_types";
import type { GuardianRootCause } from "../types/root_cause_types";

export interface IChangeIntelligenceProvider {
  readonly id: "change-intelligence-provider";
  readonly ready: boolean;
  readonly name: string;
  readonly operational: boolean;
  readonly capabilities: {
    readonly analyzeChange: true;
    readonly requiresRootCause: true;
    readonly codeExecution: false;
    readonly autoPatch: false;
    readonly autoDeploy: false;
    readonly autoTest: false;
  };
  analyze(rootCause: GuardianRootCause): ChangeIntelligenceResult;
}
