/**
 * Guardian Enterprise Dashboard (GAI-08B).
 * Engineering Observability + Core Publication (SDK / Adapters / Plugins / Compatibility).
 * Internal Guardian surface only. Not wired into Navigation/Composition Root.
 * Displays investigation results. Executes no actions.
 */

import { useState } from "react";
import { GuardianDashboard } from "./guardian_dashboard";

export function GuardianEnterpriseDashboard() {
  const [query, setQuery] = useState("");
  const view = GuardianDashboard.getEnterpriseView({ query: query || undefined });

  return (
    <section
      data-module="guardian-enterprise-dashboard"
      data-sprint="GAI-08B"
      data-readonly="true"
      aria-label="Guardian AI Engineering Observability Center"
    >
      <header>
        <h1>{view.title}</h1>
        <p>{view.subtitle}</p>
        <p>Status: {view.status}</p>
      </header>


      <section aria-label="Guardian Core Publication">
        <h2>Guardian Core</h2>
        <p>Core: {view.guardianCore?.id ?? "guardian-core"}</p>
        <p>Core Version: {view.coreVersion}</p>
        <p>SDK Version: {view.sdkVersion}</p>
        <p>Repository: {view.repository ?? "guardian-core"}</p>
        <p>Compatibility: {view.compatibilityVersion ?? view.compatibilityStatus}</p>
        <p>Installed Adapters: {(view.installedAdapters ?? []).join(", ") || "none"}</p>
        <p>Installed Plugins: {(view.installedPlugins ?? []).join(", ") || "none"}</p>
        <p>Guardian Product: {view.guardianProduct ?? "Guardian Core"}</p>
        <p>Build Version: {view.buildVersion ?? view.versionManifest?.buildVersion}</p>
        <p>SDK: {view.sdk?.id ?? "guardian-sdk"}</p>
        <p>Public API Ready: {String(view.sdk?.publicApiReady ?? false)}</p>
        <p>Adapter Status: {view.adapterStatus}</p>
        <p>Plugin Status: {view.pluginStatus}</p>
        <p>Compatibility Status: {view.compatibilityStatus}</p>
        <p>Compatibility OK: {String(view.compatibility?.compatible ?? false)}</p>
        <ul>
          {(view.adapters ?? []).map((adapter) => (
            <li key={adapter.id}>
              {adapter.name} ({adapter.productId}) — {adapter.status}
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Resumo Geral">
        <h2>Resumo Geral</h2>
        <p>Eventos: {view.summary.events}</p>
        <p>Incidentes: {view.summary.incidents}</p>
        <p>Sessoes: {view.summary.sessions}</p>
        <p>Health Score: {view.summary.healthScore}</p>
        <p>Integrity Score: {view.summary.integrityScore}</p>
        <p>Availability: {view.summary.availability}</p>
        <p>Correlation Score: {view.summary.correlationScore ?? "n/a"}</p>
        <p>Diagnosis Confidence: {view.summary.diagnosisConfidence ?? "n/a"}</p>
        <p>Root Cause Confidence: {view.summary.rootCauseConfidence ?? "n/a"}</p>
        <p>Hypotheses: {view.summary.hypothesisCount}</p>
        <p>Regression Score: {view.summary.regressionScore ?? "n/a"}</p>
        <p>Regression Probability: {view.summary.regressionProbability ?? "n/a"}</p>
        <p>Performance Score: {view.summary.performanceScore ?? "n/a"}</p>
        <p>Prediction Score: {view.summary.predictionScore ?? "n/a"}</p>
        <p>Capacity Score: {view.summary.capacityScore ?? "n/a"}</p>
        <p>Security Score: {view.summary.securityScore ?? "n/a"}</p>
        <p>Threat Score: {view.summary.threatScore ?? "n/a"}</p>
        <p>Compliance Score: {view.summary.complianceScore ?? "n/a"}</p>
      </section>

      <section aria-label="Filtros e Pesquisa">
        <h2>Filtros</h2>
        <label>
          Pesquisa
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Pesquisar eventos da Timeline"
            readOnly={false}
          />
        </label>
        <p>Resultados: {view.search.resultCount}</p>
      </section>

      <section aria-label="Timeline expandida">
        <h2>Timeline expandida</h2>
        <ul>
          {view.expandedTimeline.map((event) => (
            <li key={event.timelineId}>
              {event.eventType} — {event.category} — {event.severity} @ {event.timestamp}
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Correlation">
        <h2>Correlation</h2>
        {view.correlation ? (
          <>
            <p>Correlation ID: {view.correlation.correlationId}</p>
            <p>Correlation Score: {view.correlation.correlationScore}</p>
            <p>Status: {view.correlation.status}</p>
            <p>Providers: {view.correlation.providersInvolved.join(", ") || "n/a"}</p>
            <p>Modules: {view.correlation.modulesInvolved.join(", ") || "n/a"}</p>
          </>
        ) : (
          <p>Sem correlacao registrada.</p>
        )}
      </section>

      <section aria-label="Incident Context">
        <h2>Incident Context</h2>
        {view.incidentContext ? (
          <>
            <p>Context ID: {view.incidentContext.contextId}</p>
            <p>Incident ID: {view.incidentContext.incidentId}</p>
            <p>Correlation Score: {view.incidentContext.correlationScore}</p>
            <p>Timeline Events: {view.incidentContext.timelineEventCount}</p>
            <p>Related Incidents: {view.incidentContext.relatedIncidentCount}</p>
          </>
        ) : (
          <p>Sem contexto construido.</p>
        )}
      </section>

      <section aria-label="Knowledge Diagnosis">
        <h2>Knowledge Diagnosis</h2>
        {view.knowledgeDiagnosis ? (
          <>
            <p>Diagnosis ID: {view.knowledgeDiagnosis.diagnosisId}</p>
            <p>Status: {view.knowledgeDiagnosis.status}</p>
            <p>Confidence: {view.knowledgeDiagnosis.confidenceScore}</p>
            <p>{view.knowledgeDiagnosis.explanation}</p>
          </>
        ) : (
          <p>Sem diagnostico registrado.</p>
        )}
      </section>

      <section aria-label="Evidence Chain">
        <h2>Evidence Chain</h2>
        {view.evidenceChain ? (
          <ul>
            {view.evidenceChain.items.map((item) => (
              <li key={item.evidenceId}>
                #{item.order} [{item.origin}] w={item.weight} r={item.reliability}{" "}
                {item.statement}
              </li>
            ))}
          </ul>
        ) : (
          <p>Sem cadeia de evidencias.</p>
        )}
      </section>

      <section aria-label="Hypotheses">
        <h2>Hypotheses</h2>
        {view.hypotheses.length > 0 ? (
          <ul>
            {view.hypotheses.map((h) => (
              <li key={h.hypothesisId}>
                {h.title} — P={h.probability} C={h.confidence} W={h.evidenceWeight} [
                {h.status}]
              </li>
            ))}
          </ul>
        ) : (
          <p>Sem hipoteses geradas.</p>
        )}
      </section>

      <section aria-label="Hypothesis Ranking">
        <h2>Hypothesis Ranking</h2>
        {view.hypothesisRanking ? (
          <>
            <p>Ranking ID: {view.hypothesisRanking.rankingId}</p>
            <p>Ranked: {view.hypothesisRanking.rankedHypothesisIds.join(", ")}</p>
            <p>Discarded: {view.hypothesisRanking.discardedHypothesisIds.join(", ") || "n/a"}</p>
          </>
        ) : (
          <p>Sem ranking de hipoteses.</p>
        )}
      </section>

      <section aria-label="Root Cause">
        <h2>Root Cause</h2>
        {view.rootCause ? (
          <>
            <p>Root Cause ID: {view.rootCause.rootCauseId}</p>
            <p>Category: {view.rootCause.rootCauseCategory}</p>
            <p>Status: {view.rootCause.status}</p>
            <p>{view.rootCause.description}</p>
          </>
        ) : (
          <p>Sem causa raiz determinada.</p>
        )}
      </section>

      <section aria-label="Root Cause Confidence">
        <h2>Root Cause Confidence</h2>
        <p>{view.rootCauseConfidence ?? "n/a"}</p>
      </section>

      <section aria-label="Evidence Matrix">
        <h2>Evidence Matrix</h2>
        {view.evidenceMatrix ? (
          <ul>
            {view.evidenceMatrix.entries.map((entry) => (
              <li key={entry.evidenceId}>
                {entry.evidenceId} — origin={entry.origin} weight={entry.weight}{" "}
                reliability={entry.reliability}
              </li>
            ))}
          </ul>
        ) : (
          <p>Sem matriz de evidencias.</p>
        )}
      </section>

      <section aria-label="Evidence Weight">
        <h2>Evidence Weight</h2>
        <p>{view.evidenceWeight ?? "n/a"}</p>
      </section>

      <section aria-label="Probability">
        <h2>Probability</h2>
        <p>{view.probability ?? "n/a"}</p>
      </section>

      <section aria-label="Impact">
        <h2>Impact</h2>
        {view.impact ? (
          <>
            <p>Risk: {view.impact.riskLevel}</p>
            <p>Recovery: {view.impact.recoveryComplexity}</p>
            <p>User Facing: {String(view.impact.affectedUserFacing)}</p>
          </>
        ) : (
          <p>Sem analise de impacto.</p>
        )}
      </section>

      <section aria-label="Risk">
        <h2>Risk</h2>
        <p>{view.risk ?? "n/a"}</p>
      </section>

      <section aria-label="Business Impact">
        <h2>Business Impact</h2>
        <p>{view.businessImpact ?? "n/a"}</p>
      </section>

      <section aria-label="Technical Impact">
        <h2>Technical Impact</h2>
        <p>{view.technicalImpact ?? "n/a"}</p>
      </section>

      <section aria-label="Change Intelligence">
        <h2>Change Intelligence</h2>
        {view.changeIntelligence ? (
          <>
            <p>Change ID: {view.changeIntelligence.changeId}</p>
            <p>Commit: {view.changeIntelligence.commitHash}</p>
            <p>Status: {view.changeIntelligence.status}</p>
            <p>Files: {view.changeIntelligence.filesChanged.length}</p>
            <p>Risk Indicators: {view.changeIntelligence.riskIndicators.count}</p>
          </>
        ) : (
          <p>Sem Change Context.</p>
        )}
      </section>

      <section aria-label="Change Context">
        <h2>Change Context</h2>
        {view.changeContext ? (
          <>
            <p>Components: {view.changeContext.components.join(", ") || "n/a"}</p>
            <p>Modules: {view.changeContext.modules.join(", ") || "n/a"}</p>
            <p>Providers: {view.changeContext.providers.join(", ") || "n/a"}</p>
            <p>Workspaces: {view.changeContext.workspaces.join(", ") || "n/a"}</p>
            <p>Cockpits: {view.changeContext.cockpits.join(", ") || "n/a"}</p>
            <p>Routes: {view.changeContext.routes.join(", ") || "n/a"}</p>
          </>
        ) : (
          <p>Sem Change Context.</p>
        )}
      </section>

      <section aria-label="Regression Analysis">
        <h2>Regression Analysis</h2>
        {view.regressionAnalysis ? (
          <>
            <p>Regression ID: {view.regressionAnalysis.regressionId}</p>
            <p>Status: {view.regressionAnalysis.status}</p>
            <p>Confidence: {view.regressionAnalysis.confidence}</p>
          </>
        ) : (
          <p>Sem analise de regressao.</p>
        )}
      </section>

      <section aria-label="Regression Score">
        <h2>Regression Score</h2>
        <p>{view.regressionScore ?? "n/a"}</p>
      </section>

      <section aria-label="Risk Matrix">
        <h2>Risk Matrix</h2>
        {view.riskMatrix ? (
          <>
            <p>Matrix ID: {view.riskMatrix.matrixId}</p>
            <p>Technical Risk: {view.riskMatrix.technicalRisk}</p>
            <p>Business Risk: {view.riskMatrix.businessRisk}</p>
            <p>Probability: {view.riskMatrix.probability}</p>
            <p>Score: {view.riskMatrix.regressionScore}</p>
          </>
        ) : (
          <p>Sem Risk Matrix.</p>
        )}
      </section>

      <section aria-label="Critical Areas">
        <h2>Critical Areas</h2>
        <ul>
          {view.criticalAreas.length ? (
            view.criticalAreas.map((area) => <li key={area}>{area}</li>)
          ) : (
            <li>n/a</li>
          )}
        </ul>
      </section>

      <section aria-label="Probability">
        <h2>Probability</h2>
        <p>{view.probability ?? "n/a"}</p>
      </section>

      <section aria-label="Regression History">
        <h2>Regression History</h2>
        <ul>
          {view.regressionHistory.length ? (
            view.regressionHistory.map((entry) => (
              <li key={entry.incidentId + entry.timestamp}>
                {entry.incidentId} — recurrence={String(entry.recurrence)}
              </li>
            ))
          ) : (
            <li>n/a</li>
          )}
        </ul>
      </section>

      <section aria-label="Recommended Test Scope">
        <h2>Recommended Test Scope</h2>
        <ul>
          {view.recommendedTestScope.length ? (
            view.recommendedTestScope.map((scope) => <li key={scope}>{scope}</li>)
          ) : (
            <li>n/a</li>
          )}
        </ul>
      </section>

      <section aria-label="Impact Map">
        <h2>Impact Map</h2>
        {view.impactMap ? (
          <>
            <p>Map ID: {view.impactMap.mapId}</p>
            <p>Components: {view.impactMap.components.join(", ") || "n/a"}</p>
            <p>Modules: {view.impactMap.modules.join(", ") || "n/a"}</p>
            <p>Providers: {view.impactMap.providers.join(", ") || "n/a"}</p>
            <p>Critical: {view.impactMap.criticalAreas.join(", ") || "n/a"}</p>
          </>
        ) : (
          <p>Sem Impact Map.</p>
        )}
      </section>



      <section aria-label="Performance Overview">
        <h2>Performance Overview</h2>
        {view.performanceOverview ? (
          <>
            <p>Report ID: {view.performanceOverview.reportId}</p>
            <p>Status: {view.performanceOverview.status}</p>
            <p>Performance Score: {view.performanceOverview.performanceScore}</p>
            <p>Prediction Score: {view.performanceOverview.predictionScore}</p>
            <p>Capacity Score: {view.performanceOverview.capacityScore}</p>
            <p>Confidence: {view.performanceOverview.confidence}</p>
          </>
        ) : (
          <p>Sem Performance Overview.</p>
        )}
      </section>

      <section aria-label="Performance Metrics">
        <h2>Performance Metrics</h2>
        {view.performanceMetrics ? (
          <>
            <p>Metrics ID: {view.performanceMetrics.metricsId}</p>
            <p>Score: {view.performanceMetrics.score}</p>
            <p>Confidence: {view.performanceMetrics.confidence}</p>
            <p>Bottlenecks: {view.performanceMetrics.bottlenecks.join(", ") || "n/a"}</p>
            <p>Samples: {view.performanceMetrics.samples.length}</p>
          </>
        ) : (
          <p>Sem Performance Metrics.</p>
        )}
      </section>

      <section aria-label="Performance Prediction">
        <h2>Performance Prediction</h2>
        {view.performancePrediction ? (
          <>
            <p>Prediction ID: {view.performancePrediction.predictionId}</p>
            <p>Score: {view.performancePrediction.score}</p>
            <p>Degradation: {view.performancePrediction.degradationProbability}</p>
            <p>Consumption Increase: {view.performancePrediction.consumptionIncrease}</p>
            <p>Change Impact: {view.performancePrediction.changeImpactScore}</p>
          </>
        ) : (
          <p>Sem Performance Prediction.</p>
        )}
      </section>

      <section aria-label="Capacity Analysis">
        <h2>Capacity Analysis</h2>
        {view.capacityAnalysis ? (
          <>
            <p>Capacity ID: {view.capacityAnalysis.capacityId}</p>
            <p>Score: {view.capacityAnalysis.score}</p>
            <p>Concurrent Users: {view.capacityAnalysis.estimatedConcurrentUsers}</p>
            <p>Database Impact: {view.capacityAnalysis.databaseImpact}</p>
            <p>UKAL Impact: {view.capacityAnalysis.ukalImpact}</p>
            <p>Corporate RAG Impact: {view.capacityAnalysis.corporateRagImpact}</p>
            <p>Vector Index Impact: {view.capacityAnalysis.vectorIndexImpact}</p>
            <p>Providers Impact: {view.capacityAnalysis.providersImpact}</p>
            <p>Runtime Impact: {view.capacityAnalysis.runtimeImpact}</p>
          </>
        ) : (
          <p>Sem Capacity Analysis.</p>
        )}
      </section>

      <section aria-label="Performance Score">
        <h2>Performance Score</h2>
        <p>{view.performanceScore ?? "n/a"}</p>
      </section>

      <section aria-label="Prediction Score">
        <h2>Prediction Score</h2>
        <p>{view.predictionScore ?? "n/a"}</p>
      </section>

      <section aria-label="Capacity Score">
        <h2>Capacity Score</h2>
        <p>{view.capacityScore ?? "n/a"}</p>
      </section>

      <section aria-label="Hotspots">
        <h2>Hotspots</h2>
        <ul>
          {view.hotspots.length ? (
            view.hotspots.map((hotspot) => (
              <li key={hotspot.hotspotId}>
                {hotspot.resource} — {hotspot.severity} — {hotspot.score}
              </li>
            ))
          ) : (
            <li>n/a</li>
          )}
        </ul>
      </section>

      <section aria-label="Performance Timeline">
        <h2>Performance Timeline</h2>
        <ul>
          {view.performanceTimeline.length ? (
            view.performanceTimeline.map((event) => (
              <li key={event.timelineId}>
                {event.eventType} @ {event.timestamp}
              </li>
            ))
          ) : (
            <li>n/a</li>
          )}
        </ul>
      </section>

      <section aria-label="Performance History">
        <h2>Performance History</h2>
        <ul>
          {view.performanceHistory.length ? (
            view.performanceHistory.map((point) => (
              <li key={point.timestamp}>
                {point.timestamp} — score={point.performanceScore}
              </li>
            ))
          ) : (
            <li>n/a</li>
          )}
        </ul>
      </section>

      <section aria-label="Performance Trends">
        <h2>Performance Trends</h2>
        <ul>
          {view.performanceTrends.length ? (
            view.performanceTrends.map((point) => (
              <li key={`trend-${point.timestamp}`}>
                {point.timestamp} — perf={point.performanceScore}
              </li>
            ))
          ) : (
            <li>n/a</li>
          )}
        </ul>
      </section>

      <section aria-label="Critical Resources">
        <h2>Critical Resources</h2>
        <ul>
          {view.criticalResources.length ? (
            view.criticalResources.map((resource) => <li key={resource}>{resource}</li>)
          ) : (
            <li>n/a</li>
          )}
        </ul>
      </section>
      <section aria-label="Security Overview">
        <h2>Security Overview</h2>
        {view.securityOverview ? (
          <>
            <p>Dashboard ID: {view.securityOverview.dashboardId}</p>
            <p>Status: {view.securityOverview.status}</p>
            <p>Security Score: {view.securityOverview.securityScore}</p>
            <p>Threat Score: {view.securityOverview.threatScore}</p>
            <p>Compliance Score: {view.securityOverview.complianceScore}</p>
          </>
        ) : (
          <p>Sem Security Overview.</p>
        )}
      </section>

      <section aria-label="Threat Prediction">
        <h2>Threat Prediction</h2>
        {view.threatPrediction ? (
          <>
            <p>Prediction ID: {view.threatPrediction.predictionId}</p>
            <p>Threat Score: {view.threatPrediction.threatScore}</p>
            <p>Probability: {view.threatPrediction.probability}</p>
            <p>Confidence: {view.threatPrediction.confidence}</p>
            <p>Isolation Breach: {view.threatPrediction.isolationBreachProbability}</p>
            <p>Privilege Escalation: {view.threatPrediction.privilegeEscalationProbability}</p>
            <p>Data Exposure: {view.threatPrediction.dataExposureProbability}</p>
          </>
        ) : (
          <p>Sem Threat Prediction.</p>
        )}
      </section>

      <section aria-label="Threat Score">
        <h2>Threat Score</h2>
        <p>{view.threatScore ?? "n/a"}</p>
      </section>

      <section aria-label="Security Score">
        <h2>Security Score</h2>
        <p>{view.securityScore ?? "n/a"}</p>
      </section>

      <section aria-label="Compliance Score">
        <h2>Compliance Score</h2>
        <p>{view.complianceScore ?? "n/a"}</p>
      </section>

      <section aria-label="Compliance Report">
        <h2>Compliance Report</h2>
        {view.complianceReport ? (
          <>
            <p>Report ID: {view.complianceReport.reportId}</p>
            <p>Compliance Score: {view.complianceReport.complianceScore}</p>
            <p>Architecture Compliance: {String(view.complianceReport.architectureCompliance)}</p>
            <p>UKAL: {String(view.complianceReport.ukalCompliance)}</p>
            <p>Corporate RAG: {String(view.complianceReport.corporateRagCompliance)}</p>
            <p>Multi-tenant: {String(view.complianceReport.multiTenantValidated)}</p>
            <p>RLS: {String(view.complianceReport.rlsValidated)}</p>
          </>
        ) : (
          <p>Sem Compliance Report.</p>
        )}
      </section>

      <section aria-label="Threat Timeline">
        <h2>Threat Timeline</h2>
        <ul>
          {(view.threatTimeline ?? []).map((event) => (
            <li key={event.timelineId}>
              {event.eventType} @ {event.timestamp}
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Security History">
        <h2>Security History</h2>
        <ul>
          {(view.securityHistory ?? []).map((point, index) => (
            <li key={point.timestamp + "-" + index}>
              {point.timestamp}: security={point.securityScore}
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Security Trends">
        <h2>Security Trends</h2>
        <ul>
          {(view.securityTrends ?? []).map((point, index) => (
            <li key={point.timestamp + "-trend-" + index}>
              {point.timestamp}: s={point.securityScore} t={point.threatScore ?? "n/a"} c={point.complianceScore ?? "n/a"}
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Critical Vulnerabilities">
        <h2>Critical Vulnerabilities</h2>
        <ul>
          {(view.criticalVulnerabilities ?? []).length ? (
            view.criticalVulnerabilities.map((v) => (
              <li key={v.vulnerabilityId}>
                {v.title} ({v.severity})
              </li>
            ))
          ) : (
            <li>n/a</li>
          )}
        </ul>
      </section>

      <section aria-label="Compliance Violations">
        <h2>Compliance Violations</h2>
        <ul>
          {(view.complianceViolations ?? []).length ? (
            view.complianceViolations.map((v) => (
              <li key={v.checkId}>
                {v.label} ({v.severity})
              </li>
            ))
          ) : (
            <li>n/a</li>
          )}
        </ul>
      </section>

      <section aria-label="Architecture Compliance">
        <h2>Architecture Compliance</h2>
        <p>{view.architectureCompliance == null ? "n/a" : String(view.architectureCompliance)}</p>
      </section>
      <section aria-label="Confidence">
        <h2>Confidence</h2>
        <p>{view.confidence ?? "n/a"}</p>
      </section>

      <section aria-label="Knowledge Sources">
        <h2>Knowledge Sources</h2>
        <ul>
          {view.knowledgeSources.map((source) => (
            <li key={source.sourceId}>
              {source.label} ({source.kind})
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Correlation Score">
        <h2>Correlation Score</h2>
        <p>{view.correlationScore ?? "n/a"}</p>
      </section>


      <section aria-label="Knowledge Overview">
        <h2>Knowledge Overview</h2>
        <p>Entities: {view.knowledgeOverview?.entityCount ?? 0}</p>
        <p>Memory: {view.knowledgeOverview?.memoryCount ?? 0}</p>
        <p>Knowledge Objects: {view.knowledgeOverview?.knowledgeObjectCount ?? 0}</p>
        <p>Relations: {view.knowledgeOverview?.relationCount ?? 0}</p>
        <p>Index: {view.knowledgeOverview?.indexCount ?? 0}</p>
        <p>Auto Learning: {String(view.knowledgeOverview?.autoLearning ?? false)}</p>
      </section>

      <section aria-label="Engineering Memory">
        <h2>Engineering Memory</h2>
        <ul>
          {(view.engineeringMemory ?? []).slice(0, 20).map((record) => (
            <li key={record.memoryId}>
              {record.kind}: {record.title}
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Engineering Ontology">
        <h2>Engineering Ontology</h2>
        <ul>
          {(view.engineeringOntology ?? []).slice(0, 20).map((entity) => (
            <li key={entity.id}>
              {entity.type}: {entity.id} ({entity.status})
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Knowledge Objects">
        <h2>Knowledge Objects</h2>
        <ul>
          {(view.knowledgeObjects ?? []).slice(0, 20).map((obj) => (
            <li key={obj.knowledgeId}>
              {obj.entityType} / {obj.knowledgeId} conf={obj.confidence}
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Knowledge Graph">
        <h2>Knowledge Graph</h2>
        <p>Structural only: {String(view.knowledgeGraph?.structuralOnly ?? true)}</p>
        <p>Intelligence: {String(view.knowledgeGraph?.intelligence ?? false)}</p>
        <p>Nodes: {view.knowledgeGraph?.nodes?.length ?? 0}</p>
        <p>Edges: {view.knowledgeGraph?.edges?.length ?? 0}</p>
      </section>

      <section aria-label="Knowledge Timeline">
        <h2>Knowledge Timeline</h2>
        <ul>
          {(view.knowledgeTimeline ?? []).slice(0, 20).map((event) => (
            <li key={event.timelineId}>
              {event.eventType} @ {event.timestamp}
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Knowledge History">
        <h2>Knowledge History</h2>
        <ul>
          {(view.knowledgeHistory ?? []).slice(0, 20).map((entry) => (
            <li key={entry.knowledgeId}>
              {entry.entityType} / {entry.originEngine} @ {entry.timestamp}
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Knowledge Relations">
        <h2>Knowledge Relations</h2>
        <ul>
          {(view.knowledgeRelations ?? []).slice(0, 20).map((rel) => (
            <li key={rel.relationId}>
              {rel.fromType} -&gt; {rel.toType} ({rel.relationType})
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Evidence Relations">
        <h2>Evidence Relations</h2>
        <ul>
          {(view.evidenceRelations ?? []).slice(0, 20).map((rel) => (
            <li key={rel.relationId}>
              {rel.fromEntityId} -&gt; {rel.toEntityId}
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Entity Explorer">
        <h2>Entity Explorer</h2>
        <ul>
          {(view.entityExplorer ?? []).slice(0, 20).map((entity) => (
            <li key={entity.id}>
              {entity.type}: {entity.id} relations={entity.relationCount}
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Incidentes">
        <h2>Incidentes</h2>
        <ul>
          {view.incidents.map((incident) => (
            <li key={incident.incidentId}>
              {incident.category}: {incident.message}
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Ultimos Eventos">
        <h2>Ultimos Eventos</h2>
        <ul>
          {view.recentEvents.map((event) => (
            <li key={event.timelineId}>
              {event.eventType} @ {event.timestamp}
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Runtime">
        <h2>Runtime</h2>
        <p>
          {view.runtime.id} — {view.runtime.status}
        </p>
      </section>

      <section aria-label="Providers">
        <h2>Providers</h2>
        <ul>
          {view.providers.map((provider) => (
            <li key={provider.id}>
              {provider.name}: {provider.ready ? "READY" : "INACTIVE"}
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Health">
        <h2>Health</h2>
        <p>Score: {view.health.healthScore}</p>
        <p>Availability: {view.health.availability}</p>
        <p>Timeline: {view.health.timelineStatus}</p>
        <p>Runtime: {view.health.runtimeStatus}</p>
      </section>

      <section aria-label="Integridade">
        <h2>Integridade</h2>
        <p>Score: {view.integrity.integrityScore}</p>
        <p>Timeline Ready: {String(view.integrity.timelineReady)}</p>
        <p>Health Ready: {String(view.integrity.healthReady)}</p>
      </section>

      <section aria-label="Sessoes">
        <h2>Sessoes</h2>
        <ul>
          {view.sessions.map((session) => (
            <li key={session.sessionId}>
              {session.sessionId} — {session.status}
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Eventos">
        <h2>Eventos</h2>
        <p>Total: {view.events.length}</p>
      </section>

      <section aria-label="Estatisticas">
        <h2>Estatisticas</h2>
        <p>Total Eventos: {view.statistics.totalEvents}</p>
        <p>Total Incidentes: {view.statistics.totalIncidents}</p>
        <p>Providers Registered: {view.statistics.providersRegistered}</p>
      </section>
    </section>
  );
}

export default GuardianEnterpriseDashboard;
