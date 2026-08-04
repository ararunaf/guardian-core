/**
 * Guardian AI - IHypothesisProvider contract (GAI-04).
 * Product-agnostic. Investigation support only. No corrective actions.
 */

import type { GuardianDiagnosis } from "../types/diagnosis_types";
import type { GuardianHypothesisSet } from "../types/hypothesis_types";

export interface IHypothesisProvider {
  readonly id: "hypothesis-provider";
  readonly ready: boolean;
  readonly name: string;
  readonly operational: boolean;
  readonly capabilities: {
    readonly generateHypotheses: true;
    readonly rankHypotheses: true;
    readonly codeExecution: false;
    readonly autoPatch: false;
    readonly autoDeploy: false;
  };
  generate(diagnosis: GuardianDiagnosis): GuardianHypothesisSet;
}
