/**
 * Guardian Enterprise Dashboard module (GAI-08B).
 * Engineering Observability + Core Publication (SDK/Adapters/Plugins/Compatibility). Read-only.
 * No action buttons. All events sourced via Engineering Timeline.
 */

import { CorrelationEngine } from "../correlation/correlation_engine";
import { IncidentContextBuilder } from "../context/incident_context_builder";
import { KnowledgeDiagnosisEngine } from "../diagnosis/knowledge_diagnosis_engine";
import { HypothesisEngine } from "../hypothesis/hypothesis_engine";
import { RootCauseAnalysisEngine } from "../root_cause/root_cause_engine";
import { ChangeIntelligenceEngine } from "../change/change_intelligence_engine";
import { RegressionIntelligenceEngine } from "../regression/regression_intelligence_engine";
import { PerformanceIntelligenceEngine } from "../performance/performance_intelligence_engine";
import { PerformancePredictionEngine } from "../prediction/performance_prediction_engine";
import { CapacityAnalysisEngine } from "../capacity/capacity_analysis_engine";
import { SecurityIntelligenceEngine } from "../security/security_intelligence_engine";
import { ThreatPredictionEngine } from "../threat/threat_prediction_engine";
import { ComplianceAnalysisEngine } from "../compliance/compliance_analysis_engine";
import { EngineeringKnowledgePlatform } from "../engineering_knowledge/engineering_knowledge_platform";
import { EngineeringMemory } from "../engineering_memory/engineering_memory_engine";
import { EngineeringOntology } from "../engineering_ontology/engineering_ontology_engine";
import { EngineeringOperationsCenter } from "../observability/engineering_operations_center";
import { EngineeringHealthService } from "../observability/health_service";
import { EngineeringSessionService } from "../observability/session_service";
import { EngineeringStatisticsService } from "../observability/statistics_service";
import { FOUNDATION_MODULES } from "../registry";
import { GuardianRegistry } from "../registry/guardian_registry";
import { GuardianRuntime } from "../runtime/guardian_runtime";
import { IncidentDetectionEngine } from "../incident/incident_detection_engine";
import { GuardianProviderRegistry } from "../providers/provider_registry";
import { KnowledgeProviderRegistry } from "../providers/knowledge/registry";
import { HypothesisProviderRegistry } from "../providers/hypothesis/registry";
import { RootCauseProviderRegistry } from "../providers/root-cause/registry";
import { ChangeIntelligenceProviderRegistry } from "../providers/change-intelligence/registry";
import { RegressionProviderRegistry } from "../providers/regression/registry";
import { PerformanceProviderRegistry } from "../providers/performance/registry";
import { PredictionProviderRegistry } from "../providers/prediction/registry";
import { CapacityProviderRegistry } from "../providers/capacity/registry";
import { SecurityProviderRegistry } from "../providers/security/registry";
import { ThreatProviderRegistry } from "../providers/threat/registry";
import { ComplianceProviderRegistry } from "../providers/compliance/registry";
import { EngineeringMemoryProviderRegistry } from "../providers/engineering-memory/registry";
import { EngineeringOntologyProviderRegistry } from "../providers/engineering-ontology/registry";
import { GuardianAdapterRegistry } from "../adapters/adapter_registry";
import { describeGuardianSdk } from "../sdk/guardian_sdk";
import { getGuardianPublicApi } from "../sdk/public-api/public_api";
import { GuardianPluginRegistry } from "../plugins/plugin_registry";
import { GuardianCompatibilityLayer } from "../compatibility/compatibility_layer";
import { GUARDIAN_VERSION_MANIFEST } from "../version/version_manifest";
import { GUARDIAN_CORE_REPOSITORY } from "../version/repository";

import { describeGuardianCoreFreeze } from "../core/core_freeze";
import { describeGuardianCore } from "../core/guardian_core";
import { EngineeringTimeline } from "../timeline/timeline_service";
import { GuardianEventBus } from "../events/event_bus";
import {
  GUARDIAN_FOUNDATION_VERSION,
  GUARDIAN_SPRINT_ID,
  GUARDIAN_SPRINT_NAME,
  type GuardianFoundationSnapshot,
} from "../types";
import type { EngineeringTimelineFilter } from "../types/timeline_types";

let dashboardLoadedPublished = false;

