/**
 * Guardian Security / Threat / Compliance model types (GAI-07).
 * Deterministic read-only analysis only. No generative AI. No auto-remediation.
 */

import type { GuardianPreparedFutureSlot } from "./hypothesis_types";
import { EMPTY_HYPOTHESIS_PREPARED_SLOT } from "./hypothesis_types";

export type GuardianSecurityStatus =
  | "scanning"
  | "assessed"
  | "threat_predicted"
  | "compliance_validated"
  | "published"
  | "inconclusive";

export type GuardianSecuritySeverity = "critical" | "high" | "medium" | "low" | "info";

export type GuardianSecurityDomain =
  | "authentication"
  | "authorization"
  | "tenant_isolation"
  | "rls"
  | "providers"
  | "apis"
  | "dependencies"
  | "secrets"
  | "configuration"
  | "ukal"
  | "corporate_rag"
  | "composition_root"
  | "navigation"
  | "foundation"
  | "lifecycle"
  | "knowledge_platform"
  | "guardian_architecture";

export type GuardianComplianceCheckId =
  | "ukal_exclusive"
  | "corporate_rag_exclusive"
  | "no_bypass"
  | "composition_root_preserved"
  | "navigation_preserved"
  | "foundation_preserved"
  | "lifecycle_preserved"
  | "enterprise_knowledge_platform_preserved"
  | "guardian_architecture_preserved"
  | "multi_tenant_isolation"
  | "rls_policies";

export interface GuardianSecurityIndicator {
  readonly domain: GuardianSecurityDomain;
  readonly label: string;
  readonly score: number;
  readonly risk: number;
  readonly severity: GuardianSecuritySeverity;
  readonly evidence: readonly string[];
}

export interface GuardianSecurityVulnerability {
  readonly vulnerabilityId: string;
  readonly domain: GuardianSecurityDomain;
  readonly title: string;
  readonly severity: GuardianSecuritySeverity;
  readonly score: number;
  readonly evidence: readonly string[];
}

export interface GuardianThreatScenario {
  readonly scenarioId: string;
  readonly label: string;
  readonly threatScore: number;
  readonly probability: number;
  readonly confidence: number;
  readonly evidence: readonly string[];
}

export interface GuardianComplianceCheck {
  readonly checkId: GuardianComplianceCheckId;
  readonly label: string;
  readonly passed: boolean;
  readonly severity: GuardianSecuritySeverity;
  readonly score: number;
  readonly evidence: readonly string[];
}

export interface GuardianSecurityTrendPoint {
  readonly timestamp: string;
  readonly securityScore: number;
  readonly threatScore: number | null;
  readonly complianceScore: number | null;
}

export interface GuardianSecurityAssessment {
  readonly assessmentId: string;
  readonly timestamp: string;
  readonly confidence: number;
  readonly evidenceChain: readonly string[];
  readonly knowledgeReferences: readonly string[];
  readonly relatedIncidents: readonly string[];
  readonly relatedRootCauses: readonly string[];
  readonly relatedChanges: readonly string[];
  readonly relatedRegression: readonly string[];
  readonly relatedPerformance: readonly string[];
  readonly severity: GuardianSecuritySeverity;
  readonly status: GuardianSecurityStatus;
  readonly securityScore: number;
  readonly indicators: readonly GuardianSecurityIndicator[];
  readonly vulnerabilities: readonly GuardianSecurityVulnerability[];
  readonly criticalVulnerabilities: readonly GuardianSecurityVulnerability[];
  readonly authenticationRisk: number;
  readonly authorizationRisk: number;
  readonly tenantIsolationRisk: number;
  readonly rlsRisk: number;
  readonly providerRisk: number;
  readonly apiRisk: number;
  readonly dependencyRisk: number;
  readonly secretsRisk: number;
  readonly trends: readonly GuardianSecurityTrendPoint[];
  readonly preparedPatch: GuardianPreparedFutureSlot;
  readonly preparedTests: GuardianPreparedFutureSlot;
  readonly preparedDeployment: GuardianPreparedFutureSlot;
  readonly autoRemediation: false;
  readonly codeExecution: false;
  readonly generativeAi: false;
  readonly fileMutation: false;
}

export interface GuardianThreatPrediction {
  readonly predictionId: string;
  readonly assessmentId: string;
  readonly timestamp: string;
  readonly confidence: number;
  readonly evidenceChain: readonly string[];
  readonly knowledgeReferences: readonly string[];
  readonly relatedIncidents: readonly string[];
  readonly relatedRootCauses: readonly string[];
  readonly relatedChanges: readonly string[];
  readonly relatedRegression: readonly string[];
  readonly relatedPerformance: readonly string[];
  readonly severity: GuardianSecuritySeverity;
  readonly status: GuardianSecurityStatus;
  readonly threatScore: number;
  readonly probability: number;
  readonly isolationBreachProbability: number;
  readonly privilegeEscalationProbability: number;
  readonly dataExposureProbability: number;
  readonly changeSecurityImpact: number;
  readonly scenarios: readonly GuardianThreatScenario[];
  readonly preparedPatch: GuardianPreparedFutureSlot;
  readonly preparedTests: GuardianPreparedFutureSlot;
  readonly preparedDeployment: GuardianPreparedFutureSlot;
  readonly autoRemediation: false;
  readonly codeExecution: false;
  readonly generativeAi: false;
  readonly execution: false;
}

