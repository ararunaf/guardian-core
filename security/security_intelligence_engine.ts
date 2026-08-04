/**
 * Guardian Security Intelligence Engine (GAI-07).
 * Consolidates security indicators, vulnerabilities, auth/authz/tenant/RLS/providers/APIs/deps/secrets.
 * Deterministic rules only. No generative AI. No auto-remediation.
 */

import { ChangeIntelligenceEngine } from "../change/change_intelligence_engine";
import { KnowledgeDiagnosisEngine } from "../diagnosis/knowledge_diagnosis_engine";
import { GuardianEventBus } from "../events/event_bus";
import { PerformancePredictionEngine } from "../prediction/performance_prediction_engine";
import { RegressionIntelligenceEngine } from "../regression/regression_intelligence_engine";
import { RootCauseAnalysisEngine } from "../root_cause/root_cause_engine";
import { EngineeringTimeline } from "../timeline/timeline_service";
import type { GuardianChangeContext } from "../types/change_types";
import type { GuardianDiagnosis } from "../types/diagnosis_types";
import type {
  GuardianSecurityAssessment,
  GuardianSecurityIndicator,
  GuardianSecuritySeverity,
  GuardianSecurityTrendPoint,
  GuardianSecurityVulnerability,
  SecurityIntelligenceResult,
} from "../types/security_types";
import { EMPTY_SECURITY_PREPARED_SLOT } from "../types/security_types";
import type { GuardianRegressionAnalysis } from "../types/regression_types";
import type { GuardianRootCause } from "../types/root_cause_types";

export const SECURITY_INTELLIGENCE_ENGINE_ID =
  "guardian-security-intelligence-engine" as const;

export const SECURITY_SCAN_STARTED_EVENT =
  "guardian.security.scan.started" as const;
export const SECURITY_ASSESSMENT_GENERATED_EVENT =
  "guardian.security.assessment.generated" as const;

export type SecurityIntelligenceEngineStatus = "inactive" | "ready";

let assessmentSeq = 0;

function nextAssessmentId(): string {
  assessmentSeq += 1;
  return `guardian-sec-assessment-${Date.now()}-${assessmentSeq}`;
}

function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

function unique(values: readonly (string | null | undefined)[]): string[] {
  return [...new Set(values.filter((v): v is string => Boolean(v && v.trim())))];
}

function severityFromRisk(risk: number): GuardianSecuritySeverity {
  if (risk >= 0.85) return "critical";
  if (risk >= 0.7) return "high";
  if (risk >= 0.5) return "medium";
  if (risk >= 0.3) return "low";
  return "info";
}

function indicator(
  domain: GuardianSecurityIndicator["domain"],
  risk: number,
  evidence: readonly string[],
): GuardianSecurityIndicator {
  return {
    domain,
    label: domain.replace(/_/g, " "),
    score: Number(clamp(1 - risk).toFixed(4)),
    risk: Number(clamp(risk).toFixed(4)),
    severity: severityFromRisk(risk),
    evidence,
  };
}

function buildIndicators(
  regression: GuardianRegressionAnalysis,
  change: GuardianChangeContext,
  rootCause: GuardianRootCause,
  diagnosis: GuardianDiagnosis | null,
): GuardianSecurityIndicator[] {
  const reg = regression.regressionScore;
  const techBoost =
    regression.technicalRisk === "critical"
      ? 0.22
      : regression.technicalRisk === "high"
        ? 0.14
        : 0.05;
  const tenantPressure = Math.min(0.35, change.tenantScope.length * 0.08);
  const providerPressure = Math.min(0.4, change.providers.length * 0.07);
  const modulePressure = Math.min(0.35, change.modules.length * 0.05);
  const knowledgePressure = Math.min(
    0.3,
    (diagnosis?.knowledgeSources.length ?? 0) * 0.05 + (diagnosis ? 0.08 : 0.04),
  );
  const confGap = 1 - rootCause.confidenceScore;

  const authenticationRisk = clamp(reg * 0.35 + techBoost * 0.4 + confGap * 0.2);
  const authorizationRisk = clamp(reg * 0.3 + providerPressure * 0.5 + techBoost * 0.25);
  const tenantIsolationRisk = clamp(tenantPressure * 0.7 + reg * 0.25 + techBoost * 0.2);
  const rlsRisk = clamp(tenantIsolationRisk * 0.85 + knowledgePressure * 0.15);
  const providerRisk = clamp(providerPressure * 0.75 + reg * 0.2);
  const apiRisk = clamp(modulePressure * 0.5 + providerPressure * 0.3 + reg * 0.2);
  const dependencyRisk = clamp(modulePressure * 0.45 + knowledgePressure * 0.35);
  const secretsRisk = clamp(0.12 + confGap * 0.25 + (regression.technicalRisk === "critical" ? 0.2 : 0.05));

  return [
    indicator("authentication", authenticationRisk, [
      `auth_risk_from_regression=${reg}`,
      "deterministic_auth_rules",
    ]),
    indicator("authorization", authorizationRisk, [
      `providers=${change.providers.length}`,
      "deterministic_authz_rules",
    ]),
    indicator("tenant_isolation", tenantIsolationRisk, [
      `tenant_scope=${change.tenantScope.length}`,
      "multi_tenant_isolation_check",
    ]),
    indicator("rls", rlsRisk, ["rls_policy_observational", "tenant_bound_rls"]),
    indicator("providers", providerRisk, change.providers.map((p) => `provider:${p}`)),
    indicator("apis", apiRisk, ["api_surface_from_modules", ...change.modules.slice(0, 5)]),
    indicator("dependencies", dependencyRisk, ["dependency_surface_observational"]),
    indicator("secrets", secretsRisk, ["secrets_config_observational", "no_secret_execution"]),
    indicator("configuration", clamp(secretsRisk * 0.9), ["configuration_read_only"]),
    indicator("ukal", clamp(knowledgePressure * 0.6), ["ukal_path_observational"]),
    indicator("corporate_rag", clamp(knowledgePressure * 0.55), [
      "corporate_rag_path_observational",
    ]),
  ];
}