function ensureDashboardLoadedEvent(): void {
  if (dashboardLoadedPublished) return;
  dashboardLoadedPublished = true;
  EngineeringTimeline.initialize();
  CorrelationEngine.initialize();
  IncidentContextBuilder.initialize();
  KnowledgeDiagnosisEngine.initialize();
  HypothesisEngine.initialize();
  RootCauseAnalysisEngine.initialize();
  ChangeIntelligenceEngine.initialize();
  RegressionIntelligenceEngine.initialize();
  PerformanceIntelligenceEngine.initialize();
  PerformancePredictionEngine.initialize();
  CapacityAnalysisEngine.initialize();
  SecurityIntelligenceEngine.initialize();
  ThreatPredictionEngine.initialize();
  ComplianceAnalysisEngine.initialize();
  EngineeringKnowledgePlatform.initialize();
  EngineeringMemory.initialize();
  EngineeringOntology.initialize();
  KnowledgeProviderRegistry.ensure();
  HypothesisProviderRegistry.ensure();
  RootCauseProviderRegistry.ensure();
  ChangeIntelligenceProviderRegistry.ensure();
  RegressionProviderRegistry.ensure();
  PerformanceProviderRegistry.ensure();
  PredictionProviderRegistry.ensure();
  CapacityProviderRegistry.ensure();
  SecurityProviderRegistry.ensure();
  ThreatProviderRegistry.ensure();
  ComplianceProviderRegistry.ensure();
  EngineeringMemoryProviderRegistry.ensure();
  EngineeringOntologyProviderRegistry.ensure();
  GuardianEventBus.publish("guardian.dashboard.loaded", "guardian-dashboard", {
    sprintId: GUARDIAN_SPRINT_ID,
  });
}

export interface EngineeringDashboardFilter {
  readonly query?: string;
  readonly category?: EngineeringTimelineFilter["category"];
  readonly severity?: EngineeringTimelineFilter["severity"];
  readonly eventType?: string;
  readonly limit?: number;
}

