/**
 * Guardian Regression Intelligence Engine (GAI-05).
 * Estimates regression risk from Change Context + Root Cause Analysis.
 * Must consume Change Intelligence - never bypasses to analyze commits.
 * Forbidden: patch, auto-heal, tests, deploy, code changes, generative AI.
 */

import { ChangeIntelligenceEngine } from "../change/change_intelligence_engine";
import { IncidentContextBuilder } from "../context/incident_context_builder";
import { CorrelationEngine } from "../correlation/correlation_engine";
import { GuardianEventBus } from "../events/event_bus";
import { EngineeringTimeline } from "../timeline/timeline_service";
import type { GuardianChangeContext } from "../types/change_types";
import type {
  GuardianImpactMap,
  GuardianRegressionAnalysis,
  GuardianRegressionHistoryEntry,
  GuardianRegressionRiskBand,
  GuardianRiskMatrix,
  RegressionIntelligenceResult,
} from "../types/regression_types";
import { EMPTY_REGRESSION_PREPARED_SLOT } from "../types/regression_types";
import type { GuardianRootCause } from "../types/root_cause_types";

export const REGRESSION_INTELLIGENCE_ENGINE_ID =
  "guardian-regression-intelligence-engine" as const;

export const REGRESSION_STARTED_EVENT = "guardian.regression.started" as const;
export const REGRESSION_FINISHED_EVENT = "guardian.regression.finished" as const;
export const REGRESSION_SCORE_CALCULATED_EVENT =
  "guardian.regression.score.calculated" as const;
export const RISK_MATRIX_GENERATED_EVENT =
  "guardian.regression.risk_matrix.generated" as const;
export const CRITICAL_AREAS_IDENTIFIED_EVENT =
  "guardian.regression.critical_areas.identified" as const;
export const REGRESSION_PUBLISHED_EVENT = "guardian.regression.published" as const;

export type RegressionIntelligenceEngineStatus = "inactive" | "ready";

let regressionSeq = 0;

function nextRegressionId(): string {
  regressionSeq += 1;
  return `guardian-regression-${Date.now()}-${regressionSeq}`;
}

function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

function unique(values: readonly (string | null | undefined)[]): string[] {
  return [...new Set(values.filter((v): v is string => Boolean(v && v.trim())))];
}

function bandFromScore(score: number): GuardianRegressionRiskBand {
  if (score >= 0.85) return "critical";
  if (score >= 0.7) return "high";
  if (score >= 0.45) return "medium";
  if (score >= 0.25) return "low";
  return "info";
}

function probabilityBand(probability: number): "low" | "medium" | "high" | "critical" {
  if (probability >= 0.85) return "critical";
  if (probability >= 0.7) return "high";
  if (probability >= 0.45) return "medium";
  return "low";
}

function scoreTechnicalRisk(change: GuardianChangeContext, rootCause: GuardianRootCause): number {
  const providerWeight = Math.min(0.25, change.providers.length * 0.05);
  const moduleWeight = Math.min(0.2, change.modules.length * 0.04);
  const dependencyWeight = Math.min(0.15, change.dependencies.length * 0.02);
  const indicatorWeight = Math.min(0.2, change.riskIndicators.count * 0.03);
  const rcaWeight = rootCause.confidenceScore * 0.25;
  const severityBoost =
    rootCause.riskLevel === "critical" ? 0.15 : rootCause.riskLevel === "high" ? 0.1 : 0.05;
  return clamp(
    providerWeight + moduleWeight + dependencyWeight + indicatorWeight + rcaWeight + severityBoost,
  );
}

function scoreBusinessRisk(change: GuardianChangeContext, rootCause: GuardianRootCause): number {
  const tenantWeight = Math.min(0.3, change.tenantScope.length * 0.1);
  const workspaceWeight = Math.min(0.2, change.workspaces.length * 0.08);
  const cockpitWeight = Math.min(0.15, change.cockpits.length * 0.07);
  const userFacing = rootCause.impactAnalysis.affectedUserFacing ? 0.2 : 0.05;
  const businessFlag = change.businessScope.some((s) => s.includes("business-impact"))
    ? 0.15
    : 0.05;
  return clamp(tenantWeight + workspaceWeight + cockpitWeight + userFacing + businessFlag);
}

function scoreProbability(
  technical: number,
  business: number,
  change: GuardianChangeContext,
  historyCount: number,
): number {
  const recurrenceBoost = Math.min(0.2, historyCount * 0.05);
  const riskBoost = change.riskIndicators.highRisk ? 0.1 : 0;
  return clamp(technical * 0.45 + business * 0.35 + recurrenceBoost + riskBoost);
}

function buildRecommendedTestScope(change: GuardianChangeContext): string[] {
  return unique([
    ...change.modules.map((m) => `module-test:${m}`),
    ...change.providers.map((p) => `provider-test:${p}`),
    ...change.workspaces.map((w) => `workspace-test:${w}`),
    ...change.routes.map((r) => `route-test:${r}`),
    ...change.cockpits.map((c) => `cockpit-test:${c}`),
    change.knowledgeObjects.length ? "knowledge-regression-suite" : null,
  ]);
}

