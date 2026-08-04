/**
 * Guardian Engineering Ontology (GAI-08).
 * Canonical engineering entity model. Structural relations only.
 * No inference. No reasoning. No auto-learning.
 */

import { GuardianEventBus } from "../events/event_bus";
import { EngineeringTimeline } from "../timeline/timeline_service";
import type {
  GuardianOntologyEntity,
  GuardianOntologyEntityStatus,
  GuardianOntologyEntityType,
  GuardianOntologyRelation,
  GuardianOntologyRelationType,
} from "../types/engineering_knowledge_types";
import {
  CANONICAL_ONTOLOGY_RELATIONS,
  GUARDIAN_ONTOLOGY_ENTITY_TYPES,
} from "../types/engineering_knowledge_types";

export const ENGINEERING_ONTOLOGY_ENGINE_ID =
  "guardian-engineering-ontology-engine" as const;

export const ONTOLOGY_UPDATED_EVENT = "guardian.ontology.updated" as const;
export const ENTITY_RELATED_EVENT = "guardian.entity.related" as const;

export type EngineeringOntologyEngineStatus = "inactive" | "ready";

let entitySeq = 0;
let relationSeq = 0;

function nextEntityId(type: GuardianOntologyEntityType): string {
  entitySeq += 1;
  return `guardian-ontology-${type.toLowerCase()}-${Date.now()}-${entitySeq}`;
}

function nextRelationId(): string {
  relationSeq += 1;
  return `guardian-ontology-rel-${Date.now()}-${relationSeq}`;
}

class EngineeringOntologyEngineImpl {
  readonly id = ENGINEERING_ONTOLOGY_ENGINE_ID;
  private status: EngineeringOntologyEngineStatus = "inactive";
  private entities = new Map<string, GuardianOntologyEntity>();
  private relations = new Map<string, GuardianOntologyRelation>();
  private updateCount = 0;

  initialize(): void {
    EngineeringTimeline.initialize();
    this.status = "ready";
  }

  getStatus(): EngineeringOntologyEngineStatus {
    return this.status;
  }

  isReady(): boolean {
    return this.status === "ready";
  }

  listEntityTypes(): readonly GuardianOntologyEntityType[] {
    return GUARDIAN_ONTOLOGY_ENTITY_TYPES;
  }

  listCanonicalRelations(): typeof CANONICAL_ONTOLOGY_RELATIONS {
    return CANONICAL_ONTOLOGY_RELATIONS;
  }

  registerEntity(input: {
    readonly id?: string;
    readonly type: GuardianOntologyEntityType;
    readonly metadata?: Readonly<Record<string, string | number | boolean | null>>;
    readonly knowledgeReferences?: readonly string[];
    readonly evidenceReferences?: readonly string[];
    readonly status?: GuardianOntologyEntityStatus;
  }): GuardianOntologyEntity {
    if (this.status !== "ready") this.initialize();

    const id = input.id ?? nextEntityId(input.type);
    const existing = this.entities.get(id);
    const entity: GuardianOntologyEntity = {
      id,
      type: input.type,
      relations: existing?.relations ?? [],
      metadata: { ...(existing?.metadata ?? {}), ...(input.metadata ?? {}) },
      status: input.status ?? existing?.status ?? "registered",
      timestamp: new Date().toISOString(),
      knowledgeReferences: [
        ...new Set([
          ...(existing?.knowledgeReferences ?? []),
          ...(input.knowledgeReferences ?? []),
        ]),
      ],
      evidenceReferences: [
        ...new Set([
          ...(existing?.evidenceReferences ?? []),
          ...(input.evidenceReferences ?? []),
        ]),
      ],
    };

    this.entities.set(id, entity);
    this.updateCount += 1;

    GuardianEventBus.publish(ONTOLOGY_UPDATED_EVENT, this.id, {
      entityId: entity.id,
      entityType: entity.type,
      status: entity.status,
      updateCount: this.updateCount,
    });

    return entity;
  }

  relate(input: {
    readonly fromEntityId: string;
    readonly fromType: GuardianOntologyEntityType;
    readonly toEntityId: string;
    readonly toType: GuardianOntologyEntityType;
    readonly relationType: GuardianOntologyRelationType;
    readonly metadata?: Readonly<Record<string, string | number | boolean | null>>;
  }): GuardianOntologyRelation {
    if (this.status !== "ready") this.initialize();

    if (!this.entities.has(input.fromEntityId)) {
      this.registerEntity({ id: input.fromEntityId, type: input.fromType });
    }
    if (!this.entities.has(input.toEntityId)) {
      this.registerEntity({ id: input.toEntityId, type: input.toType });
    }

    const relation: GuardianOntologyRelation = {
      relationId: nextRelationId(),
      fromEntityId: input.fromEntityId,
      fromType: input.fromType,
      toEntityId: input.toEntityId,
      toType: input.toType,
      relationType: input.relationType,
      timestamp: new Date().toISOString(),
      metadata: input.metadata ?? {},
    };

    this.relations.set(relation.relationId, relation);

    const from = this.entities.get(input.fromEntityId)!;
    const to = this.entities.get(input.toEntityId)!;
    this.entities.set(from.id, {
      ...from,
      relations: [...new Set([...from.relations, relation.relationId])],
      status: "related",
      timestamp: new Date().toISOString(),
    });
    this.entities.set(to.id, {
      ...to,
      relations: [...new Set([...to.relations, relation.relationId])],
      status: "related",
      timestamp: new Date().toISOString(),
    });

    this.updateCount += 1;

    GuardianEventBus.publish(ENTITY_RELATED_EVENT, this.id, {
      relationId: relation.relationId,
      fromEntityId: relation.fromEntityId,
      toEntityId: relation.toEntityId,
      relationType: relation.relationType,
    });
    GuardianEventBus.publish(ONTOLOGY_UPDATED_EVENT, this.id, {
      relationId: relation.relationId,
      updateCount: this.updateCount,
    });

    return relation;
  }

  getEntity(id: string): GuardianOntologyEntity | null {
    return this.entities.get(id) ?? null;
  }

  listEntities(type?: GuardianOntologyEntityType): readonly GuardianOntologyEntity[] {
    const all = [...this.entities.values()];
    return type ? all.filter((e) => e.type === type) : all;
  }

  listRelations(): readonly GuardianOntologyRelation[] {
    return [...this.relations.values()];
  }

  getRelationsFor(entityId: string): readonly GuardianOntologyRelation[] {
    return [...this.relations.values()].filter(
      (r) => r.fromEntityId === entityId || r.toEntityId === entityId,
    );
  }

  getUpdateCount(): number {
    return this.updateCount;
  }

  reset(): void {
    this.status = "inactive";
    this.entities.clear();
    this.relations.clear();
    this.updateCount = 0;
    entitySeq = 0;
    relationSeq = 0;
  }
}

export const EngineeringOntology = new EngineeringOntologyEngineImpl();

export function createEngineeringOntologyEngine(): EngineeringOntologyEngineImpl {
  return new EngineeringOntologyEngineImpl();
}
