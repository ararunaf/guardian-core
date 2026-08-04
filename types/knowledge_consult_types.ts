/**
 * Guardian Knowledge consult types (GAI-03).
 * Shared between Knowledge Provider contract and UKAL bridge.
 */

import type { GuardianIncidentContext } from "./incident_context_types";

export interface GuardianKnowledgeConsultRequest {
  readonly context: GuardianIncidentContext;
  readonly pergunta: string;
}

export interface GuardianKnowledgeConsultResult {
  readonly accepted: boolean;
  readonly accessId: string | null;
  readonly pipeline: readonly ["ukal", "corporate_rag", "knowledge_platform"];
  readonly confidenceScore: number | null;
  readonly evidenceCount: number;
  readonly explanation: string;
  readonly evidenceStatements: readonly string[];
  readonly references: readonly string[];
  readonly reasons: readonly string[];
  readonly raw: unknown;
  readonly bypassUsed: false;
}

export type GuardianUkalConsultFn = (
  request: GuardianKnowledgeConsultRequest,
) => GuardianKnowledgeConsultResult;
