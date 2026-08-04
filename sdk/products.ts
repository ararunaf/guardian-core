/**
 * Guardian SDK target products (GAI-00).
 * Declares future consumers across the IAeasy portfolio.
 * No functional integration in this sprint.
 */

import type { GuardianProductId } from "../types";

export interface GuardianSdkProductTarget {
  readonly id: GuardianProductId;
  readonly name: string;
  readonly status: "planned" | "host";
}

export const GUARDIAN_SDK_PRODUCT_TARGETS: readonly GuardianSdkProductTarget[] = [
  { id: "supercontab", name: "SuperContabPro", status: "host" },
  { id: "medicflow", name: "MedicFlow-AI", status: "planned" },
  { id: "sysclinicall", name: "SysClinicallPro", status: "planned" },
  { id: "adflow", name: "AdFlow", status: "planned" },
  { id: "mindhub", name: "MindHub", status: "planned" },
  { id: "legalops", name: "LegalOpsPro", status: "planned" },
  { id: "academic", name: "AcademicPro", status: "planned" },
  { id: "student", name: "StudentPro", status: "planned" },
  { id: "iaeasy", name: "IAeasy", status: "planned" },
] as const;
