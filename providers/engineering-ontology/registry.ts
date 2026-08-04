/**
 * Guardian Engineering Ontology Provider local registry (GAI-08).
 */
import type { IEngineeringOntologyProvider } from "../../contracts/IEngineeringOntologyProvider";
import type { GuardianProviderDescriptor } from "../../types/provider_types";
import {
  createEngineeringOntologyProvider,
  describeEngineeringOntologyProvider,
} from "./factory";

let instance: IEngineeringOntologyProvider | null = null;
let descriptor: GuardianProviderDescriptor | null = null;

export const EngineeringOntologyProviderRegistry = {
  ensure(): IEngineeringOntologyProvider {
    if (!instance) {
      instance = createEngineeringOntologyProvider();
      descriptor = describeEngineeringOntologyProvider();
    }
    return instance;
  },
  get(): IEngineeringOntologyProvider | null {
    return instance;
  },
  describe(): GuardianProviderDescriptor {
    return descriptor ?? describeEngineeringOntologyProvider();
  },
  reset(): void {
    instance = null;
    descriptor = null;
  },
};