function buildCriticalAreas(
  change: GuardianChangeContext,
  technical: number,
  business: number,
): string[] {
  const areas: string[] = [];
  if (technical >= 0.7) areas.push(...change.providers.map((p) => `critical:provider:${p}`));
  if (business >= 0.7) areas.push(...change.workspaces.map((w) => `critical:workspace:${w}`));
  if (change.riskIndicators.indicators.includes("module_regression_signal")) {
    areas.push(...change.modules.map((m) => `critical:module:${m}`));
  }
  if (change.cockpits.length) areas.push(...change.cockpits.map((c) => `critical:cockpit:${c}`));
  if (change.routes.length) areas.push(...change.routes.map((r) => `critical:route:${r}`));
  if (!areas.length && change.components.length) {
    areas.push(...change.components.slice(0, 3).map((c) => `critical:component:${c}`));
  }
  return unique(areas);
}

function buildHistory(
  change: GuardianChangeContext,
  rootCause: GuardianRootCause,
): GuardianRegressionHistoryEntry[] {
  const context = IncidentContextBuilder.getLastContext();
  const correlation = CorrelationEngine.getLastResult();
  const entries: GuardianRegressionHistoryEntry[] = [
    {
      incidentId: rootCause.incidentId,
      rootCauseId: rootCause.rootCauseId,
      category: rootCause.rootCauseCategory,
      recurrence: false,
      timestamp: rootCause.timestamp,
    },
  ];

  for (const related of change.relatedIncidents) {
    if (related === rootCause.incidentId) continue;
    entries.push({
      incidentId: related,
      rootCauseId: null,
      category: rootCause.rootCauseCategory,
      recurrence: true,
      timestamp: rootCause.timestamp,
    });
  }

  for (const related of correlation?.relatedIncidentIds ?? []) {
    if (entries.some((e) => e.incidentId === related)) continue;
    entries.push({
      incidentId: related,
      rootCauseId: null,
      category: "correlated_history",
      recurrence: true,
      timestamp: rootCause.timestamp,
    });
  }

  return entries;
}

class RegressionIntelligenceEngineImpl {
  readonly id = REGRESSION_INTELLIGENCE_ENGINE_ID;
  private status: RegressionIntelligenceEngineStatus = "inactive";
  private lastResult: RegressionIntelligenceResult | null = null;
  private analysisCount = 0;

  initialize(): void {
    ChangeIntelligenceEngine.initialize();
    IncidentContextBuilder.initialize();
    CorrelationEngine.initialize();
    EngineeringTimeline.initialize();
    this.status = "ready";
  }

  getStatus(): RegressionIntelligenceEngineStatus {
    return this.status;
  }

  isReady(): boolean {
    return this.status === "ready";
  }

  getLastResult(): RegressionIntelligenceResult | null {
    return this.lastResult;
  }

  getLastRegression(): GuardianRegressionAnalysis | null {
    return this.lastResult?.regression ?? null;
  }

  getAnalysisCount(): number {
    return this.analysisCount;
  }

  /**
   * Official Regression Intelligence entrypoint.
   * Requires Root Cause Analysis. Builds Change Context via Change Intelligence first.
   */
  analyzeFromRootCause(rootCause: GuardianRootCause): RegressionIntelligenceResult {
    if (this.status !== "ready") {
      this.initialize();
    }

    if (!rootCause?.rootCauseId) {
      throw new Error(
        "Regression Intelligence requires Root Cause Analysis. Bypass is forbidden.",
      );
    }

    const changeResult = ChangeIntelligenceEngine.analyzeFromRootCause(rootCause);
    return this.analyzeFromChangeContext(changeResult.changeContext, rootCause);
  }

