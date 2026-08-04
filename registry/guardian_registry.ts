/**
 * Guardian Registry (GAI-08A).
 * Registers foundation modules, Providers, and Observability services.
 */

import type { IGuardianPlugin } from "../contracts";
import type { GuardianModuleDescriptor, GuardianModuleId } from "../types";
import type { GuardianProviderDescriptor, GuardianProviderKind } from "../types/provider_types";
import { GUARDIAN_PROVIDER_IDS } from "../types/provider_types";

export type GuardianServiceId =
  | "timeline-service"
  | "health-service"
  | "session-service"
  | "audit-service"
  | "statistics-service"
  | "correlation-engine"
  | "incident-context-builder"
  | "knowledge-diagnosis-engine"
  | "hypothesis-engine"
  | "root-cause-engine"
  | "change-intelligence-engine"
  | "regression-intelligence-engine"
  | "performance-intelligence-engine"
  | "performance-prediction-engine"
  | "capacity-analysis-engine"
  | "security-intelligence-engine"
  | "threat-prediction-engine"
  | "compliance-analysis-engine"
  | "engineering-knowledge-platform"
  | "engineering-memory-engine"
  | "engineering-ontology-engine";

export interface GuardianServiceDescriptor {
  readonly id: GuardianServiceId;
  readonly name: string;
  readonly ready: boolean;
  readonly module:
    | "timeline"
    | "observability"
    | "correlation"
    | "diagnosis"
    | "context"
    | "hypothesis"
    | "root_cause"
    | "change"
    | "regression"
    | "performance"
    | "prediction"
    | "capacity"
    | "security"
    | "threat"
    | "compliance"
    | "engineering_knowledge"
    | "engineering_memory"
    | "engineering_ontology";
}

const FOUNDATION_MODULES: readonly GuardianModuleDescriptor[] = [
  { id: "core", name: "Guardian Core", ready: true },
  { id: "contracts", name: "Guardian Contracts", ready: true },
  { id: "runtime", name: "Guardian Runtime", ready: true },
  { id: "events", name: "Guardian Event Bus", ready: true },
  { id: "registry", name: "Guardian Registry", ready: true },
  { id: "sdk", name: "Guardian SDK", ready: true },
  { id: "plugins", name: "Guardian Plugin Model", ready: true },
  { id: "dashboard", name: "Guardian Dashboard", ready: true },
  { id: "context", name: "Guardian Context", ready: true },
  { id: "types", name: "Guardian Types", ready: true },
  { id: "adapters", name: "Guardian Adapters", ready: true },
  { id: "providers", name: "Guardian Providers", ready: true },
  { id: "incident", name: "Incident Detection Engine", ready: true },
  { id: "timeline", name: "Engineering Timeline", ready: true },
  { id: "observability", name: "Engineering Observability Center", ready: true },
  { id: "correlation", name: "Correlation Engine", ready: true },
  { id: "diagnosis", name: "Knowledge Diagnosis Engine", ready: true },
  { id: "hypothesis", name: "Hypothesis Engine", ready: true },
  { id: "root_cause", name: "Root Cause Analysis Engine", ready: true },
  { id: "change", name: "Change Intelligence Engine", ready: true },
  { id: "regression", name: "Regression Intelligence Engine", ready: true },
  { id: "performance", name: "Performance Intelligence Engine", ready: true },
  { id: "prediction", name: "Performance Prediction Engine", ready: true },
  { id: "capacity", name: "Capacity Analysis Engine", ready: true },
  { id: "security", name: "Security Intelligence Engine", ready: true },
  { id: "threat", name: "Threat Prediction Engine", ready: true },
  { id: "compliance", name: "Compliance Analysis Engine", ready: true },
  { id: "engineering_knowledge", name: "Engineering Knowledge Platform", ready: true },
  { id: "engineering_memory", name: "Engineering Memory", ready: true },
  { id: "engineering_ontology", name: "Engineering Ontology", ready: true },
  { id: "version", name: "Guardian Version Manifest", ready: true },
  { id: "compatibility", name: "Guardian Compatibility Layer", ready: true },
] as const;

const OBSERVABILITY_SERVICES: readonly GuardianServiceDescriptor[] = [
  { id: "timeline-service", name: "Timeline Service", ready: true, module: "timeline" },
  { id: "health-service", name: "Health Service", ready: true, module: "observability" },
  { id: "session-service", name: "Session Service", ready: true, module: "observability" },
  { id: "audit-service", name: "Audit Service", ready: true, module: "observability" },
  { id: "statistics-service", name: "Statistics Service", ready: true, module: "observability" },
] as const;

const GAI03_SERVICES: readonly GuardianServiceDescriptor[] = [
  { id: "correlation-engine", name: "Correlation Engine", ready: true, module: "correlation" },
  { id: "incident-context-builder", name: "Incident Context Builder", ready: true, module: "context" },
  { id: "knowledge-diagnosis-engine", name: "Knowledge Diagnosis Engine", ready: true, module: "diagnosis" },
] as const;

const GAI04_SERVICES: readonly GuardianServiceDescriptor[] = [
  { id: "hypothesis-engine", name: "Hypothesis Engine", ready: true, module: "hypothesis" },
  { id: "root-cause-engine", name: "Root Cause Analysis Engine", ready: true, module: "root_cause" },
] as const;

const GAI05_SERVICES: readonly GuardianServiceDescriptor[] = [
  { id: "change-intelligence-engine", name: "Change Intelligence Engine", ready: true, module: "change" },
  { id: "regression-intelligence-engine", name: "Regression Intelligence Engine", ready: true, module: "regression" },
] as const;

