/**
 * Guardian Knowledge Provider local registry (GAI-03).
 */

import type { IKnowledgeProvider } from "../../contracts/IKnowledgeProvider";
import type { GuardianProviderDescriptor } from "../../types/provider_types";
import { createKnowledgeProvider, describeKnowledgeProvider } from "./factory";

let instance: IKnowledgeProvider | null = null;
let descriptor: GuardianProviderDescriptor | null = null;

export const KnowledgeProviderRegistry = {
  ensure(): IKnowledgeProvider {
    if (!instance) {
      instance = createKnowledgeProvider();
      descriptor = describeKnowledgeProvider();
    }
    return instance;
  },

  get(): IKnowledgeProvider | null {
    return instance;
  },

  describe(): GuardianProviderDescriptor {
    return descriptor ?? describeKnowledgeProvider();
  },

  reset(): void {
    instance = null;
    descriptor = null;
  },
};