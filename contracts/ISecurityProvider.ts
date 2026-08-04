/**
 * Guardian AI - ISecurityProvider contract (GAI-07).
 * Security Intelligence access. No auto-remediation. No code execution.
 */

import type { SecurityIntelligenceResult } from "../types/security_types";
import type { GuardianRegressionAnalysis } from "../types/regression_types";
import type { GuardianRootCause } from "../types/root_cause_types";

export interface ISecurityProvider {
  readonly id: "security-provider";
  readonly ready: boolean;
  readonly name: string;
  readonly operational: boolean;
  readonly capabilities: {
    readonly analyzeSecurity: true;
    readonly requiresRegression: true;
    readonly requiresChangeContext: true;
    readonly requiresRootCause: true;
    readonly autoRemediation: false;
    readonly codeExecution: false;
    readonly autoPatch: false;
    readonly autoDeploy: false;
    readonly generativeAi: false;
    readonly fileMutation: false;
  };
  analyze(regression: GuardianRegressionAnalysis): SecurityIntelligenceResult;
  analyzeFromRootCause(rootCause: GuardianRootCause): SecurityIntelligenceResult;
}
