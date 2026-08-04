/**
 * Guardian Knowledge Diagnosis Engine (GAI-03).
 * Incident Context -> UKAL -> Corporate RAG -> Knowledge Platform -> Diagnosis.
 * Consult knowledge only. Never executes code, patches, deploys, or tests.
 */

import { IncidentContextBuilder } from "../context/incident_context_builder";
import { GuardianEventBus } from "../events/event_bus";
import { KnowledgeProviderRegistry } from "../providers/knowledge/registry";
import { GuardianRuntime } from "../runtime/guardian_runtime";
import { EngineeringTimeline } from "../timeline/timeline_service";
import type { GuardianDiagnosis } from "../types/diagnosis_types";
import type { GuardianIncident } from "../types/incident_types";
import type { GuardianIncidentContext } from "../types/incident_context_types";
import { createEvidenceChain, resetEvidenceCounters } from "./evidence_chain";

export const KNOWLEDGE_DIAGNOSIS_ENGINE_ID =
  "guardian-knowledge-diagnosis-engine" as const;

export const KNOWLEDGE_QUERY_STARTED_EVENT =
  "guardian.knowledge.query.started" as const;
export const KNOWLEDGE_QUERY_FINISHED_EVENT =
  "guardian.knowledge.query.finished" as const;
export const DIAGNOSIS_CREATED_EVENT = "guardian.diagnosis.created" as const;
export const EVIDENCE_GENERATED_EVENT = "guardian.evidence.generated" as const;

export type KnowledgeDiagnosisEngineStatus = "inactive" | "ready";

let diagnosisSeq = 0;

function createDiagnosisId(): string {
  diagnosisSeq += 1;
  return `guardian-diagnosis-${Date.now()}-${diagnosisSeq}`;
}

function derivePossibleCauses(
  context: GuardianIncidentContext,
  evidenceIds: readonly string[],
): GuardianDiagnosis["possibleCauses"] {
  const incident = context.primaryIncident;
  const causes = [
    {
      causeId: `cause-category-${incident.category}`,
      description: `Falha associada a categoria ${incident.category} no modulo ${incident.module}.`,
      likelihood: Math.min(0.9, 0.4 + context.correlationScore * 0.4),
      evidenceIds,
    },
    {
      causeId: `cause-provider-${incident.provider}`,
      description: `Provider ${incident.provider} pode ter contribuido para o incidente.`,
      likelihood: Math.min(0.8, 0.3 + context.providersInvolved.length * 0.1),
      evidenceIds: evidenceIds.slice(0, 2),
    },
  ];

  if (context.relatedIncidents.length > 0) {
    causes.push({
      causeId: "cause-correlated-incidents",
      description: `Existem ${context.relatedIncidents.length} incidente(s) correlacionado(s) no mesmo contexto.`,
      likelihood: Math.min(0.85, 0.35 + context.correlationScore * 0.5),
      evidenceIds,
    });
  }

  return causes;
}

class KnowledgeDiagnosisEngineImpl {
  readonly id = KNOWLEDGE_DIAGNOSIS_ENGINE_ID;
  private status: KnowledgeDiagnosisEngineStatus = "inactive";
  private lastDiagnosis: GuardianDiagnosis | null = null;
  private diagnosisCount = 0;

  initialize(): void {
    IncidentContextBuilder.initialize();
    KnowledgeProviderRegistry.ensure();
    EngineeringTimeline.initialize();
    this.status = "ready";
  }

  getStatus(): KnowledgeDiagnosisEngineStatus {
    return this.status;
  }

  isReady(): boolean {
    return this.status === "ready";
  }

  getLastDiagnosis(): GuardianDiagnosis | null {
    return this.lastDiagnosis;
  }

  getDiagnosisCount(): number {
    return this.diagnosisCount;
  }

  /**
   * Official diagnosis entrypoint.
   * Always builds Incident Context before consulting knowledge.
   */
  diagnoseIncident(incident: GuardianIncident): GuardianDiagnosis {
    if (this.status !== "ready") {
      this.initialize();
    }

    const context = IncidentContextBuilder.build({
      incident,
      candidateIncidents: GuardianRuntime.listIncidents(),
    });

    return this.diagnose(context);
  }

