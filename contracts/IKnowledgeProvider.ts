/**
 * Guardian AI - IKnowledgeProvider contract (GAI-03 / GAI-05 / GAI-06).
 * Consult-only knowledge access via UKAL -> Corporate RAG -> Knowledge Platform.
 * Feeds Knowledge Diagnosis and performance evidence. Never generates analysis.
 */

import type { GuardianIncidentContext } from "../types/incident_context_types";
import type {
  GuardianKnowledgeConsultRequest,
  GuardianKnowledgeConsultResult,
} from "../types/knowledge_consult_types";

export interface IKnowledgeProvider {
  readonly id: "knowledge-provider";
  readonly ready: boolean;
  readonly name: string;
  readonly operational: boolean;
  readonly capabilities: {
    readonly contextBuilder: true;
    readonly correlation: true;
    readonly diagnosis: true;
    readonly hypothesisGeneration: false;
    readonly rootCauseAnalysis: false;
    readonly changeIntelligence: false;
    readonly regressionAnalysis: false;
    readonly performanceEvidence: true;
    readonly predictionEvidence: true;
    readonly capacityEvidence: true;
    readonly securityEvidence: true;
    readonly threatEvidence: true;
    readonly complianceEvidence: true;
    readonly engineeringMemoryEvidence: true;
    readonly engineeringOntologyEvidence: true;
    readonly knowledgeObjectEvidence: true;
    readonly consultOnly: true;
    readonly codeExecution: false;
    readonly autoPatch: false;
    readonly autoDeploy: false;
  };
  consult(request: GuardianKnowledgeConsultRequest): GuardianKnowledgeConsultResult;
  buildPergunta(context: GuardianIncidentContext): string;
}