/**
 * Guardian Change Intelligence Engine (GAI-05).
 * Analyzes technical change impact from Root Cause Analysis.
 * Must receive RCA - never analyzes commits/files without Change Intelligence path.
 * Forbidden: patch, auto-heal, tests, deploy, code changes, generative AI.
 */

import { IncidentContextBuilder } from "../context/incident_context_builder";
import { CorrelationEngine } from "../correlation/correlation_engine";
import { KnowledgeDiagnosisEngine } from "../diagnosis/knowledge_diagnosis_engine";
import { GuardianEventBus } from "../events/event_bus";
import { EngineeringTimeline } from "../timeline/timeline_service";
import type {
  ChangeIntelligenceResult,
  GuardianChangeContext,
  GuardianChangeRiskIndicator,
} from "../types/change_types";
import { EMPTY_CHANGE_PREPARED_SLOT } from "../types/change_types";
import type { GuardianRootCause } from "../types/root_cause_types";

export const CHANGE_INTELLIGENCE_ENGINE_ID = "guardian-change-intelligence-engine" as const;

export const CHANGE_DETECTED_EVENT = "guardian.change.detected" as const;
export const CHANGE_CONTEXT_BUILT_EVENT = "guardian.change.context.built" as const;

export type ChangeIntelligenceEngineStatus = "inactive" | "ready";

let changeSeq = 0;

function nextChangeId(): string {
  changeSeq += 1;
  return `guardian-change-${Date.now()}-${changeSeq}`;
}

function unique(values: readonly (string | null | undefined)[]): string[] {
  return [...new Set(values.filter((v): v is string => Boolean(v && v.trim())))];
}

function deriveCockpits(modules: readonly string[], workspaces: readonly string[]): string[] {
  const cockpits: string[] = [];
  for (const module of modules) {
    if (module.includes("cockpit") || module.includes("dashboard")) {
      cockpits.push(module);
    }
  }
  for (const workspace of workspaces) {
    if (workspace.includes("cockpit")) cockpits.push(workspace);
  }
  return unique(cockpits);
}

function deriveRoutes(modules: readonly string[], components: readonly string[]): string[] {
  const routes: string[] = [];
  for (const item of [...modules, ...components]) {
    if (item.includes("route") || item.includes("navigation") || item.includes("/")) {
      routes.push(item.startsWith("/") ? item : `/${item.replace(/\./g, "/")}`);
    }
  }
  return unique(routes);
}

function deriveKnowledgeObjects(
  diagnosisRefs: readonly string[],
  evidenceIds: readonly string[],
): string[] {
  return unique([...diagnosisRefs, ...evidenceIds.map((id) => `evidence:${id}`)]);
}

function deriveDependencies(
  providers: readonly string[],
  modules: readonly string[],
  components: readonly string[],
): string[] {
  const deps: string[] = [];
  for (const provider of providers) deps.push(`provider:${provider}`);
  for (const module of modules) deps.push(`module:${module}`);
  for (const component of components) deps.push(`component:${component}`);
  return unique(deps);
}

function deriveRiskIndicators(input: {
  providers: readonly string[];
  workspaces: readonly string[];
  cockpits: readonly string[];
  routes: readonly string[];
  contexts: readonly string[];
  knowledgeObjects: readonly string[];
  category: string;
  severity: string;
  tenants: readonly string[];
}): GuardianChangeRiskIndicator[] {
  const indicators: GuardianChangeRiskIndicator[] = [];
  if (input.providers.length > 0) indicators.push("provider_surface");
  if (input.workspaces.length > 0) indicators.push("workspace_surface");
  if (input.cockpits.length > 0) indicators.push("cockpit_surface");
  if (input.routes.length > 0) indicators.push("route_surface");
  if (input.contexts.length > 0) indicators.push("context_surface");
  if (input.knowledgeObjects.length > 0) indicators.push("knowledge_surface");
  if (input.category.includes("module") || input.category.includes("regression")) {
    indicators.push("module_regression_signal");
  }
  if (input.severity === "critical" || input.severity === "high") {
    indicators.push("high_severity_incident");
  }
  if (input.category.includes("cascade") || input.category.includes("correlated")) {
    indicators.push("correlated_cascade");
  }
  if (input.tenants.length > 1) indicators.push("multi_tenant_scope");
  return indicators;
}

class ChangeIntelligenceEngineImpl {
  readonly id = CHANGE_INTELLIGENCE_ENGINE_ID;
  private status: ChangeIntelligenceEngineStatus = "inactive";
  private lastResult: ChangeIntelligenceResult | null = null;
  private analysisCount = 0;

  initialize(): void {
    IncidentContextBuilder.initialize();
    CorrelationEngine.initialize();
    KnowledgeDiagnosisEngine.initialize();
    EngineeringTimeline.initialize();
    this.status = "ready";
  }

  getStatus(): ChangeIntelligenceEngineStatus {
    return this.status;
  }

  isReady(): boolean {
    return this.status === "ready";
  }

  getLastResult(): ChangeIntelligenceResult | null {
    return this.lastResult;
  }

  getLastChangeContext(): GuardianChangeContext | null {
    return this.lastResult?.changeContext ?? null;
  }

  getAnalysisCount(): number {
    return this.analysisCount;
  }

