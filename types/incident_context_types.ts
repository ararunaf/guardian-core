/**
 * Guardian Incident Context model types (GAI-03).
 * Complete incident context for Knowledge Diagnosis.
 * Future RCA/Patch/Deploy slots remain prepared.
 */

import type { GuardianCorrelationResult } from "./correlation_types";
import type { GuardianIncident, GuardianIncidentSeverity } from "./incident_types";
import type { EngineeringHealthModel } from "./health_types";
import type { EngineeringSession } from "./session_types";
import type { EngineeringTimelineEvent } from "./timeline_types";

/** Prepared future slot — never resolved in GAI-03 for RCA/Patch/Deploy. */
export interface GuardianPreparedSlot {
  readonly prepared: true;
  readonly referenceId: null;
}

export const EMPTY_PREPARED_SLOT: GuardianPreparedSlot = {
  prepared: true,
  referenceId: null,
};

export interface GuardianKnowledgeReferenceEntry {
  readonly referenceId: string;
  readonly source: "ukal" | "corporate_rag" | "knowledge_platform";
  readonly consulted: boolean;
  readonly accessId: string | null;
  readonly title: string;
  readonly snippet: string | null;
}

export interface GuardianNavigationContext {
  readonly route: string | null;
  readonly module: string | null;
  readonly workspace: string | null;
}

export interface GuardianCompositionContext {
  readonly compositionRoot: string | null;
  readonly providersBound: readonly string[];
}

export interface GuardianRuntimeSnapshot {
  readonly runtimeId: string;
  readonly status: string;
  readonly incidentCount: number;
  readonly capturedAt: string;
}

export interface GuardianIncidentContext {
  readonly contextId: string;
  readonly incidentId: string;
  readonly correlationId: string;
  readonly timeline: readonly EngineeringTimelineEvent[];
  readonly timelineEvents: readonly EngineeringTimelineEvent[];
  readonly runtime: GuardianRuntimeSnapshot;
  readonly workspace: string | null;
  readonly tenant: string | null;
  readonly empresa: string | null;
  readonly session: EngineeringSession | null;
  readonly guardianHealth: EngineeringHealthModel | null;
  readonly providersInvolved: readonly string[];
  readonly modulesInvolved: readonly string[];
  readonly navigationContext: GuardianNavigationContext;
  readonly compositionContext: GuardianCompositionContext;
  readonly stackTrace: string | null;
  readonly runtimeSnapshot: GuardianRuntimeSnapshot;
  readonly incidentHistory: readonly GuardianIncident[];
  readonly relatedIncidents: readonly GuardianIncident[];
  readonly correlationScore: number;
  readonly knowledgeReferences: readonly GuardianKnowledgeReferenceEntry[];
  readonly severity: GuardianIncidentSeverity;
  readonly confidence: number;
  readonly tags: readonly string[];
  /** Prepared for GAI-04 Root Cause Analysis — not filled in GAI-03. */
  readonly preparedDiagnosis: GuardianPreparedSlot;
  readonly preparedRootCause: GuardianPreparedSlot;
  readonly preparedPatch: GuardianPreparedSlot;
  readonly preparedDeployment: GuardianPreparedSlot;
  readonly primaryIncident: GuardianIncident;
  readonly correlation: GuardianCorrelationResult;
  readonly builtAt: string;
}