export interface GuardianComplianceReport {
  readonly reportId: string;
  readonly assessmentId: string;
  readonly predictionId: string;
  readonly timestamp: string;
  readonly confidence: number;
  readonly evidenceChain: readonly string[];
  readonly knowledgeReferences: readonly string[];
  readonly relatedIncidents: readonly string[];
  readonly relatedRootCauses: readonly string[];
  readonly relatedChanges: readonly string[];
  readonly relatedRegression: readonly string[];
  readonly relatedPerformance: readonly string[];
  readonly severity: GuardianSecuritySeverity;
  readonly status: GuardianSecurityStatus;
  readonly complianceScore: number;
  readonly checks: readonly GuardianComplianceCheck[];
  readonly violations: readonly GuardianComplianceCheck[];
  readonly architectureCompliance: boolean;
  readonly ukalCompliance: boolean;
  readonly corporateRagCompliance: boolean;
  readonly multiTenantValidated: boolean;
  readonly rlsValidated: boolean;
  readonly preparedPatch: GuardianPreparedFutureSlot;
  readonly preparedTests: GuardianPreparedFutureSlot;
  readonly preparedDeployment: GuardianPreparedFutureSlot;
  readonly autoRemediation: false;
  readonly codeExecution: false;
  readonly generativeAi: false;
  readonly bypassDetected: false;
}

export interface GuardianSecurityDashboard {
  readonly dashboardId: string;
  readonly timestamp: string;
  readonly confidence: number;
  readonly evidenceChain: readonly string[];
  readonly knowledgeReferences: readonly string[];
  readonly relatedIncidents: readonly string[];
  readonly relatedRootCauses: readonly string[];
  readonly relatedChanges: readonly string[];
  readonly relatedRegression: readonly string[];
  readonly relatedPerformance: readonly string[];
  readonly severity: GuardianSecuritySeverity;
  readonly status: GuardianSecurityStatus;
  readonly assessment: GuardianSecurityAssessment;
  readonly threat: GuardianThreatPrediction;
  readonly compliance: GuardianComplianceReport;
  readonly securityScore: number;
  readonly threatScore: number;
  readonly complianceScore: number;
  readonly criticalVulnerabilities: readonly GuardianSecurityVulnerability[];
  readonly complianceViolations: readonly GuardianComplianceCheck[];
  readonly architectureCompliance: boolean;
  readonly trends: readonly GuardianSecurityTrendPoint[];
  readonly preparedPatch: GuardianPreparedFutureSlot;
  readonly preparedTests: GuardianPreparedFutureSlot;
  readonly preparedDeployment: GuardianPreparedFutureSlot;
  readonly readOnly: true;
  readonly actionsEnabled: false;
  readonly autoRemediation: false;
  readonly codeExecution: false;
  readonly generativeAi: false;
}

export const EMPTY_SECURITY_PREPARED_SLOT: GuardianPreparedFutureSlot =
  EMPTY_HYPOTHESIS_PREPARED_SLOT;

export const SECURITY_COMPLIANCE_CHECK_IDS: readonly GuardianComplianceCheckId[] = [
  "ukal_exclusive",
  "corporate_rag_exclusive",
  "no_bypass",
  "composition_root_preserved",
  "navigation_preserved",
  "foundation_preserved",
  "lifecycle_preserved",
  "enterprise_knowledge_platform_preserved",
  "guardian_architecture_preserved",
  "multi_tenant_isolation",
  "rls_policies",
] as const;

export interface SecurityIntelligenceResult {
  readonly assessment: GuardianSecurityAssessment;
  readonly regressionId: string;
  readonly changeId: string;
  readonly rootCauseId: string;
}

export interface ThreatPredictionResult {
  readonly prediction: GuardianThreatPrediction;
  readonly assessmentId: string;
  readonly regressionId: string;
}

export interface ComplianceAnalysisResult {
  readonly report: GuardianComplianceReport;
  readonly assessmentId: string;
  readonly predictionId: string;
}

export interface SecurityGuardianPipelineResult {
  readonly assessment: GuardianSecurityAssessment;
  readonly threat: GuardianThreatPrediction;
  readonly compliance: GuardianComplianceReport;
  readonly dashboard: GuardianSecurityDashboard;
}
