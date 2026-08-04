/**
 * Guardian AI - IEngineeringMemoryProvider contract (GAI-08).
 * Structured memory registration only. No auto-learning. No ML.
 */

import type {
  GuardianEngineeringMemoryKind,
  GuardianEngineeringMemoryRecord,
  GuardianOntologyEntityType,
} from "../types/engineering_knowledge_types";

export interface IEngineeringMemoryProvider {
  readonly id: "engineering-memory-provider";
  readonly ready: boolean;
  readonly name: string;
  readonly operational: boolean;
  readonly capabilities: {
    readonly registerMemory: true;
    readonly listMemory: true;
    readonly autoLearning: false;
    readonly generativeAi: false;
    readonly ml: false;
    readonly codeExecution: false;
    readonly autoPatch: false;
    readonly autoDeploy: false;
  };
  register(input: {
    readonly kind: GuardianEngineeringMemoryKind;
    readonly entityId: string;
    readonly entityType: GuardianOntologyEntityType;
    readonly title: string;
    readonly summary: string;
    readonly evidenceChain?: readonly string[];
    readonly knowledgeReferences?: readonly string[];
    readonly relations?: readonly string[];
    readonly metadata?: Readonly<Record<string, string | number | boolean | null>>;
    readonly originEngine: string;
  }): GuardianEngineeringMemoryRecord;
  list(kind?: GuardianEngineeringMemoryKind): readonly GuardianEngineeringMemoryRecord[];
}