function buildVulnerabilities(
  indicators: readonly GuardianSecurityIndicator[],
): GuardianSecurityVulnerability[] {
  return indicators
    .filter((i) => i.risk >= 0.45)
    .map((i, index) => ({
      vulnerabilityId: `vuln-${i.domain}-${index + 1}`,
      domain: i.domain,
      title: `Potential ${i.label} exposure`,
      severity: i.severity,
      score: i.risk,
      evidence: i.evidence,
    }));
}

class SecurityIntelligenceEngineImpl {
  readonly id = SECURITY_INTELLIGENCE_ENGINE_ID;
  private status: SecurityIntelligenceEngineStatus = "inactive";
  private lastResult: SecurityIntelligenceResult | null = null;
  private analysisCount = 0;
  private history: GuardianSecurityTrendPoint[] = [];

  initialize(): void {
    RegressionIntelligenceEngine.initialize();
    ChangeIntelligenceEngine.initialize();
    RootCauseAnalysisEngine.initialize();
    KnowledgeDiagnosisEngine.initialize();
    PerformancePredictionEngine.initialize();
    EngineeringTimeline.initialize();
    this.status = "ready";
  }

  getStatus(): SecurityIntelligenceEngineStatus {
    return this.status;
  }

  isReady(): boolean {
    return this.status === "ready";
  }

  getLastResult(): SecurityIntelligenceResult | null {
    return this.lastResult;
  }

  getLastAssessment(): GuardianSecurityAssessment | null {
    return this.lastResult?.assessment ?? null;
  }

  getAnalysisCount(): number {
    return this.analysisCount;
  }

