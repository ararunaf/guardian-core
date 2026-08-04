/**
 * Independent certification suite — Guardian Core only (GAI-08C).
 * Must not import SuperContab or any product package.
 */

import { describe, expect, it, beforeEach } from "vitest";
import { existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

import { runIndependentCertification } from "../certification/run_independent_certification";
import { GAI08C_CERTIFICATION_FLAGS, GAI08C_CERTIFICATION_SURFACES } from "../certification/gai08c_certification";
import { GUARDIAN_VERSION_MANIFEST } from "../version/version_manifest";
import { GUARDIAN_ROADMAP } from "../roadmap";
import { createGuardianSdkHandle, getGuardianPublicApi } from "../sdk";
import { GuardianRuntime } from "../runtime/guardian_runtime";
import { GuardianEventBus } from "../events/event_bus";
import { GuardianRegistry } from "../registry/guardian_registry";
import { GuardianPluginModel } from "../plugins/plugin_model";
import { GuardianPluginRegistry } from "../plugins/plugin_registry";
import { GuardianProviderRegistry } from "../providers/provider_registry";
import { GuardianAdapterRegistry } from "../adapters";
import { EngineeringKnowledgePlatform } from "../engineering_knowledge/engineering_knowledge_platform";
import { EngineeringMemory } from "../engineering_memory/engineering_memory_engine";
import { EngineeringOntology } from "../engineering_ontology/engineering_ontology_engine";
import { GuardianDashboard } from "../dashboard/guardian_dashboard";

const ROOT = resolve(__dirname, "..");

describe("GAI-08C Independent Certification Suite", () => {
  beforeEach(() => {
    GuardianRuntime.shutdown();
    GuardianEventBus.reset();
    GuardianRegistry.reset();
    GuardianPluginModel.reset();
    GuardianPluginRegistry.reset();
    GuardianProviderRegistry.reset();
    GuardianAdapterRegistry.reset();
    EngineeringKnowledgePlatform.reset();
    EngineeringMemory.reset();
    EngineeringOntology.reset();
    GuardianDashboard.resetDashboardLoadedFlag();
  });

  it("certifies version 1.0.0 and GAI-08C markers", () => {
    expect(GUARDIAN_VERSION_MANIFEST.coreVersion).toBe("1.0.0");
    expect(GUARDIAN_VERSION_MANIFEST.sdkVersion).toBe("1.0.0");
    expect(GUARDIAN_VERSION_MANIFEST.certificationVersion).toBe("GAI-08C");
    expect(GUARDIAN_VERSION_MANIFEST.buildVersion).toContain("gai08c");
    expect(GUARDIAN_ROADMAP.find((e) => e.id === "GAI-08C")?.status).toBe("done");
  });

  it("certifies SDK and Public API without SuperContab", () => {
    const handle = createGuardianSdkHandle();
    const api = getGuardianPublicApi();
    expect(handle.publicApiReady).toBe(true);
    expect(api.soleEntry).toBe(true);
    expect(api.sdkVersion).toBe("1.0.0");
  });

  it("runs full independent certification report", () => {
    const report = runIndependentCertification();
    const failed = report.checks.filter((c) => !c.ok);
    expect(failed, JSON.stringify(failed, null, 2)).toEqual([]);
    expect(report.passed).toBe(true);
    expect(report.independent).toBe(true);
    expect(report.supercontabFree).toBe(true);
    expect(report.flags.GO_OR_NO_GO).toBe("GO");
    for (const surface of GAI08C_CERTIFICATION_SURFACES) {
      expect(report.checks.some((c) => c.surface === surface && c.ok)).toBe(true);
    }
  });

  it("ships required GAI-08C documentation and ADRs", () => {
    const docs = [
      "docs/GAI08C_RELEASE.md",
      "docs/GAI08C_VERSIONING.md",
      "docs/GAI08C_RELEASE_NOTES.md",
      "docs/GAI08C_ADAPTER_GUIDE.md",
      "docs/GAI08C_PLUGIN_GUIDE.md",
      "docs/GAI08C_CERTIFICATION.md",
      "docs/GAI08C_ADR_INDEX.md",
      "docs/GAI08C_RELATORIO_FINAL.md",
    ];
    for (const doc of docs) {
      expect(existsSync(resolve(ROOT, doc)), doc).toBe(true);
    }
    for (let i = 1; i <= 10; i++) {
      const padded = String(i).padStart(3, "0");
      // ADR files use descriptive suffixes; verify directory has ADR-00N*
      const adrFiles = readdirSync(resolve(ROOT, "docs/adr"));
      expect(adrFiles.some((f: string) => f.startsWith(`ADR-${padded}`))).toBe(true);
    }
    expect(GAI08C_CERTIFICATION_FLAGS.DOCUMENTATION_COMPLETE).toBe(true);
  });
});
