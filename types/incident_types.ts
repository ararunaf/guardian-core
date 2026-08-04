/**
 * Guardian Incident model types (GAI-01).
 * Detection-only. Diagnosis remains empty.
 */

export type GuardianIncidentSeverity =
  | "critical"
  | "high"
  | "medium"
  | "low"
  | "info";

export type GuardianIncidentStatus =
  | "detected"
  | "recorded"
  | "acknowledged"
  | "closed";

export type GuardianIncidentRecoveryState =
  | "none"
  | "pending"
  | "not_applicable";

export type GuardianIncidentCategory =
  | "react_error"
  | "runtime_error"
  | "unhandled_exception"
  | "promise_rejection"
  | "network_error"
  | "http_error"
  | "supabase_error"
  | "ukal_error"
  | "corporate_rag_error"
  | "navigation_error"
  | "composition_error"
  | "provider_error"
  | "context_error";

export type GuardianIncidentSource =
  | "browser"
  | "runtime"
  | "network"
  | "adapter"
  | "provider"
  | "system";

export type GuardianProviderId =
  | "incident"
  | "knowledge"
  | "deployment"
  | "observability"
  | "performance"
  | "security"
  | "diagnostics"
  | "hypothesis"
  | "root-cause"
  | "change-intelligence"
  | "regression"
  | "prediction"
  | "capacity"
  | "threat"
  | "compliance"
  | "engineering-memory"
  | "engineering-ontology";

export type GuardianIncidentOrigin =
  | "window_error"
  | "unhandledrejection"
  | "react_boundary"
  | "fetch"
  | "http_client"
  | "supabase_client"
  | "ukal_runtime"
  | "corporate_rag"
  | "navigation_engine"
  | "composition_root"
  | "provider_runtime"
  | "context_runtime"
  | "manual"
  | "unknown";

/** Prepared knowledge reference slot. Never resolved in GAI-01. */
export interface GuardianKnowledgeReference {
  readonly prepared: true;
  readonly referenceId: string | null;
  readonly consulted: false;
}

export interface GuardianIncidentActionsAvailable {
  readonly diagnose: false;
  readonly hotfix: false;
  readonly patch: false;
  readonly deploy: false;
  readonly analyze: false;
}

/**
 * Official Guardian Incident model.
 * Diagnosis intentionally empty in GAI-01.
 */
export interface GuardianIncident {
  readonly incidentId: string;
  readonly timestamp: string;
  readonly severity: GuardianIncidentSeverity;
  readonly source: GuardianIncidentSource;
  readonly module: string;
  readonly workspace: string | null;
  readonly tenant: string | null;
  readonly company: string | null;
  readonly category: GuardianIncidentCategory;
  readonly provider: GuardianProviderId;
  readonly origin: GuardianIncidentOrigin;
  readonly message: string;
  readonly stackTrace: string | null;
  readonly status: GuardianIncidentStatus;
  readonly correlationId: string;
  readonly recoveryState: GuardianIncidentRecoveryState;
  readonly confidence: number;
  readonly actionsAvailable: GuardianIncidentActionsAvailable;
  readonly knowledgeReference: GuardianKnowledgeReference;
  /** Diagnosis must remain empty in GAI-01. */
  readonly diagnosis: null;
}

/** Normalized detection signal consumed by Incident Provider / Engine. */
export interface GuardianIncidentSignal {
  readonly category: GuardianIncidentCategory;
  readonly message: string;
  readonly stackTrace?: string | null;
  readonly source?: GuardianIncidentSource;
  readonly origin?: GuardianIncidentOrigin;
  readonly module?: string;
  readonly workspace?: string | null;
  readonly tenant?: string | null;
  readonly company?: string | null;
  readonly correlationId?: string;
  readonly severity?: GuardianIncidentSeverity;
  readonly confidence?: number;
  readonly metadata?: Readonly<Record<string, string>>;
}

export const GUARDIAN_INCIDENT_CATEGORIES: readonly GuardianIncidentCategory[] = [
  "react_error",
  "runtime_error",
  "unhandled_exception",
  "promise_rejection",
  "network_error",
  "http_error",
  "supabase_error",
  "ukal_error",
  "corporate_rag_error",
  "navigation_error",
  "composition_error",
  "provider_error",
  "context_error",
] as const;

export const DEFAULT_INCIDENT_ACTIONS: GuardianIncidentActionsAvailable = {
  diagnose: false,
  hotfix: false,
  patch: false,
  deploy: false,
  analyze: false,
};

export const EMPTY_KNOWLEDGE_REFERENCE: GuardianKnowledgeReference = {
  prepared: true,
  referenceId: null,
  consulted: false,
};