  analyzeFromRegression(regression: GuardianRegressionAnalysis): SecurityIntelligenceResult {
    if (this.status !== "ready") {
      this.initialize();
    }

    if (!regression?.regressionId) {
      throw new Error(
        "Security Intelligence requires Regression Analysis. Bypass is forbidden.",
      );
    }

    const change = ChangeIntelligenceEngine.getLastChangeContext();
    if (!change?.changeId || change.changeId !== regression.changeId) {
      throw new Error(
        "Security Intelligence requires Change Context from Change Intelligence matching the regression.",
      );
    }

    const rootCause = RootCauseAnalysisEngine.getLastResult()?.rootCause;
    if (!rootCause?.rootCauseId || rootCause.rootCauseId !== regression.rootCauseId) {
      throw new Error(
        "Security Intelligence requires Root Cause Analysis matching the regression.",
      );
    }

    const diagnosis = KnowledgeDiagnosisEngine.getLastDiagnosis();
    const performancePrediction = PerformancePredictionEngine.getLastPrediction();
    const assessmentId = nextAssessmentId();

    GuardianEventBus.publish(SECURITY_SCAN_STARTED_EVENT, this.id, {
      assessmentId,
      regressionId: regression.regressionId,
      changeId: change.changeId,
      rootCauseId: rootCause.rootCauseId,
    });

    const indicators = buildIndicators(regression, change, rootCause, diagnosis);
    const vulnerabilities = buildVulnerabilities(indicators);
    const criticalVulnerabilities = vulnerabilities.filter(
      (v) => v.severity === "critical" || v.severity === "high",
    );
    const avgRisk =
      indicators.reduce((sum, i) => sum + i.risk, 0) / Math.max(1, indicators.length);
    const securityScore = Number(clamp(1 - avgRisk).toFixed(4));
    const confidence = Number(
      clamp(
        regression.confidence * 0.4 +
          rootCause.confidenceScore * 0.35 +
          Math.min(0.25, indicators.length * 0.02),
      ).toFixed(4),
    );

    const finalEvidence = unique([
      `regression_score=${regression.regressionScore}`,
      `technical_risk=${regression.technicalRisk}`,
      `security_score=${securityScore}`,
      `vulnerabilities=${vulnerabilities.length}`,
      ...indicators.filter((i) => i.risk >= 0.45).flatMap((i) => i.evidence),
      ...(diagnosis?.evidenceChain.items.map((e) => e.statement) ?? []),
    ]);

    const knowledgeReferences = unique([
      ...(diagnosis?.references ?? []),
      ...(diagnosis?.knowledgeSources.map((s) => s.sourceId) ?? []),
      ...regression.evidenceChain,
    ]);

    const auth = indicators.find((i) => i.domain === "authentication")?.risk ?? 0;
    const authz = indicators.find((i) => i.domain === "authorization")?.risk ?? 0;
    const tenant = indicators.find((i) => i.domain === "tenant_isolation")?.risk ?? 0;
    const rls = indicators.find((i) => i.domain === "rls")?.risk ?? 0;
    const providers = indicators.find((i) => i.domain === "providers")?.risk ?? 0;
    const apis = indicators.find((i) => i.domain === "apis")?.risk ?? 0;
    const deps = indicators.find((i) => i.domain === "dependencies")?.risk ?? 0;
    const secrets = indicators.find((i) => i.domain === "secrets")?.risk ?? 0;

    const trendPoint: GuardianSecurityTrendPoint = {
      timestamp: new Date().toISOString(),
      securityScore,
      threatScore: null,
      complianceScore: null,
    };
    this.history = [...this.history.slice(-49), trendPoint];

    GuardianEventBus.publish(SECURITY_ASSESSMENT_GENERATED_EVENT, this.id, {
      assessmentId,
      securityScore,
      confidence,
      vulnerabilityCount: vulnerabilities.length,
      criticalCount: criticalVulnerabilities.length,
    });

    const assessment: GuardianSecurityAssessment = {
      assessmentId,
      timestamp: new Date().toISOString(),
      confidence,
      evidenceChain: finalEvidence,
      knowledgeReferences,
      relatedIncidents: unique([
        ...regression.similarIncidents,
        ...regression.regressionHistory.map((h) => h.incidentId),
      ]),
      relatedRootCauses: [rootCause.rootCauseId],
      relatedChanges: [change.changeId],
      relatedRegression: [regression.regressionId],
      relatedPerformance: performancePrediction
        ? [performancePrediction.predictionId]
        : [],
      severity: severityFromRisk(avgRisk),
      status: "assessed",
      securityScore,
      indicators,
      vulnerabilities,
      criticalVulnerabilities,
      authenticationRisk: Number(auth.toFixed(4)),
      authorizationRisk: Number(authz.toFixed(4)),
      tenantIsolationRisk: Number(tenant.toFixed(4)),
      rlsRisk: Number(rls.toFixed(4)),
      providerRisk: Number(providers.toFixed(4)),
      apiRisk: Number(apis.toFixed(4)),
      dependencyRisk: Number(deps.toFixed(4)),
      secretsRisk: Number(secrets.toFixed(4)),
      trends: [...this.history],
      preparedPatch: EMPTY_SECURITY_PREPARED_SLOT,
      preparedTests: EMPTY_SECURITY_PREPARED_SLOT,
      preparedDeployment: EMPTY_SECURITY_PREPARED_SLOT,
      autoRemediation: false,
      codeExecution: false,
      generativeAi: false,
      fileMutation: false,
    };

    const result: SecurityIntelligenceResult = {
      assessment,
      regressionId: regression.regressionId,
      changeId: change.changeId,
      rootCauseId: rootCause.rootCauseId,
    };
    this.lastResult = result;
    this.analysisCount += 1;
    return result;
  }

  analyzeFromRootCause(rootCause: GuardianRootCause): SecurityIntelligenceResult {
    const regressionResult =
      RegressionIntelligenceEngine.analyzeFromRootCause(rootCause);
    return this.analyzeFromRegression(regressionResult.regression);
  }

  reset(): void {
    this.status = "inactive";
    this.lastResult = null;
    this.analysisCount = 0;
    this.history = [];
    assessmentSeq = 0;
  }
}

export const SecurityIntelligenceEngine = new SecurityIntelligenceEngineImpl();

export function createSecurityIntelligenceEngine(): SecurityIntelligenceEngineImpl {
  return new SecurityIntelligenceEngineImpl();
}
