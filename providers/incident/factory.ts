/**
 * Incident Provider factory (GAI-01).
 * Creates a detection-only provider. Detection capability only.
 */

import type { IIncidentProvider } from "../../contracts/IIncidentProvider";
import type {
  GuardianIncident,
  GuardianIncidentSignal,
} from "../../types/incident_types";
import {
  DEFAULT_INCIDENT_ACTIONS,
  EMPTY_KNOWLEDGE_REFERENCE,
} from "../../types/incident_types";
import type { GuardianProviderDescriptor } from "../../types/provider_types";
import { GUARDIAN_PROVIDER_VERSION } from "../../types/provider_types";
import { getIncidentProviderConfiguration } from "./configuration";
import { DEFAULT_CATEGORY_SEVERITY } from "./types";

let incidentSeq = 0;

export function createIncidentId(): string {
  incidentSeq += 1;
  return `guardian-inc-${Date.now()}-${incidentSeq}`;
}

export function createCorrelationId(): string {
  return `guardian-corr-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function materializeIncident(signal: GuardianIncidentSignal): GuardianIncident {
  const severity =
    signal.severity ?? DEFAULT_CATEGORY_SEVERITY[signal.category] ?? "medium";
  const confidence =
    typeof signal.confidence === "number"
      ? Math.max(0, Math.min(1, signal.confidence))
      : 0.85;

  return {
    incidentId: createIncidentId(),
    timestamp: new Date().toISOString(),
    severity,
    source: signal.source ?? "runtime",
    module: signal.module ?? "unknown",
    workspace: signal.workspace ?? null,
    tenant: signal.tenant ?? null,
    company: signal.company ?? null,
    category: signal.category,
    provider: "incident",
    origin: signal.origin ?? "unknown",
    message: signal.message,
    stackTrace: signal.stackTrace ?? null,
    status: "detected",
    correlationId: signal.correlationId ?? createCorrelationId(),
    recoveryState: "none",
    confidence,
    actionsAvailable: DEFAULT_INCIDENT_ACTIONS,
    knowledgeReference: EMPTY_KNOWLEDGE_REFERENCE,
    diagnosis: null,
  };
}

export function createIncidentProvider(): IIncidentProvider {
  const config = getIncidentProviderConfiguration();
  return {
    id: "incident-provider",
    ready: config.enabled,
    name: "Guardian Incident Provider",
    detect(signal: GuardianIncidentSignal): GuardianIncident {
      return materializeIncident(signal);
    },
  };
}

export function describeIncidentProvider(): GuardianProviderDescriptor {
  const config = getIncidentProviderConfiguration();
  return {
    id: "incident",
    name: "Guardian Incident Provider",
    ready: config.enabled,
    operational: true,
    status: config.enabled ? "ready" : "inactive",
    version: GUARDIAN_PROVIDER_VERSION,
  };
}

export function resetIncidentIdSequence(): void {
  incidentSeq = 0;
}