  /**
   * Official Change Intelligence entrypoint.
   * Requires Root Cause Analysis - never bypasses RCA to inspect commits.
   */
  analyzeFromRootCause(rootCause: GuardianRootCause): ChangeIntelligenceResult {
    if (this.status !== "ready") {
      this.initialize();
    }

    if (!rootCause?.rootCauseId) {
      throw new Error(
        "Change Intelligence requires a Root Cause Analysis. Direct commit analysis is forbidden.",
      );
    }

    const context = IncidentContextBuilder.getLastContext();
    const diagnosis = KnowledgeDiagnosisEngine.getLastDiagnosis();
    const correlation = CorrelationEngine.getLastResult();

    const changeId = nextChangeId();
    const commitHash = `rca-${rootCause.rootCauseId}`;
    const author = "guardian-change-intelligence";

    const components = unique([
      ...rootCause.affectedComponents,
      ...(diagnosis?.affectedComponents ?? []),
      ...(context?.modulesInvolved ?? []),
    ]);
    const modules = unique([
      ...(context?.modulesInvolved ?? []),
      ...(correlation?.modulesInvolved ?? []),
      ...rootCause.affectedComponents,
    ]);
    const providers = unique([
      ...rootCause.affectedProviders,
      ...(context?.providersInvolved ?? []),
      ...(correlation?.providersInvolved ?? []),
    ]);
    const workspaces = unique([
      context?.workspace ?? null,
      context?.navigationContext?.workspace ?? null,
    ]);
    const tenants = unique([context?.tenant ?? null]);
    const contexts = unique([
      rootCause.contextId,
      context?.contextId ?? null,
      diagnosis?.contextId ?? null,
    ]);
    const cockpits = deriveCockpits(modules, workspaces);
    const routes = deriveRoutes(modules, components);
    const knowledgeObjects = deriveKnowledgeObjects(
      (diagnosis?.knowledgeSources ?? []).map((s) => s.sourceId || s.label),
      rootCause.evidenceChain,
    );
    const dependencies = deriveDependencies(providers, modules, components);
    const filesChanged = unique([
      ...components.map((c) => `component://${c}`),
      ...modules.map((m) => `module://${m}`),
      ...providers.map((p) => `provider://${p}`),
    ]);
    const relatedIncidents = unique([
      rootCause.incidentId,
      ...(context?.relatedIncidents.map((i) => i.incidentId) ?? []),
      ...(correlation?.relatedIncidentIds ?? []),
    ]);
    const businessScope = unique([
      ...(tenants.length ? tenants.map((t) => `tenant:${t}`) : ["tenant:unknown"]),
      ...(workspaces.length ? workspaces.map((w) => `workspace:${w}`) : []),
      rootCause.businessImpact ? "business-impact-flagged" : null,
    ]);
    const technicalScope = unique([
      ...providers.map((p) => `tech:provider:${p}`),
      ...modules.map((m) => `tech:module:${m}`),
      rootCause.technicalImpact ? "technical-impact-flagged" : null,
      rootCause.rootCauseCategory,
    ]);

    const indicators = deriveRiskIndicators({
      providers,
      workspaces,
      cockpits,
      routes,
      contexts,
      knowledgeObjects,
      category: rootCause.rootCauseCategory,
      severity: rootCause.riskLevel,
      tenants,
    });

    GuardianEventBus.publish(CHANGE_DETECTED_EVENT, this.id, {
      changeId,
      rootCauseId: rootCause.rootCauseId,
      incidentId: rootCause.incidentId,
      filesChanged: filesChanged.length,
    });

    const changeContext: GuardianChangeContext = {
      changeId,
      commitHash,
      timestamp: new Date().toISOString(),
      author,
      filesChanged,
      components,
      modules,
      providers,
      workspaces,
      cockpits,
      routes,
      contexts,
      knowledgeObjects,
      dependencies,
      tenantScope: tenants,
      businessScope,
      technicalScope,
      relatedIncidents,
      relatedRootCauses: [rootCause.rootCauseId],
      riskIndicators: {
        indicators,
        count: indicators.length,
        highRisk: indicators.some((i) =>
          [
            "high_severity_incident",
            "correlated_cascade",
            "module_regression_signal",
            "multi_tenant_scope",
          ].includes(i),
        ),
      },
      preparedRegression: EMPTY_CHANGE_PREPARED_SLOT,
      preparedTests: EMPTY_CHANGE_PREPARED_SLOT,
      preparedPatch: EMPTY_CHANGE_PREPARED_SLOT,
      preparedDeployment: EMPTY_CHANGE_PREPARED_SLOT,
      contextId: rootCause.contextId,
      rootCauseId: rootCause.rootCauseId,
      incidentId: rootCause.incidentId,
      diagnosisId: rootCause.diagnosisId,
      status: components.length || modules.length ? "ready_for_regression" : "inconclusive",
    };

    GuardianEventBus.publish(CHANGE_CONTEXT_BUILT_EVENT, this.id, {
      changeId: changeContext.changeId,
      contextId: changeContext.contextId,
      rootCauseId: changeContext.rootCauseId,
      riskIndicatorCount: changeContext.riskIndicators.count,
      status: changeContext.status,
    });

    const result: ChangeIntelligenceResult = { changeContext };
    this.lastResult = result;
    this.analysisCount += 1;
    return result;
  }

  reset(): void {
    this.status = "inactive";
    this.lastResult = null;
    this.analysisCount = 0;
    changeSeq = 0;
  }
}

export const ChangeIntelligenceEngine = new ChangeIntelligenceEngineImpl();

export function createChangeIntelligenceEngine(): ChangeIntelligenceEngineImpl {
  return new ChangeIntelligenceEngineImpl();
}
