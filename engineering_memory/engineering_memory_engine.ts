/**
 * Guardian Engineering Memory (GAI-08).
 * Structured registration of engineering knowledge.
 * Does NOT learn. Does NOT evolve. Records only.
 */

import { GuardianEventBus } from "../events/event_bus";
import { EngineeringTimeline } from "../timeline/timeline_service";
import type {
  GuardianEngineeringMemoryKind,
  GuardianEngineeringMemoryRecord,
  GuardianOntologyEntityType,
} from "../types/engineering_knowledge_types";

export const ENGINEERING_MEMORY_ENGINE_ID =
  "guardian-engineering-memory-engine" as const;

export const MEMORY_UPDATED_EVENT = "guardian.memory.updated" as const;

export type EngineeringMemoryEngineStatus = "inactive" | "ready";

let memorySeq = 0;

function nextMemoryId(): string {
  memorySeq += 1;
  return `guardian-memory-${Date.now()}-${memorySeq}`;
}

class EngineeringMemoryEngineImpl {
  readonly id = ENGINEERING_MEMORY_ENGINE_ID;
  private status: EngineeringMemoryEngineStatus = "inactive";
  private records = new Map<string, GuardianEngineeringMemoryRecord>();
  private updateCount = 0;

  initialize(): void {
    EngineeringTimeline.initialize();
    this.status = "ready";
  }

  getStatus(): EngineeringMemoryEngineStatus {
    return this.status;
  }

  isReady(): boolean {
    return this.status === "ready";
  }

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
  }): GuardianEngineeringMemoryRecord {
    if (this.status !== "ready") this.initialize();

    const record: GuardianEngineeringMemoryRecord = {
      memoryId: nextMemoryId(),
      kind: input.kind,
      entityId: input.entityId,
      entityType: input.entityType,
      title: input.title,
      summary: input.summary,
      evidenceChain: input.evidenceChain ?? [],
      knowledgeReferences: input.knowledgeReferences ?? [],
      relations: input.relations ?? [],
      metadata: input.metadata ?? {},
      timestamp: new Date().toISOString(),
      originEngine: input.originEngine,
      autoLearning: false,
      generativeAi: false,
    };

    this.records.set(record.memoryId, record);
    this.updateCount += 1;

    GuardianEventBus.publish(MEMORY_UPDATED_EVENT, this.id, {
      memoryId: record.memoryId,
      kind: record.kind,
      entityId: record.entityId,
      updateCount: this.updateCount,
    });

    return record;
  }

  get(memoryId: string): GuardianEngineeringMemoryRecord | null {
    return this.records.get(memoryId) ?? null;
  }

  list(kind?: GuardianEngineeringMemoryKind): readonly GuardianEngineeringMemoryRecord[] {
    const all = [...this.records.values()];
    return kind ? all.filter((r) => r.kind === kind) : all;
  }

  listByEntity(entityId: string): readonly GuardianEngineeringMemoryRecord[] {
    return [...this.records.values()].filter((r) => r.entityId === entityId);
  }

  getUpdateCount(): number {
    return this.updateCount;
  }

  reset(): void {
    this.status = "inactive";
    this.records.clear();
    this.updateCount = 0;
    memorySeq = 0;
  }
}

export const EngineeringMemory = new EngineeringMemoryEngineImpl();

export function createEngineeringMemoryEngine(): EngineeringMemoryEngineImpl {
  return new EngineeringMemoryEngineImpl();
}
