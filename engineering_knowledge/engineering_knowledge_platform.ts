/**
 * Guardian Engineering Knowledge Platform (GAI-08 / EKP-G).
 * Consolidates, indexes, and organizes Guardian engineering knowledge.
 * No ML. No generative AI. No inference. No auto-learning.
 */

import { CapacityAnalysisEngine } from "../capacity/capacity_analysis_engine";
import { ChangeIntelligenceEngine } from "../change/change_intelligence_engine";
import { ComplianceAnalysisEngine } from "../compliance/compliance_analysis_engine";
import { KnowledgeDiagnosisEngine } from "../diagnosis/knowledge_diagnosis_engine";
import { EngineeringMemory } from "../engineering_memory/engineering_memory_engine";
import { EngineeringOntology } from "../engineering_ontology/engineering_ontology_engine";
import { GuardianEventBus } from "../events/event_bus";
import { HypothesisEngine } from "../hypothesis/hypothesis_engine";
import { PerformanceIntelligenceEngine } from "../performance/performance_intelligence_engine";
import { RegressionIntelligenceEngine } from "../regression/regression_intelligence_engine";
import { RootCauseAnalysisEngine } from "../root_cause/root_cause_engine";
import { GuardianRuntime } from "../runtime/guardian_runtime";
import { SecurityIntelligenceEngine } from "../security/security_intelligence_engine";
import { ThreatPredictionEngine } from "../threat/threat_prediction_engine";
import { EngineeringTimeline } from "../timeline/timeline_service";
import type {
  EngineeringKnowledgeConsolidateResult,
  EngineeringKnowledgeGraph,
  EngineeringKnowledgeIndexEntry,
  EngineeringKnowledgePlatformSnapshot,
  GuardianEngineeringKnowledgeObject,
  GuardianEngineeringMemoryKind,
  GuardianEngineeringMemoryRecord,
  GuardianKnowledgeOriginEngine,
  GuardianOntologyEntity,
  GuardianOntologyEntityType,
  GuardianOntologyRelation,
  GuardianOntologyRelationType,
} from "../types/engineering_knowledge_types";
import { EMPTY_KNOWLEDGE_PREPARED_SLOT } from "../types/engineering_knowledge_types";

export const ENGINEERING_KNOWLEDGE_PLATFORM_ID =
  "guardian-engineering-knowledge-platform" as const;

export const KNOWLEDGE_REGISTERED_EVENT = "guardian.knowledge.registered" as const;
export const KNOWLEDGE_INDEXED_EVENT = "guardian.knowledge.indexed" as const;
export const KNOWLEDGE_PUBLISHED_EVENT = "guardian.knowledge.published" as const;

export type EngineeringKnowledgePlatformStatus = "inactive" | "ready";

let knowledgeSeq = 0;
let indexSeq = 0;
let graphSeq = 0;
let platformSeq = 0;

function nextKnowledgeId(): string {
  knowledgeSeq += 1;
  return `guardian-ekp-knowledge-${Date.now()}-${knowledgeSeq}`;
}

function nextIndexId(): string {
  indexSeq += 1;
  return `guardian-ekp-index-${Date.now()}-${indexSeq}`;
}

function nextGraphId(): string {
  graphSeq += 1;
  return `guardian-ekp-graph-${Date.now()}-${graphSeq}`;
}

function nextPlatformId(): string {
  platformSeq += 1;
  return `guardian-ekp-platform-${Date.now()}-${platformSeq}`;
}

function clamp(value: number): number {
  return Math.min(1, Math.max(0, value));
}

class EngineeringKnowledgePlatformImpl {
  readonly id = ENGINEERING_KNOWLEDGE_PLATFORM_ID;
  private status: EngineeringKnowledgePlatformStatus = "inactive";
  private knowledgeObjects = new Map<string, GuardianEngineeringKnowledgeObject>();
  private index = new Map<string, EngineeringKnowledgeIndexEntry>();
  private lastResult: EngineeringKnowledgeConsolidateResult | null = null;
  private consolidateCount = 0;

  initialize(): void {
    EngineeringTimeline.initialize();
    EngineeringMemory.initialize();
    EngineeringOntology.initialize();
    KnowledgeDiagnosisEngine.initialize();
    HypothesisEngine.initialize();
    RootCauseAnalysisEngine.initialize();
    ChangeIntelligenceEngine.initialize();
    RegressionIntelligenceEngine.initialize();
    PerformanceIntelligenceEngine.initialize();
    CapacityAnalysisEngine.initialize();
    SecurityIntelligenceEngine.initialize();
    ThreatPredictionEngine.initialize();
    ComplianceAnalysisEngine.initialize();
    this.status = "ready";
  }