const GAI06_SERVICES: readonly GuardianServiceDescriptor[] = [
  { id: "performance-intelligence-engine", name: "Performance Intelligence Engine", ready: true, module: "performance" },
  { id: "performance-prediction-engine", name: "Performance Prediction Engine", ready: true, module: "prediction" },
  { id: "capacity-analysis-engine", name: "Capacity Analysis Engine", ready: true, module: "capacity" },
] as const;

const GAI07_SERVICES: readonly GuardianServiceDescriptor[] = [
  { id: "security-intelligence-engine", name: "Security Intelligence Engine", ready: true, module: "security" },
  { id: "threat-prediction-engine", name: "Threat Prediction Engine", ready: true, module: "threat" },
  { id: "compliance-analysis-engine", name: "Compliance Analysis Engine", ready: true, module: "compliance" },
] as const;

const GAI08_SERVICES: readonly GuardianServiceDescriptor[] = [
  { id: "engineering-knowledge-platform", name: "Engineering Knowledge Platform", ready: true, module: "engineering_knowledge" },
  { id: "engineering-memory-engine", name: "Engineering Memory", ready: true, module: "engineering_memory" },
  { id: "engineering-ontology-engine", name: "Engineering Ontology", ready: true, module: "engineering_ontology" },
] as const;

const ALL_GUARDIAN_SERVICES: readonly GuardianServiceDescriptor[] = [
  ...OBSERVABILITY_SERVICES,
  ...GAI03_SERVICES,
  ...GAI04_SERVICES,
  ...GAI05_SERVICES,
  ...GAI06_SERVICES,
  ...GAI07_SERVICES,
  ...GAI08_SERVICES,
] as const;

const PROVIDER_MODULE_NAMES: Record<GuardianProviderKind, string> = {
  incident: "Incident Provider",
  knowledge: "Knowledge Provider",
  deployment: "Deployment Provider",
  observability: "Observability Provider",
  performance: "Performance Provider",
  security: "Security Provider",
  diagnostics: "Diagnostics Provider",
  hypothesis: "Hypothesis Provider",
  "root-cause": "Root Cause Provider",
  "change-intelligence": "Change Intelligence Provider",
  regression: "Regression Provider",
  prediction: "Prediction Provider",
  capacity: "Capacity Provider",
  threat: "Threat Provider",
  compliance: "Compliance Provider",
  "engineering-memory": "Engineering Memory Provider",
  "engineering-ontology": "Engineering Ontology Provider",
};

class GuardianRegistryImpl {
  private plugins = new Map<string, IGuardianPlugin>();
  private modules = new Map<GuardianModuleId, GuardianModuleDescriptor>();
  private providers = new Map<GuardianProviderKind, GuardianProviderDescriptor>();
  private services = new Map<GuardianServiceId, GuardianServiceDescriptor>();

  constructor() {
    this.bootstrap();
  }

  private bootstrap(): void {
    for (const module of FOUNDATION_MODULES) {
      this.modules.set(module.id, module);
    }
    for (const service of ALL_GUARDIAN_SERVICES) {
      this.services.set(service.id, service);
    }
  }

  listModules(): readonly GuardianModuleDescriptor[] {
    return [...this.modules.values()];
  }

  getModule(id: GuardianModuleId): GuardianModuleDescriptor | null {
    return this.modules.get(id) ?? null;
  }

  registerProvider(descriptor: GuardianProviderDescriptor): void {
    this.providers.set(descriptor.id, descriptor);
  }

  getProvider(id: GuardianProviderKind): GuardianProviderDescriptor | null {
    return this.providers.get(id) ?? null;
  }

  listProviders(): readonly GuardianProviderDescriptor[] {
    return GUARDIAN_PROVIDER_IDS.map(
      (id) =>
        this.providers.get(id) ?? {
          id,
          name: PROVIDER_MODULE_NAMES[id],
          ready: false,
          operational: false,
          status: "inactive" as const,
          version: "0.0.0",
        },
    );
  }

  listReadyProviders(): readonly GuardianProviderDescriptor[] {
    return this.listProviders().filter((p) => p.ready);
  }

  registerService(descriptor: GuardianServiceDescriptor): void {
    this.services.set(descriptor.id, descriptor);
  }

  getService(id: GuardianServiceId): GuardianServiceDescriptor | null {
    return this.services.get(id) ?? null;
  }

  listServices(): readonly GuardianServiceDescriptor[] {
    return ALL_GUARDIAN_SERVICES.map(
      (service) => this.services.get(service.id) ?? service,
    );
  }

  listReadyServices(): readonly GuardianServiceDescriptor[] {
    return this.listServices().filter((s) => s.ready);
  }

  registerPlugin(plugin: IGuardianPlugin): void {
    this.plugins.set(plugin.id, plugin);
  }

  unregisterPlugin(pluginId: string): boolean {
    return this.plugins.delete(pluginId);
  }

  getPlugin(pluginId: string): IGuardianPlugin | null {
    return this.plugins.get(pluginId) ?? null;
  }

  listPlugins(): readonly IGuardianPlugin[] {
    return [...this.plugins.values()];
  }

  listActivePlugins(): readonly IGuardianPlugin[] {
    return this.listPlugins().filter((p) => p.state === "active");
  }

  reset(): void {
    this.plugins.clear();
    this.modules.clear();
    this.providers.clear();
    this.services.clear();
    this.bootstrap();
  }
}

export const GuardianRegistry = new GuardianRegistryImpl();
export {
  FOUNDATION_MODULES,
  PROVIDER_MODULE_NAMES,
  OBSERVABILITY_SERVICES,
  GAI03_SERVICES,
  GAI04_SERVICES,
  GAI05_SERVICES,
  GAI06_SERVICES,
  GAI07_SERVICES,
  GAI08_SERVICES,
  ALL_GUARDIAN_SERVICES,
};