  /**
   * Analyze using an existing Change Context. Still requires matching Root Cause.
   */
  analyzeFromChangeContext(
    changeContext: GuardianChangeContext,
    rootCause: GuardianRootCause,
  ): RegressionIntelligenceResult {
    if (this.status !== "ready") {
      this.initialize();
    }

    if (!changeContext?.changeId) {
      throw new Error(
        "Regression Intelligence requires Change Context from Change Intelligence Engine.",
      );
    }

    if (changeContext.rootCauseId !== rootCause.rootCauseId) {
      throw new Error("Change Context must belong to the provided Root Cause Analysis.");
    }

    const regressionId = nextRegressionId();

    GuardianEventBus.publish(REGRESSION_STARTED_EVENT, this.id, {
      regressionId,
      changeId: changeContext.changeId,
      rootCauseId: rootCause.rootCauseId,
      contextId: changeContext.contextId,
    });

    const history = buildHistory(changeContext, rootCause);
    const technicalScore = scoreTechnicalRisk(changeContext, rootCause);
    const businessScore = scoreBusinessRisk(changeContext, rootCause);
    const probability = scoreProbability(
      technicalScore,
      businessScore,
      changeContext,
      history.filter((h) => h.recurrence).length,
    );
    const regressionScore = clamp(
      technicalScore * 0.4 + businessScore * 0.35 + probability * 0.25,
    );
    const confidence = clamp(
      rootCause.confidenceScore * 0.6 +
        Math.min(0.25, changeContext.riskIndicators.count * 0.03) +
        Math.min(0.15, rootCause.evidenceChain.length * 0.03),
    );

    const technicalRisk = bandFromScore(technicalScore);
    const businessRisk = bandFromScore(businessScore);
    const criticalAreas = buildCriticalAreas(changeContext, technicalScore, businessScore);
    const recommendedTestScope = buildRecommendedTestScope(changeContext);
    const similarIncidents = unique(
      history.filter((h) => h.recurrence).map((h) => h.incidentId),
    );

    GuardianEventBus.publish(REGRESSION_SCORE_CALCULATED_EVENT, this.id, {
      regressionId,
      regressionScore,
      technicalScore,
      businessScore,
      probability,
      confidence,
    });

    const riskMatrix: GuardianRiskMatrix = {
      matrixId: `guardian-risk-matrix-${regressionId}`,
      changeId: changeContext.changeId,
      technicalRisk,
      businessRisk,
      probability,
      regressionScore,
      cells: [
        {
          technicalRisk,
          businessRisk,
          probabilityBand: probabilityBand(probability),
          regressionScore,
        },
      ],
      generatedAt: new Date().toISOString(),
    };

    GuardianEventBus.publish(RISK_MATRIX_GENERATED_EVENT, this.id, {
      regressionId,
      matrixId: riskMatrix.matrixId,
      technicalRisk,
      businessRisk,
      probability,
    });

    GuardianEventBus.publish(CRITICAL_AREAS_IDENTIFIED_EVENT, this.id, {
      regressionId,
      criticalAreas,
      count: criticalAreas.length,
    });

    const impactMap: GuardianImpactMap = {
      mapId: `guardian-impact-map-${regressionId}`,
      changeId: changeContext.changeId,
      components: changeContext.components,
      modules: changeContext.modules,
      providers: changeContext.providers,
      workspaces: changeContext.workspaces,
      tenants: changeContext.tenantScope,
      criticalAreas,
      dependencies: changeContext.dependencies,
    };

    const regression: GuardianRegressionAnalysis = {
      regressionId,
      changeId: changeContext.changeId,
      contextId: changeContext.contextId,
      rootCauseId: rootCause.rootCauseId,
      timestamp: new Date().toISOString(),
      regressionScore: Number(regressionScore.toFixed(4)),
      technicalRisk,
      businessRisk,
      probability: Number(probability.toFixed(4)),
      confidence: Number(confidence.toFixed(4)),
      affectedComponents: changeContext.components,
      affectedModules: changeContext.modules,
      affectedProviders: changeContext.providers,
      affectedWorkspaces: changeContext.workspaces,
      affectedTenants: changeContext.tenantScope,
      criticalAreas,
      regressionHistory: history,
      similarIncidents,
      evidenceChain: rootCause.evidenceChain,
      recommendedTestScope,
      preparedPatch: EMPTY_REGRESSION_PREPARED_SLOT,
      preparedDeployment: EMPTY_REGRESSION_PREPARED_SLOT,
      riskMatrix,
      impactMap,
      status: "scored",
      autoCorrection: false,
      codeExecution: false,
      patchGenerated: false,
      testsExecuted: false,
      deploymentExecuted: false,
    };

    GuardianEventBus.publish(REGRESSION_FINISHED_EVENT, this.id, {
      regressionId,
      status: regression.status,
      regressionScore: regression.regressionScore,
    });

    const published: GuardianRegressionAnalysis = {
      ...regression,
      status: "published",
    };

    GuardianEventBus.publish(REGRESSION_PUBLISHED_EVENT, this.id, {
      regressionId: published.regressionId,
      changeId: published.changeId,
      rootCauseId: published.rootCauseId,
      status: published.status,
      regressionScore: published.regressionScore,
      technicalRisk: published.technicalRisk,
      businessRisk: published.businessRisk,
      probability: published.probability,
    });

    const result: RegressionIntelligenceResult = {
      regression: published,
      changeId: changeContext.changeId,
      rootCauseId: rootCause.rootCauseId,
    };
    this.lastResult = result;
    this.analysisCount += 1;
    return result;
  }

  reset(): void {
    this.status = "inactive";
    this.lastResult = null;
    this.analysisCount = 0;
    regressionSeq = 0;
  }
}

export const RegressionIntelligenceEngine = new RegressionIntelligenceEngineImpl();

export function createRegressionIntelligenceEngine(): RegressionIntelligenceEngineImpl {
  return new RegressionIntelligenceEngineImpl();
}
