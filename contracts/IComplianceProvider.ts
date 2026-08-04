/**
 * Guardian AI - IComplianceProvider contract (GAI-07).
 * Compliance Analysis access. Analysis only — no mutation.
 */

import type {
  ComplianceAnalysisResult,
  GuardianSecurityAssessment,
  GuardianSecurityDashboard,
  GuardianThreatPrediction,
  SecurityGuardianPipelineResult,
} from "../types/security_types";
import type { GuardianRegressionAnalysis } from "../types/regression_types";

export interface IComplianceProvider {
  readonly id: "compliance-provider";
  readonly ready: boolean;
  readonly name: string;
  readonly operational: boolean;
  readonly capabilities: {
    readonly analyzeCompliance: true;
    readonly requiresAssessment: true;
    readonly requiresThreatPrediction: true;
    readonly execution: false;
    readonly autoRemediation: false;
    readonly codeExecution: false;
    readonly generativeAi: false;
    readonly fileMutation: false;
  };
  analyze(
    assessment: GuardianSecurityAssessment,
    threat: GuardianThreatPrediction,
  ): ComplianceAnalysisResult;
  analyzePipeline(regression: GuardianRegressionAnalysis): SecurityGuardianPipelineResult;
  getLastDashboard(): GuardianSecurityDashboard | null;
}