  getStatus(): EngineeringKnowledgePlatformStatus {
    return this.status;
  }

  isReady(): boolean {
    return this.status === "ready";
  }

  registerKnowledgeObject(input: {
    readonly entityType: GuardianOntologyEntityType;
    readonly entityId: string;
    readonly evidenceChain?: readonly string[];
    readonly confidence?: number;
    readonly relations?: readonly string[];
    readonly metadata?: Readonly<Record<string, string | number | boolean | null>>;
    readonly originEngine: GuardianKnowledgeOriginEngine;
    readonly knowledgeReferences?: readonly string[];
  }): GuardianEngineeringKnowledgeObject {
    if (this.status !== "ready") this.initialize();

    const knowledge: GuardianEngineeringKnowledgeObject = {
      knowledgeId: nextKnowledgeId(),
      entityType: input.entityType,
      entityId: input.entityId,
      evidenceChain: input.evidenceChain ?? [],
      confidence: clamp(input.confidence ?? 0.5),
      timestamp: new Date().toISOString(),
      relations: input.relations ?? [],
      metadata: input.metadata ?? {},
      originEngine: input.originEngine,
      knowledgeReferences: input.knowledgeReferences ?? [],
      preparedLearning: EMPTY_KNOWLEDGE_PREPARED_SLOT,
      preparedPatch: EMPTY_KNOWLEDGE_PREPARED_SLOT,
      preparedTests: EMPTY_KNOWLEDGE_PREPARED_SLOT,
      preparedDeployment: EMPTY_KNOWLEDGE_PREPARED_SLOT,
      autoLearning: false,
      generativeAi: false,
      ml: false,
    };

    this.knowledgeObjects.set(knowledge.knowledgeId, knowledge);

    EngineeringOntology.registerEntity({
      id: input.entityId,
      type: input.entityType,
      knowledgeReferences: [knowledge.knowledgeId],
      evidenceReferences: knowledge.evidenceChain,
      status: "indexed",
      metadata: input.metadata,
    });

    GuardianEventBus.publish(KNOWLEDGE_REGISTERED_EVENT, this.id, {
      knowledgeId: knowledge.knowledgeId,
      entityId: knowledge.entityId,
      entityType: knowledge.entityType,
      originEngine: knowledge.originEngine,
    });

    return knowledge;
  }

  indexEntity(input: {
    readonly entityId: string;
    readonly entityType: GuardianOntologyEntityType;
    readonly knowledgeId?: string | null;
    readonly memoryId?: string | null;
  }): EngineeringKnowledgeIndexEntry {
    if (this.status !== "ready") this.initialize();

    const entry: EngineeringKnowledgeIndexEntry = {
      indexId: nextIndexId(),
      entityId: input.entityId,
      entityType: input.entityType,
      knowledgeId: input.knowledgeId ?? null,
      memoryId: input.memoryId ?? null,
      timestamp: new Date().toISOString(),
    };

    this.index.set(entry.indexId, entry);

    GuardianEventBus.publish(KNOWLEDGE_INDEXED_EVENT, this.id, {
      indexId: entry.indexId,
      entityId: entry.entityId,
      entityType: entry.entityType,
    });

    return entry;
  }

  private registerMemoryAndKnowledge(input: {
    readonly kind: GuardianEngineeringMemoryKind;
    readonly entityType: GuardianOntologyEntityType;
    readonly entityId: string;
    readonly title: string;
    readonly summary: string;
    readonly evidenceChain?: readonly string[];
    readonly knowledgeReferences?: readonly string[];
    readonly confidence?: number;
    readonly originEngine: GuardianKnowledgeOriginEngine;
    readonly metadata?: Readonly<Record<string, string | number | boolean | null>>;
  }): {
    readonly memory: GuardianEngineeringMemoryRecord;
    readonly knowledge: GuardianEngineeringKnowledgeObject;
  } {
    const knowledge = this.registerKnowledgeObject({
      entityType: input.entityType,
      entityId: input.entityId,
      evidenceChain: input.evidenceChain,
      confidence: input.confidence,
      knowledgeReferences: input.knowledgeReferences,
      originEngine: input.originEngine,
      metadata: input.metadata,
    });

    const memory = EngineeringMemory.register({
      kind: input.kind,
      entityId: input.entityId,
      entityType: input.entityType,
      title: input.title,
      summary: input.summary,
      evidenceChain: input.evidenceChain,
      knowledgeReferences: [knowledge.knowledgeId, ...(input.knowledgeReferences ?? [])],
      originEngine: input.originEngine,
      metadata: input.metadata,
    });

    this.indexEntity({
      entityId: input.entityId,
      entityType: input.entityType,
      knowledgeId: knowledge.knowledgeId,
      memoryId: memory.memoryId,
    });

    return { memory, knowledge };
  }

