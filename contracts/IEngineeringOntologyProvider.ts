/**
 * Guardian AI - IEngineeringOntologyProvider contract (GAI-08).
 * Canonical ontology access. Structural relations only. No inference.
 */

import type {
  GuardianOntologyEntity,
  GuardianOntologyEntityType,
  GuardianOntologyRelation,
  GuardianOntologyRelationType,
} from "../types/engineering_knowledge_types";

export interface IEngineeringOntologyProvider {
  readonly id: "engineering-ontology-provider";
  readonly ready: boolean;
  readonly name: string;
  readonly operational: boolean;
  readonly capabilities: {
    readonly registerEntity: true;
    readonly relateEntities: true;
    readonly listEntities: true;
    readonly inference: false;
    readonly reasoning: false;
    readonly autoLearning: false;
    readonly generativeAi: false;
    readonly ml: false;
    readonly codeExecution: false;
  };
  registerEntity(input: {
    readonly id?: string;
    readonly type: GuardianOntologyEntityType;
    readonly metadata?: Readonly<Record<string, string | number | boolean | null>>;
    readonly knowledgeReferences?: readonly string[];
    readonly evidenceReferences?: readonly string[];
  }): GuardianOntologyEntity;
  relate(input: {
    readonly fromEntityId: string;
    readonly fromType: GuardianOntologyEntityType;
    readonly toEntityId: string;
    readonly toType: GuardianOntologyEntityType;
    readonly relationType: GuardianOntologyRelationType;
    readonly metadata?: Readonly<Record<string, string | number | boolean | null>>;
  }): GuardianOntologyRelation;
  listEntities(type?: GuardianOntologyEntityType): readonly GuardianOntologyEntity[];
  listRelations(): readonly GuardianOntologyRelation[];
}
