/**
 * Guardian Engineering Ontology Provider factory (GAI-08).
 * Product-agnostic. Delegates to Engineering Ontology.
 */

import type { IEngineeringOntologyProvider } from "../../contracts/IEngineeringOntologyProvider";
import { EngineeringOntology } from "../../engineering_ontology/engineering_ontology_engine";
import type { GuardianProviderDescriptor } from "../../types/provider_types";
import { GUARDIAN_PROVIDER_VERSION } from "../../types/provider_types";
import { getEngineeringOntologyProviderConfiguration } from "./configuration";

export function createEngineeringOntologyProvider(): IEngineeringOntologyProvider {
  const config = getEngineeringOntologyProviderConfiguration();
  return {
    id: "engineering-ontology-provider",
    ready: config.enabled,
    name: "Guardian Engineering Ontology Provider",
    operational: true,
    capabilities: {
      registerEntity: true,
      relateEntities: true,
      listEntities: true,
      inference: false,
      reasoning: false,
      autoLearning: false,
      generativeAi: false,
      ml: false,
      codeExecution: false,
    },
    registerEntity(input) {
      if (!config.enabled) throw new Error("Engineering Ontology Provider is not enabled");
      EngineeringOntology.initialize();
      return EngineeringOntology.registerEntity(input);
    },
    relate(input) {
      if (!config.enabled) throw new Error("Engineering Ontology Provider is not enabled");
      EngineeringOntology.initialize();
      return EngineeringOntology.relate(input);
    },
    listEntities(type) {
      if (!config.enabled) throw new Error("Engineering Ontology Provider is not enabled");
      EngineeringOntology.initialize();
      return EngineeringOntology.listEntities(type);
    },
    listRelations() {
      if (!config.enabled) throw new Error("Engineering Ontology Provider is not enabled");
      EngineeringOntology.initialize();
      return EngineeringOntology.listRelations();
    },
  };
}

export function describeEngineeringOntologyProvider(): GuardianProviderDescriptor {
  const config = getEngineeringOntologyProviderConfiguration();
  return {
    id: "engineering-ontology",
    name: "Guardian Engineering Ontology Provider",
    ready: config.enabled,
    operational: true,
    status: config.enabled ? "ready" : "inactive",
    version: GUARDIAN_PROVIDER_VERSION,
  };
}
