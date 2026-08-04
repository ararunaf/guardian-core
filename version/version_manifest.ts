/**
 * Guardian Version Manifest (GAI-08C).
 * Official versioning surface for Core Enterprise Release 1.0.0.
 * Governance-only: does not alter engine behavior.
 */

export const GUARDIAN_CORE_VERSION = "1.0.0" as const;
export const GUARDIAN_SDK_VERSION = "1.0.0" as const;
export const GUARDIAN_COMPATIBILITY_VERSION = "1.0.0" as const;
export const GUARDIAN_SCHEMA_VERSION = "1.0.0" as const;
export const GUARDIAN_PLUGIN_VERSION = "1.0.0" as const;
export const GUARDIAN_ADAPTER_VERSION = "1.0.0" as const;
export const GUARDIAN_BUILD_VERSION = "1.0.0+gai08c" as const;
export const GUARDIAN_CERTIFICATION_VERSION = "GAI-08C" as const;

export interface GuardianVersionManifest {
  readonly coreVersion: typeof GUARDIAN_CORE_VERSION;
  readonly sdkVersion: typeof GUARDIAN_SDK_VERSION;
  readonly compatibilityVersion: typeof GUARDIAN_COMPATIBILITY_VERSION;
  readonly schemaVersion: typeof GUARDIAN_SCHEMA_VERSION;
  readonly pluginVersion: typeof GUARDIAN_PLUGIN_VERSION;
  readonly adapterVersion: typeof GUARDIAN_ADAPTER_VERSION;
  readonly buildVersion: typeof GUARDIAN_BUILD_VERSION;
  readonly certificationVersion: typeof GUARDIAN_CERTIFICATION_VERSION;
  readonly frozen: true;
  readonly extractable: true;
}

export const GUARDIAN_VERSION_MANIFEST: GuardianVersionManifest = {
  coreVersion: GUARDIAN_CORE_VERSION,
  sdkVersion: GUARDIAN_SDK_VERSION,
  compatibilityVersion: GUARDIAN_COMPATIBILITY_VERSION,
  schemaVersion: GUARDIAN_SCHEMA_VERSION,
  pluginVersion: GUARDIAN_PLUGIN_VERSION,
  adapterVersion: GUARDIAN_ADAPTER_VERSION,
  buildVersion: GUARDIAN_BUILD_VERSION,
  certificationVersion: GUARDIAN_CERTIFICATION_VERSION,
  frozen: true,
  extractable: true,
};

export function describeGuardianVersionManifest(): GuardianVersionManifest {
  return GUARDIAN_VERSION_MANIFEST;
}