  private relateChain(
    pairs: readonly {
      readonly fromId: string;
      readonly fromType: GuardianOntologyEntityType;
      readonly toId: string;
      readonly toType: GuardianOntologyEntityType;
      readonly relationType: GuardianOntologyRelationType;
    }[],
  ): GuardianOntologyRelation[] {
    return pairs.map((pair) =>
      EngineeringOntology.relate({
        fromEntityId: pair.fromId,
        fromType: pair.fromType,
        toEntityId: pair.toId,
        toType: pair.toType,
        relationType: pair.relationType,
      }),
    );
  }

  buildStructuralGraph(): EngineeringKnowledgeGraph {
    const entities = EngineeringOntology.listEntities();
    const relations = EngineeringOntology.listRelations();
    return {
      graphId: nextGraphId(),
      structuralOnly: true,
      intelligence: false,
      nodes: entities.map((e) => ({
        entityId: e.id,
        entityType: e.type,
        label: String(e.metadata.label ?? e.type),
      })),
      edges: relations.map((r) => ({
        relationId: r.relationId,
        fromEntityId: r.fromEntityId,
        toEntityId: r.toEntityId,
        relationType: r.relationType,
      })),
      timestamp: new Date().toISOString(),
    };
  }

  getSnapshot(): EngineeringKnowledgePlatformSnapshot {
    return {
      platformId: nextPlatformId(),
      timestamp: new Date().toISOString(),
      entityCount: EngineeringOntology.listEntities().length,
      memoryCount: EngineeringMemory.list().length,
      knowledgeObjectCount: this.knowledgeObjects.size,
      relationCount: EngineeringOntology.listRelations().length,
      indexCount: this.index.size,
      autoLearning: false,
      generativeAi: false,
      ml: false,
    };
  }