export const GuardianDashboard = {
  getFoundationSnapshot(): GuardianFoundationSnapshot {
    ensureDashboardLoadedEvent();
    return {
      sprintId: GUARDIAN_SPRINT_ID,
      sprintName: GUARDIAN_SPRINT_NAME,
      version: GUARDIAN_FOUNDATION_VERSION,
      status: GuardianRuntime.getStatus() === "ready" ? "ready" : "foundation_ready",
      label: "Guardian AI",
      foundationLabel: "Guardian Architecture Foundation",
      foundationReady: true,
      incidentEngineReady: IncidentDetectionEngine.isReady(),
      observabilityReady: true,
      timelineReady: EngineeringTimeline.ready,
      diagnosisReady: KnowledgeDiagnosisEngine.isReady(),
      correlationReady: CorrelationEngine.isReady(),
      hypothesisReady: HypothesisEngine.isReady(),
      rootCauseReady: RootCauseAnalysisEngine.isReady(),
      changeIntelligenceReady: ChangeIntelligenceEngine.isReady(),
      regressionReady: RegressionIntelligenceEngine.isReady(),
      performanceReady: PerformanceIntelligenceEngine.isReady(),
      predictionReady: PerformancePredictionEngine.isReady(),
      capacityReady: CapacityAnalysisEngine.isReady(),
      securityReady: SecurityIntelligenceEngine.isReady(),
      threatReady: ThreatPredictionEngine.isReady(),
      complianceReady: ComplianceAnalysisEngine.isReady(),
      engineeringKnowledgeReady: EngineeringKnowledgePlatform.isReady(),
      engineeringMemoryReady: EngineeringMemory.isReady(),
      engineeringOntologyReady: EngineeringOntology.isReady(),
      incidentsDetected: GuardianRuntime.getIncidentCount(),
      aiEnabled: false,
      modules: FOUNDATION_MODULES,
      generatedAt: new Date().toISOString(),
    };
  },

  /** GAI-08 Engineering Dashboard - observability + diagnosis + RCA + change/regression + performance. Read-only. */
  getEnterpriseView(filter: EngineeringDashboardFilter = {}) {
    ensureDashboardLoadedEvent();

    const providers = GuardianProviderRegistry.list().length
      ? GuardianProviderRegistry.list()
      : GuardianRegistry.listProviders();

    const timelineFilter: EngineeringTimelineFilter = {
      query: filter.query,
      category: filter.category,
      severity: filter.severity,
      eventType: filter.eventType,
      limit: filter.limit ?? 100,
    };

    const timeline = EngineeringTimeline.list(timelineFilter);
    const health = EngineeringHealthService.getHealth();
    const integrity = EngineeringHealthService.getIntegrity();
    const statistics = EngineeringStatisticsService.getStatistics();
    const sessions = EngineeringSessionService.list();
    const incidents = GuardianRuntime.listIncidents();
    const recentEvents = EngineeringTimeline.list({ limit: 20 });
    const correlation = CorrelationEngine.getLastResult();
    const context = IncidentContextBuilder.getLastContext();
    const diagnosis = KnowledgeDiagnosisEngine.getLastDiagnosis();
    const hypothesisSet = HypothesisEngine.getLastHypothesisSet();
    const rca = RootCauseAnalysisEngine.getLastResult();
    const changeContext = ChangeIntelligenceEngine.getLastChangeContext();
    const regression = RegressionIntelligenceEngine.getLastRegression();
    const performanceMetrics = PerformanceIntelligenceEngine.getLastMetrics();
    const performancePrediction = PerformancePredictionEngine.getLastPrediction();
    const capacityAnalysis = CapacityAnalysisEngine.getLastCapacity();
    const performanceReport = CapacityAnalysisEngine.getLastReport();
    const knowledgeProvider = KnowledgeProviderRegistry.describe();
    const hypothesisProvider = HypothesisProviderRegistry.describe();
    const rootCauseProvider = RootCauseProviderRegistry.describe();
    const changeProvider = ChangeIntelligenceProviderRegistry.describe();
    const regressionProvider = RegressionProviderRegistry.describe();
    const performanceProvider = PerformanceProviderRegistry.describe();
    const predictionProvider = PredictionProviderRegistry.describe();
    const capacityProvider = CapacityProviderRegistry.describe();
    const securityAssessment = SecurityIntelligenceEngine.getLastAssessment();
    const threatPrediction = ThreatPredictionEngine.getLastPrediction();
    const complianceReport = ComplianceAnalysisEngine.getLastReport();
    const securityDashboard = ComplianceAnalysisEngine.getLastDashboard();
    const securityProvider = SecurityProviderRegistry.describe();
    const threatProvider = ThreatProviderRegistry.describe();
    const complianceProvider = ComplianceProviderRegistry.describe();
    const knowledgePlatformResult = EngineeringKnowledgePlatform.getLastResult();
    const knowledgeOverview = knowledgePlatformResult?.snapshot ?? EngineeringKnowledgePlatform.getSnapshot();
    const engineeringMemoryRecords = EngineeringMemory.list();
    const engineeringOntologyEntities = EngineeringOntology.listEntities();
    const engineeringOntologyRelations = EngineeringOntology.listRelations();
    const knowledgeObjects = EngineeringKnowledgePlatform.listKnowledgeObjects();
    const knowledgeGraph = knowledgePlatformResult?.graph ?? EngineeringKnowledgePlatform.buildStructuralGraph();
    const knowledgeIndex = EngineeringKnowledgePlatform.listIndex();
    const engineeringMemoryProvider = EngineeringMemoryProviderRegistry.describe();
    const engineeringOntologyProvider = EngineeringOntologyProviderRegistry.describe();

    const ranked = hypothesisSet
      ? hypothesisSet.hypotheses.filter((h) =>
          hypothesisSet.ranking.rankedHypothesisIds.includes(h.hypothesisId),
        )
      : [];

    return {
      title: "Guardian AI" as const,
      subtitle: "Engineering Operations Center" as const,
      status: "READY" as const,
      foundation: "Guardian Architecture Foundation" as const,
      foundationReady: true as const,
      summary: {
        events: statistics.totalEvents,
        incidents: statistics.totalIncidents,
        sessions: statistics.totalSessions,
        healthScore: health.healthScore,
        integrityScore: integrity.integrityScore,
        availability: health.availability,
        providersReady: providers.filter((p) => p.ready).length,
        providersTotal: providers.length,
        correlationScore: correlation?.correlationScore ?? null,
        diagnosisConfidence: diagnosis?.confidenceScore ?? null,
        rootCauseConfidence: rca?.rootCause.confidenceScore ?? null,
        hypothesisCount: hypothesisSet?.hypotheses.length ?? 0,
        regressionScore: regression?.regressionScore ?? null,
        regressionProbability: regression?.probability ?? null,
        performanceScore: performanceMetrics?.score ?? null,
        predictionScore: performancePrediction?.score ?? null,
        capacityScore: capacityAnalysis?.score ?? null,
        securityScore: securityAssessment?.securityScore ?? null,
        threatScore: threatPrediction?.threatScore ?? null,
        complianceScore: complianceReport?.complianceScore ?? null,
      },
      timeline,
      expandedTimeline: timeline,
      incidents: incidents.map((i) => ({
        incidentId: i.incidentId,
        category: i.category,
        severity: i.severity,
        message: i.message,
        status: i.status,
        timestamp: i.timestamp,
      })),
      recentEvents: recentEvents.map((e) => ({
        timelineId: e.timelineId,
        eventType: e.eventType,
        timestamp: e.timestamp,
        severity: e.severity,
        source: e.source,
      })),
      runtime: {
        id: GuardianRuntime.id,
        status: GuardianRuntime.getStatus(),
        incidentCount: GuardianRuntime.getIncidentCount(),
      },
      providers: providers.map((p) => ({
        id: p.id,
        name: p.name,
        ready: p.ready,
        operational: p.operational,
      })),
      health,
      integrity,
      sessions,
      events: timeline,
      statistics,
      filters: {
        query: filter.query ?? "",
        category: filter.category ?? null,
        severity: filter.severity ?? null,
        eventType: filter.eventType ?? null,
      },
      search: {
        query: filter.query ?? "",
        resultCount: timeline.length,
      },
      eocModules: EngineeringOperationsCenter.modules(),
      services: GuardianRegistry.listServices(),
      adapter: (() => {
        const bound = GuardianAdapterRegistry.getBound();
        return {
          id: bound?.id ?? "unbound",
          name: bound?.name ?? "No adapter bound",
          implementsProviders: bound?.implementsProviders ?? false,
          status: bound?.status ?? "inactive",
        };
      })(),
      guardianCore: {
        ...describeGuardianCore(),
        freeze: describeGuardianCoreFreeze(),
      },
      sdk: {
        ...describeGuardianSdk(),
        publicApi: getGuardianPublicApi(),
      },
      adapters: GuardianAdapterRegistry.list().map((a) => ({
        id: a.id,
        name: a.name,
        productId: a.productId,
        status: a.status,
        implementsProviders: a.implementsProviders,
      })),
      adapterStatus: GuardianAdapterRegistry.status(),
      plugins: {
        descriptors: GuardianPluginRegistry.listDescriptors(),
        active: GuardianPluginRegistry.listActive(),
        status: GuardianPluginRegistry.listDescriptors().length > 0 ? "declared" : "empty",
      },
      pluginStatus: GuardianPluginRegistry.listActive().length === 0 ? "inactive" : "active",
      compatibility: GuardianCompatibilityLayer.check({
        adapters: GuardianAdapterRegistry.list(),
        publicApiReady: true,
      }),
      compatibilityStatus: "ready" as const,
      coreVersion: GUARDIAN_VERSION_MANIFEST.coreVersion,
      sdkVersion: GUARDIAN_VERSION_MANIFEST.sdkVersion,
      repository: GUARDIAN_CORE_REPOSITORY.remoteUrl,
      repositoryId: GUARDIAN_CORE_REPOSITORY.id,
      compatibilityVersion: GUARDIAN_VERSION_MANIFEST.compatibilityVersion,
      installedAdapters: GuardianAdapterRegistry.list().map((a) => a.id),
      installedPlugins: GuardianPluginRegistry.listDescriptors().map((p) => p.id),
      guardianProduct: GUARDIAN_CORE_REPOSITORY.product,
      buildVersion: GUARDIAN_VERSION_MANIFEST.buildVersion,
      sdkManifest: { id: "guardian-sdk", version: GUARDIAN_VERSION_MANIFEST.sdkVersion, published: true },
      versionManifest: GUARDIAN_VERSION_MANIFEST,
      incidentEngine: {
        id: IncidentDetectionEngine.id,
        status: IncidentDetectionEngine.getStatus(),
        ready: IncidentDetectionEngine.isReady(),
        detectedCount: IncidentDetectionEngine.getDetectedCount(),
      },
      correlation: correlation
        ? {
            correlationId: correlation.correlationId,
            correlationScore: correlation.correlationScore,
            relatedIncidentIds: correlation.relatedIncidentIds,
            providersInvolved: correlation.providersInvolved,
            modulesInvolved: correlation.modulesInvolved,
            chronologicalSequence: correlation.chronologicalSequence,
            status: correlation.status,
          }
        : null,
      incidentContext: context
        ? {
            contextId: context.contextId,
            incidentId: context.incidentId,
            correlationId: context.correlationId,
            correlationScore: context.correlationScore,
            severity: context.severity,
            confidence: context.confidence,
            providersInvolved: context.providersInvolved,
            modulesInvolved: context.modulesInvolved,
            timelineEventCount: context.timelineEvents.length,
            relatedIncidentCount: context.relatedIncidents.length,
            preparedDiagnosis: context.preparedDiagnosis,
            preparedRootCause: context.preparedRootCause,
            preparedPatch: context.preparedPatch,
            preparedDeployment: context.preparedDeployment,
          }
        : null,
      knowledgeDiagnosis: diagnosis
        ? {
            diagnosisId: diagnosis.diagnosisId,
            incidentId: diagnosis.incidentId,
            contextId: diagnosis.contextId,
            confidenceScore: diagnosis.confidenceScore,
            status: diagnosis.status,
            explanation: diagnosis.explanation,
            affectedComponents: diagnosis.affectedComponents,
            possibleCauses: diagnosis.possibleCauses,
            recommendedActions: diagnosis.recommendedActions,
            autoCorrection: diagnosis.autoCorrection,
            codeExecution: diagnosis.codeExecution,
            patchSuggested: diagnosis.patchSuggested,
          }
        : null,
      evidenceChain: diagnosis?.evidenceChain ?? null,
      confidence: diagnosis?.confidenceScore ?? null,
      knowledgeSources: diagnosis?.knowledgeSources ?? [],
      correlationScore: correlation?.correlationScore ?? null,
      hypotheses: hypothesisSet?.hypotheses ?? [],
      hypothesisRanking: hypothesisSet?.ranking ?? null,
      rootCause: rca?.rootCause ?? null,
      rootCauseConfidence: rca?.rootCause.confidenceScore ?? null,
      evidenceMatrix: rca?.evidenceMatrix ?? null,
      evidenceWeight: rca?.evidenceMatrix.totalWeight ?? null,
      impact: rca?.rootCause.impactAnalysis ?? null,
      risk: rca?.rootCause.riskLevel ?? null,
      businessImpact: rca?.rootCause.businessImpact ?? null,
      technicalImpact: rca?.rootCause.technicalImpact ?? null,
      knowledgeProvider: {
        id: knowledgeProvider.id,
        name: knowledgeProvider.name,
        ready: knowledgeProvider.ready,
        operational: knowledgeProvider.operational,
      },
      hypothesisProvider: {
        id: hypothesisProvider.id,
        name: hypothesisProvider.name,
        ready: hypothesisProvider.ready,
        operational: hypothesisProvider.operational,
      },
      rootCauseProvider: {
        id: rootCauseProvider.id,
        name: rootCauseProvider.name,
        ready: rootCauseProvider.ready,
        operational: rootCauseProvider.operational,
      },
      changeIntelligence: changeContext,
      changeContext,
      regressionAnalysis: regression,
      regressionScore: regression?.regressionScore ?? null,
      riskMatrix: regression?.riskMatrix ?? null,
      criticalAreas: regression?.criticalAreas ?? [],
      probability: regression?.probability ?? ranked[0]?.probability ?? null,
      regressionHistory: regression?.regressionHistory ?? [],
      recommendedTestScope: regression?.recommendedTestScope ?? [],
      impactMap: regression?.impactMap ?? null,
      changeProvider: {
        id: changeProvider.id,
        name: changeProvider.name,
        ready: changeProvider.ready,
        operational: changeProvider.operational,
      },
      regressionProvider: {
        id: regressionProvider.id,
        name: regressionProvider.name,
        ready: regressionProvider.ready,
        operational: regressionProvider.operational,
      },
      technicalRisk: regression?.technicalRisk ?? null,
      businessRisk: regression?.businessRisk ?? null,
      performanceOverview: performanceReport
        ? {
            reportId: performanceReport.reportId,
            status: performanceReport.status,
            performanceScore: performanceReport.performanceScore,
            predictionScore: performanceReport.predictionScore,
            capacityScore: performanceReport.capacityScore,
            confidence: performanceReport.confidence,
          }
        : null,
      performanceMetrics,
      performancePrediction,
      capacityAnalysis,
      performanceScore: performanceMetrics?.score ?? null,
      predictionScore: performancePrediction?.score ?? null,
      capacityScore: capacityAnalysis?.score ?? null,
      hotspots: performanceReport?.hotspots ?? performanceMetrics?.hotspots ?? [],
      performanceTimeline: EngineeringTimeline.list({ category: "performance", limit: 50 }),
      performanceHistory: performanceMetrics?.trends ?? [],
      performanceTrends: performanceMetrics?.trends ?? [],
      criticalResources: capacityAnalysis?.criticalResources ?? [],
      performanceProvider: {
        id: performanceProvider.id,
        name: performanceProvider.name,
        ready: performanceProvider.ready,
        operational: performanceProvider.operational,
      },
      predictionProvider: {
        id: predictionProvider.id,
        name: predictionProvider.name,
        ready: predictionProvider.ready,
        operational: predictionProvider.operational,
      },
      capacityProvider: {
        id: capacityProvider.id,
        name: capacityProvider.name,
        ready: capacityProvider.ready,
        operational: capacityProvider.operational,
      },
      securityOverview: securityDashboard,
      securityAssessment,
      threatPrediction,
      complianceReport,
      securityDashboard,
      securityScore: securityAssessment?.securityScore ?? null,
      threatScore: threatPrediction?.threatScore ?? null,
      complianceScore: complianceReport?.complianceScore ?? null,
      criticalVulnerabilities: securityAssessment?.criticalVulnerabilities ?? [],
      complianceViolations: complianceReport?.violations ?? [],
      architectureCompliance: complianceReport?.architectureCompliance ?? null,
      securityTrends: securityAssessment?.trends ?? securityDashboard?.trends ?? [],
      securityHistory: securityAssessment?.trends ?? [],
      threatTimeline: EngineeringTimeline.list({ category: "threat", limit: 50 }),
      securityTimeline: EngineeringTimeline.list({ category: "security", limit: 50 }),
      complianceTimeline: EngineeringTimeline.list({ category: "compliance", limit: 50 }),
      securityProvider: {
        id: securityProvider.id,
        name: securityProvider.name,
        ready: securityProvider.ready,
        operational: securityProvider.operational,
      },
      threatProvider: {
        id: threatProvider.id,
        name: threatProvider.name,
        ready: threatProvider.ready,
        operational: threatProvider.operational,
      },
      complianceProvider: {
        id: complianceProvider.id,
        name: complianceProvider.name,
        ready: complianceProvider.ready,
        operational: complianceProvider.operational,
      },
      knowledgeOverview,
      engineeringMemory: engineeringMemoryRecords,
      engineeringOntology: engineeringOntologyEntities,
      knowledgeObjects,
      knowledgeGraph,
      knowledgeTimeline: EngineeringTimeline.list({ category: "knowledge", limit: 50 }),
      knowledgeHistory: knowledgeObjects.map((k) => ({ knowledgeId: k.knowledgeId, entityType: k.entityType, timestamp: k.timestamp, originEngine: k.originEngine })),
      knowledgeRelations: engineeringOntologyRelations,
      evidenceRelations: engineeringOntologyRelations.filter((r) => r.relationType === "evidences" || r.relationType === "references"),
      entityExplorer: engineeringOntologyEntities.map((e) => ({ id: e.id, type: e.type, status: e.status, relationCount: e.relations.length })),
      knowledgeIndex,
      engineeringMemoryProvider: {
        id: engineeringMemoryProvider.id,
        name: engineeringMemoryProvider.name,
        ready: engineeringMemoryProvider.ready,
        operational: engineeringMemoryProvider.operational,
      },
      engineeringOntologyProvider: {
        id: engineeringOntologyProvider.id,
        name: engineeringOntologyProvider.name,
        ready: engineeringOntologyProvider.ready,
        operational: engineeringOntologyProvider.operational,
      },
      incidentsDetected: incidents.map((i) => ({
        incidentId: i.incidentId,
        category: i.category,
        severity: i.severity,
        message: i.message,
        status: i.status,
        timestamp: i.timestamp,
      })),
      ai: false as const,
      actionsEnabled: false as const,
      readOnly: true as const,
    };
  },

  resetDashboardLoadedFlag(): void {
    dashboardLoadedPublished = false;
  },
};
