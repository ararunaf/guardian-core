/**
 * Guardian Compatibility Layer (GAI-08A).
 * Validates adapters, versions, plugins, contracts, and SDK surface.
 * Deterministic. No ML / LLM.
 */

import type { GuardianAdapterDescriptor } from "../adapters/base_adapter";
import type { GuardianPluginManifest } from "../plugins/plugin_manifest";
import {
  GUARDIAN_ADAPTER_VERSION,
  GUARDIAN_COMPATIBILITY_VERSION,
  GUARDIAN_CORE_VERSION,
  GUARDIAN_PLUGIN_VERSION,
  GUARDIAN_SDK_VERSION,
  GUARDIAN_VERSION_MANIFEST,
  type GuardianVersionManifest,
} from "../version/version_manifest";

export type GuardianCompatibilitySubject =
  | "adapter"
  | "version"
  | "plugin"
  | "contract"
  | "sdk";

export interface GuardianCompatibilityIssue {
  readonly subject: GuardianCompatibilitySubject;
  readonly code: string;
  readonly message: string;
  readonly severity: "error" | "warning";
}

export interface GuardianCompatibilityReport {
  readonly compatible: boolean;
  readonly compatibilityVersion: typeof GUARDIAN_COMPATIBILITY_VERSION;
  readonly checkedAt: string;
  readonly issues: readonly GuardianCompatibilityIssue[];
  readonly adaptersValid: boolean;
  readonly versionsValid: boolean;
  readonly pluginsValid: boolean;
  readonly contractsValid: boolean;
  readonly sdkValid: boolean;
}

const REQUIRED_CONTRACTS = [
  "IGuardianRuntime",
  "IGuardianContext",
  "IGuardianEvent",
  "IGuardianPlugin",
  "IIncidentProvider",
  "IKnowledgeProvider",
] as const;

export function validateAdapterCompatibility(
  adapter: GuardianAdapterDescriptor,
): readonly GuardianCompatibilityIssue[] {
  const issues: GuardianCompatibilityIssue[] = [];
  if (!adapter.id.startsWith("guardian-adapter-") && adapter.id !== "guardian-supercontab-adapter") {
    issues.push({
      subject: "adapter",
      code: "ADAPTER_ID_PATTERN",
      message: `Adapter id '${adapter.id}' does not follow guardian-adapter-* pattern`,
      severity: "warning",
    });
  }
  if (!adapter.productId) {
    issues.push({
      subject: "adapter",
      code: "ADAPTER_PRODUCT_MISSING",
      message: "Adapter productId is required",
      severity: "error",
    });
  }
  if (adapter.bindsBusinessRules || adapter.bindsApis || adapter.bindsDatabase) {
    issues.push({
      subject: "adapter",
      code: "ADAPTER_FORBIDDEN_BINDING",
      message: "Adapters must not bind business rules, APIs, or database",
      severity: "error",
    });
  }
  return issues;
}

export function validateVersionCompatibility(
  manifest: GuardianVersionManifest = GUARDIAN_VERSION_MANIFEST,
): readonly GuardianCompatibilityIssue[] {
  const issues: GuardianCompatibilityIssue[] = [];
  if (manifest.coreVersion !== GUARDIAN_CORE_VERSION) {
    issues.push({
      subject: "version",
      code: "CORE_VERSION_MISMATCH",
      message: "Core version mismatch",
      severity: "error",
    });
  }
  if (manifest.sdkVersion !== GUARDIAN_SDK_VERSION) {
    issues.push({
      subject: "version",
      code: "SDK_VERSION_MISMATCH",
      message: "SDK version mismatch",
      severity: "error",
    });
  }
  if (manifest.pluginVersion !== GUARDIAN_PLUGIN_VERSION) {
    issues.push({
      subject: "version",
      code: "PLUGIN_VERSION_MISMATCH",
      message: "Plugin version mismatch",
      severity: "error",
    });
  }
  if (manifest.adapterVersion !== GUARDIAN_ADAPTER_VERSION) {
    issues.push({
      subject: "version",
      code: "ADAPTER_VERSION_MISMATCH",
      message: "Adapter version mismatch",
      severity: "error",
    });
  }
  if (!manifest.frozen || !manifest.extractable) {
    issues.push({
      subject: "version",
      code: "MANIFEST_NOT_FROZEN",
      message: "Version manifest must be frozen and extractable",
      severity: "error",
    });
  }
  return issues;
}

