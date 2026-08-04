/**
 * Guardian Knowledge consult bridge (GAI-08A).
 * Product-agnostic stub. SuperContab UKAL binding lives only in the adapter.
 * Path contract remains: UKAL -> Corporate RAG -> Knowledge Platform.
 */

import type { GuardianIncidentContext } from "../../types/incident_context_types";
import type {
  GuardianKnowledgeConsultRequest,
  GuardianKnowledgeConsultResult,
  GuardianUkalConsultFn,
} from "../../types/knowledge_consult_types";

export type {
  GuardianKnowledgeConsultRequest,
  GuardianKnowledgeConsultResult,
  GuardianUkalConsultFn,
};

function buildPergunta(context: GuardianIncidentContext): string {
  const incident = context.primaryIncident;
  return [
    "Diagnostico de incidente Guardian AI (somente consulta de conhecimento).",
    `Categoria: ${incident.category}.`,
    `Severidade: ${incident.severity}.`,
    `Modulo: ${incident.module}.`,
    `Mensagem: ${incident.message}.`,
    `Providers: ${context.providersInvolved.join(", ") || "n/a"}.`,
    `Correlation Score: ${context.correlationScore}.`,
    "Retorne causas possiveis e evidencias. Nao execute correcao.",
  ].join(" ");
}

/** Core stub: no SuperContab / UKAL import. Adapter injects real consult. */
export function consultKnowledgeViaUkal(
  request: GuardianKnowledgeConsultRequest,
): GuardianKnowledgeConsultResult {
  const pergunta = request.pergunta || buildPergunta(request.context);
  return {
    accepted: false,
    accessId: null,
    pipeline: ["ukal", "corporate_rag", "knowledge_platform"],
    confidenceScore: null,
    evidenceCount: 0,
    explanation: "Knowledge consult adapter not bound. Bind via product adapter.",
    evidenceStatements: [],
    references: [],
    reasons: ["adapter_not_bound", "core_stub"],
    raw: { pergunta, stub: true },
    bypassUsed: false,
  };
}

export function buildDefaultKnowledgePergunta(
  context: GuardianIncidentContext,
): string {
  return buildPergunta(context);
}