/**
 * Guardian Provider Registry (GAI-08).
 * Registers reusable providers. Product-agnostic.
 */

import type { IDeploymentProvider } from "../contracts/IDeploymentProvider";
import type { IDiagnosticsProvider } from "../contracts/IDiagnosticsProvider";
import type { IHypothesisProvider } from "../contracts/IHypothesisProvider";
import type { IIncidentProvider } from "../contracts/IIncidentProvider";
import type { IKnowledgeProvider } from "../contracts/IKnowledgeProvider";
import type { IObservabilityProvider } from "../contracts/IObservabilityProvider";
import type { IPerformanceProvider } from "../contracts/IPerformanceProvider";
import type { IRootCauseProvider } from "../contracts/IRootCauseProvider";
import type { IChangeIntelligenceProvider } from "../contracts/IChangeIntelligenceProvider";
import type { IRegressionProvider } from "../contracts/IRegressionProvider";
import type { IPredictionProvider } from "../contracts/IPredictionProvider";
import type { ICapacityProvider } from "../contracts/ICapacityProvider";
import type { IThreatProvider } from "../contracts/IThreatProvider";
import type { IComplianceProvider } from "../contracts/IComplianceProvider";
import type { ISecurityProvider } from "../contracts/ISecurityProvider";
import type { IEngineeringMemoryProvider } from "../contracts/IEngineeringMemoryProvider";
import type { IEngineeringOntologyProvider } from "../contracts/IEngineeringOntologyProvider";
import type {
  GuardianProviderDescriptor,
  GuardianProviderKind,
} from "../types/provider_types";
import { GUARDIAN_PROVIDER_IDS } from "../types/provider_types";

export interface GuardianProviderBundle {
  incident: IIncidentProvider;
  knowledge: IKnowledgeProvider;
  deployment: IDeploymentProvider;
  observability: IObservabilityProvider;
  performance: IPerformanceProvider;
  security: ISecurityProvider;
  diagnostics: IDiagnosticsProvider;
  hypothesis: IHypothesisProvider;
  "root-cause": IRootCauseProvider;
  "change-intelligence": IChangeIntelligenceProvider;
  regression: IRegressionProvider;
  prediction: IPredictionProvider;
  capacity: ICapacityProvider;
  threat: IThreatProvider;
  compliance: IComplianceProvider;
  "engineering-memory": IEngineeringMemoryProvider;
  "engineering-ontology": IEngineeringOntologyProvider;
}

class GuardianProviderRegistryImpl {
  private providers = new Map<GuardianProviderKind, unknown>();
  private descriptors = new Map<GuardianProviderKind, GuardianProviderDescriptor>();

  register<K extends keyof GuardianProviderBundle>(
    kind: K,
    provider: GuardianProviderBundle[K],
    descriptor: GuardianProviderDescriptor,
  ): void {
    this.providers.set(kind, provider);
    this.descriptors.set(kind, descriptor);
  }

  get<K extends keyof GuardianProviderBundle>(kind: K): GuardianProviderBundle[K] | null {
    return (this.providers.get(kind) as GuardianProviderBundle[K] | undefined) ?? null;
  }

  getDescriptor(kind: GuardianProviderKind): GuardianProviderDescriptor | null {
    return this.descriptors.get(kind) ?? null;
  }

  list(): readonly GuardianProviderDescriptor[] {
    return GUARDIAN_PROVIDER_IDS.map(
      (id) =>
        this.descriptors.get(id) ?? {
          id,
          name: `${id} provider`,
          ready: false,
          operational: false,
          status: "inactive" as const,
          version: "0.0.0",
        },
    );
  }

  listReady(): readonly GuardianProviderDescriptor[] {
    return this.list().filter((p) => p.ready);
  }

  hasAllRequired(): boolean {
    return GUARDIAN_PROVIDER_IDS.every((id) => {
      const d = this.descriptors.get(id);
      return Boolean(d?.ready);
    });
  }

  reset(): void {
    this.providers.clear();
    this.descriptors.clear();
  }
}

export const GuardianProviderRegistry = new GuardianProviderRegistryImpl();
