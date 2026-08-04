/**
 * Guardian SDK export catalog (GAI-08A).
 */

import { GUARDIAN_PUBLIC_API_EXPORTS } from "../public-api/public_api";

export interface GuardianSdkExportCatalog {
  readonly publicExports: typeof GUARDIAN_PUBLIC_API_EXPORTS;
  readonly internalForbidden: true;
  readonly adapterMustUsePublicApi: true;
}

export const GUARDIAN_SDK_EXPORT_CATALOG: GuardianSdkExportCatalog = {
  publicExports: GUARDIAN_PUBLIC_API_EXPORTS,
  internalForbidden: true,
  adapterMustUsePublicApi: true,
};

export function listGuardianSdkExports(): readonly string[] {
  return GUARDIAN_SDK_EXPORT_CATALOG.publicExports;
}