  /**
   * Consolidate all Guardian engineering artifacts into EKP-G.
   * Structural registration only — no inference or learning.
   */
  consolidate(): EngineeringKnowledgeConsolidateResult {
    if (this.status !== "ready") this.initialize();

    const knowledgeObjects: GuardianEngineeringKnowledgeObject[] = [];
    const memoryRecords: GuardianEngineeringMemoryRecord[] = [];
    const relationPairs: {
      fromId: string;
      fromType: GuardianOntologyEntityType;
      toId: string;
      toType: GuardianOntologyEntityType;
      relationType: GuardianOntologyRelationType;
    }[] = [];

    const incidents = GuardianRuntime.listIncidents();
    for (const incident of incidents) {
      const { memory, knowledge } = this.registerMemoryAndKnowledge({
        kind: "incident",
        entityType: "Incident",
        entityId: incident.incidentId,
        title: `Incident ${incident.category}`,
        summary: incident.message,
        evidenceChain: [`incident:${incident.incidentId}`],
        confidence: 0.9,
        originEngine: "incident-detection",
        metadata: {
          category: incident.category,
          severity: incident.severity,
          module: incident.module,
        },
      });
      knowledgeObjects.push(knowledge);
      memoryRecords.push(memory);

      if (incident.module) {
        const moduleEntity = EngineeringOntology.registerEntity({
          id: `module:${incident.module}`,
          type: "Module",
          metadata: { label: incident.module },
        });
        relationPairs.push({
          fromId: moduleEntity.id,
          fromType: "Module",
          toId: incident.incidentId,
          toType: "Incident",
          relationType: "contains",
        });
      }
      if (incident.tenant) {
        EngineeringOntology.registerEntity({
          id: `tenant:${incident.tenant}`,
          type: "Tenant",
          metadata: { label: incident.tenant },
        });
      }
      if (incident.workspace) {
        EngineeringOntology.registerEntity({
          id: `workspace:${incident.workspace}`,
          type: "Workspace",
          metadata: { label: incident.workspace },
        });
      }
    }

    const diagnosis = KnowledgeDiagnosisEngine.getLastDiagnosis();
    if (diagnosis) {
      const evidence = diagnosis.evidenceChain.items.map(
        (item) => item.statement ?? item.evidenceId,
      );
      const { memory, knowledge } = this.registerMemoryAndKnowledge({
        kind: "diagnosis",
        entityType: "Diagnosis",
        entityId: diagnosis.diagnosisId,
        title: "Knowledge Diagnosis",
        summary: diagnosis.explanation,
        evidenceChain: evidence,
        knowledgeReferences: diagnosis.references,
        confidence: diagnosis.confidenceScore,
        originEngine: "knowledge-diagnosis",
        metadata: { incidentId: diagnosis.incidentId, status: diagnosis.status },
      });
      knowledgeObjects.push(knowledge);
      memoryRecords.push(memory);
      relationPairs.push({
        fromId: diagnosis.incidentId,
        fromType: "Incident",
        toId: diagnosis.diagnosisId,
        toType: "Diagnosis",
        relationType: "diagnoses",
      });
    }

    const hypothesisSet = HypothesisEngine.getLastHypothesisSet();
    if (hypothesisSet) {
      for (const hypothesis of hypothesisSet.hypotheses) {
        const { memory, knowledge } = this.registerMemoryAndKnowledge({
          kind: "hypothesis",
          entityType: "Hypothesis",
          entityId: hypothesis.hypothesisId,
          title: hypothesis.title,
          summary: hypothesis.description,
          evidenceChain: hypothesis.supportingEvidence,
          confidence: hypothesis.confidence,
          originEngine: "hypothesis-engine",
          metadata: {
            diagnosisId: hypothesis.diagnosisId,
            category: hypothesis.category,
          },
        });
        knowledgeObjects.push(knowledge);
        memoryRecords.push(memory);
        if (diagnosis) {
          relationPairs.push({
            fromId: diagnosis.diagnosisId,
            fromType: "Diagnosis",
            toId: hypothesis.hypothesisId,
            toType: "Hypothesis",
            relationType: "references",
          });
        }
      }
    }

    const rca = RootCauseAnalysisEngine.getLastResult();
    if (rca?.rootCause) {
      const rootCause = rca.rootCause;
      const { memory, knowledge } = this.registerMemoryAndKnowledge({
        kind: "root_cause",
        entityType: "RootCause",
        entityId: rootCause.rootCauseId,
        title: "Root Cause",
        summary: rootCause.description,
        evidenceChain: rootCause.evidenceChain,
        confidence: rootCause.confidenceScore,
        originEngine: "root-cause-analysis",
        metadata: {
          riskLevel: rootCause.riskLevel,
          technicalImpact: rootCause.technicalImpact,
        },
      });
      knowledgeObjects.push(knowledge);
      memoryRecords.push(memory);
      if (diagnosis) {
        relationPairs.push({
          fromId: diagnosis.diagnosisId,
          fromType: "Diagnosis",
          toId: rootCause.rootCauseId,
          toType: "RootCause",
          relationType: "causes",
        });
      }
    }

    const change = ChangeIntelligenceEngine.getLastChangeContext();
    if (change) {
      const { memory, knowledge } = this.registerMemoryAndKnowledge({
        kind: "change",
        entityType: "Change",
        entityId: change.changeId,
        title: "Change Context",
        summary: `Change across ${change.modules.length} modules`,
        evidenceChain: change.filesChanged,
        confidence: 0.7,
        originEngine: "change-intelligence",
        metadata: {
          commitHash: change.commitHash,
          relatedRootCause: change.relatedRootCauses[0] ?? null,
        },
      });
      knowledgeObjects.push(knowledge);
      memoryRecords.push(memory);
      if (rca?.rootCause) {
        relationPairs.push({
          fromId: rca.rootCause.rootCauseId,
          fromType: "RootCause",
          toId: change.changeId,
          toType: "Change",
          relationType: "changes",
        });
      }
    }

    const regression = RegressionIntelligenceEngine.getLastRegression();
    if (regression) {
      const { memory, knowledge } = this.registerMemoryAndKnowledge({
        kind: "regression",
        entityType: "Regression",
        entityId: regression.regressionId,
        title: "Regression Analysis",
        summary: `Regression score ${regression.regressionScore}`,
        evidenceChain: regression.evidenceChain,
        confidence: regression.confidence,
        originEngine: "regression-intelligence",
        metadata: {
          regressionScore: regression.regressionScore,
          technicalRisk: regression.technicalRisk,
        },
      });
      knowledgeObjects.push(knowledge);
      memoryRecords.push(memory);
      if (change) {
        relationPairs.push({
          fromId: change.changeId,
          fromType: "Change",
          toId: regression.regressionId,
          toType: "Regression",
          relationType: "regresses",
        });
      }
    }

    const performance = PerformanceIntelligenceEngine.getLastMetrics();
    if (performance) {
      const { memory, knowledge } = this.registerMemoryAndKnowledge({
        kind: "performance",
        entityType: "Performance",
        entityId: performance.metricsId,
        title: "Performance Metrics",
        summary: `Performance score ${performance.score}`,
        evidenceChain: performance.evidence,
        confidence: performance.confidence,
        originEngine: "performance-intelligence",
        metadata: { score: performance.score },
      });
      knowledgeObjects.push(knowledge);
      memoryRecords.push(memory);
      if (regression) {
        relationPairs.push({
          fromId: regression.regressionId,
          fromType: "Regression",
          toId: performance.metricsId,
          toType: "Performance",
          relationType: "impacts_performance",
        });
      }
    }

    const capacity = CapacityAnalysisEngine.getLastCapacity();
    if (capacity) {
      const { memory, knowledge } = this.registerMemoryAndKnowledge({
        kind: "capacity",
        entityType: "Capacity",
        entityId: capacity.capacityId,
        title: "Capacity Analysis",
        summary: `Capacity score ${capacity.score}`,
        evidenceChain: capacity.evidence,
        confidence: capacity.confidence,
        originEngine: "capacity-analysis",
        metadata: { score: capacity.score },
      });
      knowledgeObjects.push(knowledge);
      memoryRecords.push(memory);
      if (performance) {
        relationPairs.push({
          fromId: performance.metricsId,
          fromType: "Performance",
          toId: capacity.capacityId,
          toType: "Capacity",
          relationType: "requires_capacity",
        });
      }
    }

    const security = SecurityIntelligenceEngine.getLastAssessment();
    if (security) {
      const { memory, knowledge } = this.registerMemoryAndKnowledge({
        kind: "security",
        entityType: "Security",
        entityId: security.assessmentId,
        title: "Security Assessment",
        summary: `Security score ${security.securityScore}`,
        evidenceChain: security.evidenceChain,
        confidence: security.confidence,
        originEngine: "security-intelligence",
        metadata: { securityScore: security.securityScore },
      });
      knowledgeObjects.push(knowledge);
      memoryRecords.push(memory);
      if (capacity) {
        relationPairs.push({
          fromId: capacity.capacityId,
          fromType: "Capacity",
          toId: security.assessmentId,
          toType: "Security",
          relationType: "exposes_security",
        });
      }
    }

    const threat = ThreatPredictionEngine.getLastPrediction();
    if (threat) {
      const { memory, knowledge } = this.registerMemoryAndKnowledge({
        kind: "security",
        entityType: "Threat",
        entityId: threat.predictionId,
        title: "Threat Prediction",
        summary: `Threat score ${threat.threatScore}`,
        evidenceChain: threat.evidenceChain,
        confidence: threat.confidence,
        originEngine: "threat-prediction",
        metadata: { threatScore: threat.threatScore },
      });
      knowledgeObjects.push(knowledge);
      memoryRecords.push(memory);
      if (security) {
        relationPairs.push({
          fromId: security.assessmentId,
          fromType: "Security",
          toId: threat.predictionId,
          toType: "Threat",
          relationType: "predicts_threat",
        });
      }
    }

    const compliance = ComplianceAnalysisEngine.getLastReport();
    if (compliance) {
      const { memory, knowledge } = this.registerMemoryAndKnowledge({
        kind: "compliance",
        entityType: "Compliance",
        entityId: compliance.reportId,
        title: "Compliance Report",
        summary: `Compliance score ${compliance.complianceScore}`,
        evidenceChain: compliance.evidenceChain,
        confidence: compliance.confidence,
        originEngine: "compliance-analysis",
        metadata: {
          complianceScore: compliance.complianceScore,
          architectureCompliance: compliance.architectureCompliance,
        },
      });
      knowledgeObjects.push(knowledge);
      memoryRecords.push(memory);
      if (threat) {
        relationPairs.push({
          fromId: threat.predictionId,
          fromType: "Threat",
          toId: compliance.reportId,
          toType: "Compliance",
          relationType: "validates_compliance",
        });
      }

      const recommendationId = `recommendation:${compliance.reportId}`;
      const decisionId = `decision:${compliance.reportId}`;
      const futurePatchId = `prepared-patch:${compliance.reportId}`;

      this.registerMemoryAndKnowledge({
        kind: "recommendation",
        entityType: "Recommendation",
        entityId: recommendationId,
        title: "Engineering Recommendation",
        summary: "Deterministic recommendation from compliance analysis",
        confidence: compliance.confidence,
        originEngine: "engineering-knowledge-platform",
        evidenceChain: compliance.evidenceChain,
      });

      this.registerMemoryAndKnowledge({
        kind: "decision",
        entityType: "Decision",
        entityId: decisionId,
        title: "Engineering Decision",
        summary: "Decision slot prepared — no execution",
        confidence: compliance.confidence,
        originEngine: "engineering-knowledge-platform",
      });

      EngineeringOntology.registerEntity({
        id: futurePatchId,
        type: "Dependency",
        metadata: { label: "Future Patch (prepared)", prepared: true },
        status: "registered",
      });

      relationPairs.push(
        {
          fromId: compliance.reportId,
          fromType: "Compliance",
          toId: recommendationId,
          toType: "Recommendation",
          relationType: "recommends",
        },
        {
          fromId: recommendationId,
          fromType: "Recommendation",
          toId: decisionId,
          toType: "Decision",
          relationType: "decides",
        },
        {
          fromId: decisionId,
          fromType: "Decision",
          toId: futurePatchId,
          toType: "Dependency",
          relationType: "prepares_patch",
        },
      );
    }

    this.relateChain(relationPairs);
    const graph = this.buildStructuralGraph();
    const snapshot = this.getSnapshot();

    GuardianEventBus.publish(KNOWLEDGE_PUBLISHED_EVENT, this.id, {
      platformId: snapshot.platformId,
      entityCount: snapshot.entityCount,
      memoryCount: snapshot.memoryCount,
      knowledgeObjectCount: snapshot.knowledgeObjectCount,
      relationCount: snapshot.relationCount,
    });

    const result: EngineeringKnowledgeConsolidateResult = {
      snapshot,
      knowledgeObjects: [...this.knowledgeObjects.values()],
      memoryRecords: EngineeringMemory.list(),
      entities: EngineeringOntology.listEntities(),
      relations: EngineeringOntology.listRelations(),
      graph,
    };

    this.lastResult = result;
    this.consolidateCount += 1;
    return result;
  }

