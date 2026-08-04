/**
 * Guardian AI - IThreatProvider contract (GAI-07).
 * Threat Prediction access. No execution. No generative AI.
 */

import type {
  GuardianSecurityAssessment,
  ThreatPredictionResult,
} from "../types/security_types";
import type { GuardianRegressionAnalysis } from "../types/regression_types";

export interface IThreatProvider {
  readonly id: "threat-provider";
  readonly ready: boolean;
  readonly name: string;
  readonly operational: boolean;
  readonly capabilities: {
    readonly predictThreats: true;
    readonly requiresAssessment: true;
    readonly requiresRegression: true;
    readonly requiresPerformancePrediction: true;
    readonly requiresKnowledgeDiagnosis: true;
    readonly execution: false;
    readonly autoRemediation: false;
    readonly codeExecution: false;
    readonly generativeAi: false;
  };
  predict(
    assessment: GuardianSecurityAssessment,
    regression: GuardianRegressionAnalysis,
  ): ThreatPredictionResult;
  predictFromRegression(regression: GuardianRegressionAnalysis): ThreatPredictionResult;
}
