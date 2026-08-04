/**
 * Guardian Engineering Knowledge Platform types (GAI-08).
 * Structural knowledge only. No ML. No generative AI. No auto-learning.
 */

import type { GuardianPreparedFutureSlot } from "./hypothesis_types";
import { EMPTY_HYPOTHESIS_PREPARED_SLOT } from "./hypothesis_types";

export type GuardianOntologyEntityType =
  | "Module"
  | "Component"
  | "Service"
  | "Provider"
  | "Workspace"
  | "Cockpit"
  | "Route"
  | "Context"
  | "KnowledgeObject"
  | "Incident"
  | "Diagnosis"
  | "Hypothesis"
  | "RootCause"
  | "Change"
  | "Regression"
  | "Performance"
  | "Capacity"
  | "Security"
  | "Threat"
  | "Compliance"
  | "Evidence"
  | "Decision"
  | "Recommendation"
  | "Commit"
  | "Deployment"
  | "Tenant"
  | "Organization"
  | "Dependency"
  | "Relationship";

export type GuardianOntologyEntityStatus =
  | "registered"
  | "indexed"
  | "related"
  | "published"
  | "archived";

export type GuardianOntologyRelationType =
  | "contains"
  | "implements"
  | "diagnoses"
  | "causes"
  | "changes"
  | "regresses"
  | "impacts_performance"
  | "requires_capacity"
  | "exposes_security"
  | "predicts_threat"
  | "validates_compliance"
  | "recommends"
  | "decides"
  | "prepares_patch"
  | "depends_on"
  | "evidences"
  | "references"
  | "belongs_to"
  | "serves";

export const GUARDIAN_ONTOLOGY_ENTITY_TYPES: readonly GuardianOntologyEntityType[] = [
  "Module",
  "Component",
  "Service",
  "Provider",
  "Workspace",
  "Cockpit",
  "Route",
  "Context",
  "KnowledgeObject",
  "Incident",
  "Diagnosis",
  "Hypothesis",
  "RootCause",
  "Change",
  "Regression",
  "Performance",
  "Capacity",
  "Security",
  "Threat",
  "Compliance",
  "Evidence",
  "Decision",
  "Recommendation",
  "Commit",
  "Deployment",
  "Tenant",
  "Organization",
  "Dependency",
  "Relationship",
] as const;

export const CANONICAL_ONTOLOGY_RELATIONS: readonly {
  readonly from: GuardianOntologyEntityType;
  readonly to: GuardianOntologyEntityType;
  readonly relation: GuardianOntologyRelationType;
}[] = [
  { from: "Module", to: "Component", relation: "contains" },
  { from: "Component", to: "Service", relation: "implements" },
  { from: "Incident", to: "Diagnosis", relation: "diagnoses" },
  { from: "Diagnosis", to: "RootCause", relation: "causes" },
  { from: "RootCause", to: "Change", relation: "changes" },
  { from: "Change", to: "Regression", relation: "regresses" },
  { from: "Regression", to: "Performance", relation: "impacts_performance" },
  { from: "Performance", to: "Capacity", relation: "requires_capacity" },
  { from: "Capacity", to: "Security", relation: "exposes_security" },
  { from: "Security", to: "Threat", relation: "predicts_threat" },
  { from: "Threat", to: "Compliance", relation: "validates_compliance" },
  { from: "Compliance", to: "Recommendation", relation: "recommends" },
  { from: "Recommendation", to: "Decision", relation: "decides" },
  { from: "Decision", to: "Dependency", relation: "prepares_patch" },
] as const;

export interface GuardianOntologyRelation {
  readonly relationId: string;
  readonly fromEntityId: string;
  readonly fromType: GuardianOntologyEntityType;
  readonly toEntityId: string;
  readonly toType: GuardianOntologyEntityType;
  readonly relationType: GuardianOntologyRelationType;
  readonly timestamp: string;
  readonly metadata: Readonly<Record<string, string | number | boolean | null>>;
}

export interface GuardianOntologyEntity {
  readonly id: string;
  readonly type: GuardianOntologyEntityType;
  readonly relations: readonly string[];
  readonly metadata: Readonly<Record<string, string | number | boolean | null>>;
  readonly status: GuardianOntologyEntityStatus;
  readonly timestamp: string;
  readonly knowledgeReferences: readonly string[];
  readonly evidenceReferences: readonly string[];
}