export function validatePluginCompatibility(
  plugins: readonly GuardianPluginManifest[],
): readonly GuardianCompatibilityIssue[] {
  const issues: GuardianCompatibilityIssue[] = [];
  for (const plugin of plugins) {
    if (plugin.active) {
      issues.push({
        subject: "plugin",
        code: "PLUGIN_ACTIVE_FORBIDDEN",
        message: `Plugin '${plugin.id}' must remain inactive until multi-product activation`,
        severity: "error",
      });
    }
    if (!plugin.version) {
      issues.push({
        subject: "plugin",
        code: "PLUGIN_VERSION_MISSING",
        message: `Plugin '${plugin.id}' missing version`,
        severity: "error",
      });
    }
  }
  return issues;
}

export function validateContractCompatibility(
  contractNames: readonly string[] = REQUIRED_CONTRACTS,
): readonly GuardianCompatibilityIssue[] {
  const issues: GuardianCompatibilityIssue[] = [];
  for (const name of REQUIRED_CONTRACTS) {
    if (!contractNames.includes(name)) {
      issues.push({
        subject: "contract",
        code: "CONTRACT_MISSING",
        message: `Required contract '${name}' is missing`,
        severity: "error",
      });
    }
  }
  return issues;
}

export function validateSdkCompatibility(input: {
  readonly publicApiReady: boolean;
  readonly sdkVersion: string;
  readonly importsInternalModules?: boolean;
}): readonly GuardianCompatibilityIssue[] {
  const issues: GuardianCompatibilityIssue[] = [];
  if (!input.publicApiReady) {
    issues.push({
      subject: "sdk",
      code: "PUBLIC_API_NOT_READY",
      message: "SDK public API is not ready",
      severity: "error",
    });
  }
  if (input.sdkVersion !== GUARDIAN_SDK_VERSION) {
    issues.push({
      subject: "sdk",
      code: "SDK_VERSION_INVALID",
      message: "SDK version does not match manifest",
      severity: "error",
    });
  }
  if (input.importsInternalModules) {
    issues.push({
      subject: "sdk",
      code: "SDK_INTERNAL_IMPORT",
      message: "Adapters must not import internal modules outside SDK public API",
      severity: "error",
    });
  }
  return issues;
}

export function runCompatibilityCheck(input: {
  readonly adapters?: readonly GuardianAdapterDescriptor[];
  readonly plugins?: readonly GuardianPluginManifest[];
  readonly contracts?: readonly string[];
  readonly publicApiReady?: boolean;
  readonly importsInternalModules?: boolean;
  readonly manifest?: GuardianVersionManifest;
} = {}): GuardianCompatibilityReport {
  const adapters = input.adapters ?? [];
  const plugins = input.plugins ?? [];
  const contracts = input.contracts ?? [...REQUIRED_CONTRACTS];
  const manifest = input.manifest ?? GUARDIAN_VERSION_MANIFEST;

  const issues = [
    ...adapters.flatMap((adapter) => validateAdapterCompatibility(adapter)),
    ...validateVersionCompatibility(manifest),
    ...validatePluginCompatibility(plugins),
    ...validateContractCompatibility(contracts),
    ...validateSdkCompatibility({
      publicApiReady: input.publicApiReady ?? true,
      sdkVersion: manifest.sdkVersion,
      importsInternalModules: input.importsInternalModules ?? false,
    }),
  ];

  const hasError = issues.some((issue) => issue.severity === "error");
  return {
    compatible: !hasError,
    compatibilityVersion: GUARDIAN_COMPATIBILITY_VERSION,
    checkedAt: new Date().toISOString(),
    issues,
    adaptersValid: !issues.some((i) => i.subject === "adapter" && i.severity === "error"),
    versionsValid: !issues.some((i) => i.subject === "version" && i.severity === "error"),
    pluginsValid: !issues.some((i) => i.subject === "plugin" && i.severity === "error"),
    contractsValid: !issues.some((i) => i.subject === "contract" && i.severity === "error"),
    sdkValid: !issues.some((i) => i.subject === "sdk" && i.severity === "error"),
  };
}

export const GuardianCompatibilityLayer = {
  validateAdapter: validateAdapterCompatibility,
  validateVersions: validateVersionCompatibility,
  validatePlugins: validatePluginCompatibility,
  validateContracts: validateContractCompatibility,
  validateSdk: validateSdkCompatibility,
  check: runCompatibilityCheck,
};