  getLastResult(): EngineeringKnowledgeConsolidateResult | null {
    return this.lastResult;
  }

  listKnowledgeObjects(): readonly GuardianEngineeringKnowledgeObject[] {
    return [...this.knowledgeObjects.values()];
  }

  getKnowledgeObject(knowledgeId: string): GuardianEngineeringKnowledgeObject | null {
    return this.knowledgeObjects.get(knowledgeId) ?? null;
  }

  listIndex(): readonly EngineeringKnowledgeIndexEntry[] {
    return [...this.index.values()];
  }

  exploreEntity(entityId: string): {
    readonly entity: GuardianOntologyEntity | null;
    readonly relations: readonly GuardianOntologyRelation[];
    readonly memory: readonly GuardianEngineeringMemoryRecord[];
    readonly knowledge: readonly GuardianEngineeringKnowledgeObject[];
  } {
    return {
      entity: EngineeringOntology.getEntity(entityId),
      relations: EngineeringOntology.getRelationsFor(entityId),
      memory: EngineeringMemory.listByEntity(entityId),
      knowledge: [...this.knowledgeObjects.values()].filter((k) => k.entityId === entityId),
    };
  }

  getConsolidateCount(): number {
    return this.consolidateCount;
  }

  reset(): void {
    this.status = "inactive";
    this.knowledgeObjects.clear();
    this.index.clear();
    this.lastResult = null;
    this.consolidateCount = 0;
    knowledgeSeq = 0;
    indexSeq = 0;
    graphSeq = 0;
    platformSeq = 0;
  }
}

export const EngineeringKnowledgePlatform = new EngineeringKnowledgePlatformImpl();

export function createEngineeringKnowledgePlatform(): EngineeringKnowledgePlatformImpl {
  return new EngineeringKnowledgePlatformImpl();
}
