/**
 * Guardian AI - IRootCauseProvider contract (GAI-04).
 * Investigative RCA only. Requires Knowledge Diagnosis input.
 * Never consults Knowledge Platform directly. No corrective actions.
 */

import type { GuardianDiagnosis } from "../types/diagnosis_types";
import type { RootCauseAnalysisResult } from "../types/root_cause_types";

export interface IRootCauseProvider {
  readonly id: "root-cause-provider";
  readonly ready: boolean;
  readonly name: string;
  readonly operational: boolean;
  readonly capabilities: {
    readonly analyzeRootCause: true;
    readonly requiresDiagnosis: true;
    readonly codeExecution: false;
    readonly autoPatch: false;
    readonly autoDeploy: false;
    readonly autoTest: false;
  };
  analyze(diagnosis: GuardianDiagnosis): RootCauseAnalysisResult;
}
