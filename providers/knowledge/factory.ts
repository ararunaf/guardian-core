/**
 * Guardian Knowledge Provider factory (GAI-03 / GAI-05 / GAI-06).
 * Operational for consult-only diagnosis and performance evidence support.
 * Path: UKAL -> Corporate RAG -> Knowledge Platform.
 * Does not generate performance/prediction/capacity analysis.
 * Product-agnostic. No SuperContab dependency.
 */

import type { IKnowledgeProvider } from "../../contracts/IKnowledgeProvider";
import type { GuardianUkalConsultFn } from "../../types/knowledge_consult_types";
import type { GuardianProviderDescriptor } from "../../types/provider_types";
import { GUARDIAN_PROVIDER_VERSION } from "../../types/provider_types";
import { getKnowledgeProviderConfiguration } from "./configuration";
import {
  buildDefaultKnowledgePergunta,
  consultKnowledgeViaUkal,
} from "./ukal_bridge";

let consultAdapter: GuardianUkalConsultFn = consultKnowledgeViaUkal;

export function setKnowledgeConsultAdapter(adapter: GuardianUkalConsultFn | null): void {
  consultAdapter = adapter ?? consultKnowledgeViaUkal;
}

export function createKnowledgeProvider(): IKnowledgeProvider {
  const config = getKnowledgeProviderConfiguration();
  return {
    id: "knowledge-provider",
    ready: config.enabled,
    name: "Guardian Knowledge Provider",
    operational: true,
    capabilities: {
      contextBuilder: true,
      correlation: true,
      diagnosis: true,
      hypothesisGeneration: false,
      rootCauseAnalysis: false,
      changeIntelligence: false,
      regressionAnalysis: false,
      performanceEvidence: true,
      predictionEvidence: true,
      capacityEvidence: true,
      securityEvidence: true,
      threatEvidence: true,
      complianceEvidence: true,
      engineeringMemoryEvidence: true,
      engineeringOntologyEvidence: true,
      knowledgeObjectEvidence: true,
      consultOnly: true,
      codeExecution: false,
      autoPatch: false,
      autoDeploy: false,
    },
    consult(request) {
      if (!config.enabled) {
        throw new Error("Knowledge Provider is not enabled");
      }
      return consultAdapter(request);
    },
    buildPergunta(context) {
      return buildDefaultKnowledgePergunta(context);
    },
  };
}

export function describeKnowledgeProvider(): GuardianProviderDescriptor {
  const config = getKnowledgeProviderConfiguration();
  return {
    id: "knowledge",
    name: "Guardian Knowledge Provider",
    ready: config.enabled,
    operational: true,
    status: config.enabled ? "ready" : "inactive",
    version: GUARDIAN_PROVIDER_VERSION,
  };
}