  /**
   * Diagnose from a pre-built Incident Context.
   * Knowledge consultation must never bypass this context.
   */
  diagnose(context: GuardianIncidentContext): GuardianDiagnosis {
    if (this.status !== "ready") {
      this.initialize();
    }

    const provider = KnowledgeProviderRegistry.ensure();
    if (!provider.ready || !provider.operational) {
      throw new Error("Knowledge Provider is not ready for diagnosis");
    }

    const diagnosisId = createDiagnosisId();
    const pergunta = provider.buildPergunta(context);

    GuardianEventBus.publish(KNOWLEDGE_QUERY_STARTED_EVENT, this.id, {
      diagnosisId,
      contextId: context.contextId,
      incidentId: context.incidentId,
      pipeline: ["ukal", "corporate_rag", "knowledge_platform"],
    });

    const consult = provider.consult({ context, pergunta });

    GuardianEventBus.publish(KNOWLEDGE_QUERY_FINISHED_EVENT, this.id, {
      diagnosisId,
      contextId: context.contextId,
      incidentId: context.incidentId,
      accepted: consult.accepted,
      accessId: consult.accessId,
      evidenceCount: consult.evidenceCount,
      bypassUsed: consult.bypassUsed,
    });

    const seeds = [
      {
        statement: `Incidente ${context.incidentId} (${context.primaryIncident.category}): ${context.primaryIncident.message}`,
        source: "ukal" as const,
        referenceId: consult.accessId,
        weight: 1,
      },
      {
        statement: `Correlation Score ${context.correlationScore} com ${context.relatedIncidents.length} incidente(s) relacionado(s).`,
        source: "ukal" as const,
        referenceId: context.correlationId,
        weight: 0.8,
      },
      ...consult.evidenceStatements.slice(0, 5).map((statement, index) => ({
        statement,
        source: "corporate_rag" as const,
        referenceId: consult.references[index] ?? consult.accessId,
        weight: Math.max(0.2, 0.7 - index * 0.1),
      })),
      {
        statement: "Consulta oficial via Knowledge Platform (sem bypass).",
        source: "knowledge_platform" as const,
        referenceId: consult.accessId,
        weight: 0.6,
      },
    ];

    const evidenceChain = createEvidenceChain({
      diagnosisId,
      incidentId: context.incidentId,
      contextId: context.contextId,
      seeds,
    });

    GuardianEventBus.publish(EVIDENCE_GENERATED_EVENT, this.id, {
      diagnosisId,
      chainId: evidenceChain.chainId,
      itemCount: evidenceChain.items.length,
    });

    const knowledgeSources = [
      {
        sourceId: "ukal",
        kind: "ukal" as const,
        accessId: consult.accessId,
        label: "Unified Knowledge Access Layer",
        consultedAt: new Date().toISOString(),
      },
      {
        sourceId: "corporate_rag",
        kind: "corporate_rag" as const,
        accessId: consult.accessId,
        label: "Corporate RAG",
        consultedAt: new Date().toISOString(),
      },
      {
        sourceId: "knowledge_platform",
        kind: "knowledge_platform" as const,
        accessId: consult.accessId,
        label: "Enterprise Knowledge Platform",
        consultedAt: new Date().toISOString(),
      },
    ];

    const confidenceScore = Number(
      Math.min(
        1,
        Math.max(
          0,
          (consult.confidenceScore ?? 0.35) * 0.6 +
            context.correlationScore * 0.25 +
            Math.min(0.15, evidenceChain.items.length * 0.03),
        ),
      ).toFixed(4),
    );

    const diagnosis: GuardianDiagnosis = {
      diagnosisId,
      incidentId: context.incidentId,
      contextId: context.contextId,
      timestamp: new Date().toISOString(),
      knowledgeSources,
      evidenceChain,
      confidenceScore,
      possibleCauses: derivePossibleCauses(
        context,
        evidenceChain.items.map((item) => item.evidenceId),
      ),
      affectedComponents: context.modulesInvolved,
      recommendedActions: [
        {
          actionId: "investigate-timeline",
          description:
            "Investigar a Timeline expandida e a cadeia de evidencias do incidente.",
          kind: "investigate",
          automatic: false,
        },
        {
          actionId: "observe-correlation",
          description:
            "Observar incidentes correlacionados e providers envolvidos sem executar correcao.",
          kind: "observe",
          automatic: false,
        },
        {
          actionId: "document-diagnosis",
          description:
            "Documentar o diagnostico baseado em conhecimento para evolucao GAI-04 (RCA).",
          kind: "document",
          automatic: false,
        },
      ],
      explanation: consult.explanation,
      references: consult.references,
      status: consult.accepted || consult.evidenceCount > 0 ? "complete" : "empty_knowledge",
      autoCorrection: false,
      codeExecution: false,
      patchSuggested: false,
    };

    this.lastDiagnosis = diagnosis;
    this.diagnosisCount += 1;

    GuardianEventBus.publish(DIAGNOSIS_CREATED_EVENT, this.id, {
      diagnosisId: diagnosis.diagnosisId,
      incidentId: diagnosis.incidentId,
      contextId: diagnosis.contextId,
      confidenceScore: diagnosis.confidenceScore,
      status: diagnosis.status,
    });

    return diagnosis;
  }

  reset(): void {
    this.status = "inactive";
    this.lastDiagnosis = null;
    this.diagnosisCount = 0;
    diagnosisSeq = 0;
    resetEvidenceCounters();
  }
}

export const KnowledgeDiagnosisEngine = new KnowledgeDiagnosisEngineImpl();

export function createKnowledgeDiagnosisEngine(): KnowledgeDiagnosisEngineImpl {
  return new KnowledgeDiagnosisEngineImpl();
}
