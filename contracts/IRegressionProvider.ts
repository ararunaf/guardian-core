/**
 * Guardian AI - IRegressionProvider contract (GAI-05).
 * Estimates regression risk from Change Context + Root Cause Analysis.
 * Never bypasses Change Intelligence. No corrective actions.
 */

import type { GuardianChangeContext } from "../types/change_types";
import type { RegressionIntelligenceResult } from "../types/regression_types";
import type { GuardianRootCause } from "../types/root_cause_types";

export interface IRegressionProvider {
  readonly id: "regression-provider";
  readonly ready: boolean;
  readonly name: string;
  readonly operational: boolean;
  readonly capabilities: {
    readonly analyzeRegression: true;
    readonly requiresChangeContext: true;
    readonly requiresRootCause: true;
    readonly codeExecution: false;
    readonly autoPatch: false;
    readonly autoDeploy: false;
    readonly autoTest: false;
  };
  analyze(rootCause: GuardianRootCause): RegressionIntelligenceResult;
  analyzeFromChange(
    changeContext: GuardianChangeContext,
    rootCause: GuardianRootCause,
  ): RegressionIntelligenceResult;
}