export type GuardianEngineeringMemoryKind =
  | "incident"
  | "diagnosis"
  | "hypothesis"
  | "root_cause"
  | "change"
  | "regression"
  | "performance"
  | "capacity"
  | "security"
  | "compliance"
  | "decision"
  | "recommendation"
  | "pattern";

export interface GuardianEngineeringMemoryRecord {
  readonly memoryId: string;
  readonly kind: GuardianEngineeringMemoryKind;
  readonly entityId: string;
  readonly entityType: GuardianOntologyEntityType;
  readonly title: string;
  readonly summary: string;
  readonly evidenceChain: readonly string[];
  readonly knowledgeReferences: readonly string[];
  readonly relations: readonly string[];
  readonly metadata: Readonly<Record<string, string | number | boolean | null>>;
  readonly timestamp: string;
  readonly originEngine: string;
  readonly autoLearning: false;
  readonly generativeAi: false;
}

export type GuardianKnowledgeOriginEngine =
  | "incident-detection"
  | "knowledge-diagnosis"
  | "hypothesis-engine"
  | "root-cause-analysis"
  | "change-intelligence"
  | "regression-intelligence"
  | "performance-intelligence"
  | "capacity-analysis"
  | "security-intelligence"
  | "threat-prediction"
  | "compliance-analysis"
  | "engineering-knowledge-platform";

export interface GuardianEngineeringKnowledgeObject {
  readonly knowledgeId: string;
  readonly entityType: GuardianOntologyEntityType;
  readonly entityId: string;
  readonly evidenceChain: readonly string[];
  readonly confidence: number;
  readonly timestamp: string;
  readonly relations: readonly string[];
  readonly metadata: Readonly<Record<string, string | number | boolean | null>>;
  readonly originEngine: GuardianKnowledgeOriginEngine;
  readonly knowledgeReferences: readonly string[];
  readonly preparedLearning: GuardianPreparedFutureSlot;
  readonly preparedPatch: GuardianPreparedFutureSlot;
  readonly preparedTests: GuardianPreparedFutureSlot;
  readonly preparedDeployment: GuardianPreparedFutureSlot;
  readonly autoLearning: false;
  readonly generativeAi: false;
  readonly ml: false;
}

export const EMPTY_KNOWLEDGE_PREPARED_SLOT: GuardianPreparedFutureSlot =
  EMPTY_HYPOTHESIS_PREPARED_SLOT;

export interface EngineeringKnowledgeIndexEntry {
  readonly indexId: string;
  readonly entityId: string;
  readonly entityType: GuardianOntologyEntityType;
  readonly knowledgeId: string | null;
  readonly memoryId: string | null;
  readonly timestamp: string;
}

export interface EngineeringKnowledgeGraphNode {
  readonly entityId: string;
  readonly entityType: GuardianOntologyEntityType;
  readonly label: string;
}

export interface EngineeringKnowledgeGraphEdge {
  readonly relationId: string;
  readonly fromEntityId: string;
  readonly toEntityId: string;
  readonly relationType: GuardianOntologyRelationType;
}

export interface EngineeringKnowledgeGraph {
  readonly graphId: string;
  readonly structuralOnly: true;
  readonly intelligence: false;
  readonly nodes: readonly EngineeringKnowledgeGraphNode[];
  readonly edges: readonly EngineeringKnowledgeGraphEdge[];
  readonly timestamp: string;
}

export interface EngineeringKnowledgePlatformSnapshot {
  readonly platformId: string;
  readonly timestamp: string;
  readonly entityCount: number;
  readonly memoryCount: number;
  readonly knowledgeObjectCount: number;
  readonly relationCount: number;
  readonly indexCount: number;
  readonly autoLearning: false;
  readonly generativeAi: false;
  readonly ml: false;
}

export interface EngineeringKnowledgeConsolidateResult {
  readonly snapshot: EngineeringKnowledgePlatformSnapshot;
  readonly knowledgeObjects: readonly GuardianEngineeringKnowledgeObject[];
  readonly memoryRecords: readonly GuardianEngineeringMemoryRecord[];
  readonly entities: readonly GuardianOntologyEntity[];
  readonly relations: readonly GuardianOntologyRelation[];
  readonly graph: EngineeringKnowledgeGraph;
}
