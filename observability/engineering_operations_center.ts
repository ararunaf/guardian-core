/**
 * Engineering Operations Center (GAI-04).
 * Read-only Observability + Knowledge Diagnosis modules.
 * No action buttons. No AI. No HotFix. No recovery execution.
 */

import { IncidentDetectionEngine } from "../incident/incident_detection_engine";
import { GuardianProviderRegistry } from "../providers/provider_registry";
import { GuardianRegistry } from "../registry/guardian_registry";
import { GuardianRuntime } from "../runtime/guardian_runtime";
import { EngineeringTimeline } from "../timeline/timeline_service";
import type { EngineeringTimelineFilter } from "../types/timeline_types";
import { EngineeringAuditService } from "./audit_service";
import { EngineeringHealthService } from "./health_service";
import { EngineeringSessionService } from "./session_service";
import { EngineeringStatisticsService } from "./statistics_service";

export const EOC_MODULES = [
  "Timeline",
  "Incidents",
  "Runtime",
  "Providers",
  "Health",
  "Sessions",
  "Events",
  "Statistics",
  "Integrity",
  "Audit",
  "Correlation",
  "Incident Context",
  "Knowledge Diagnosis",
  "Evidence Chain",
  "Confidence",
  "Knowledge Sources",
  "Correlation Score",
  "Hypotheses",
  "Hypothesis Ranking",
  "Root Cause",
  "Root Cause Confidence",
  "Evidence Matrix",
  "Evidence Weight",
  "Probability",
  "Impact",
  "Risk",
  "Business Impact",
  "Technical Impact",
] as const;

export type EocModuleName = (typeof EOC_MODULES)[number];

export const EngineeringOperationsCenter = {
  readonly: true as const,
  actionsEnabled: false as const,
  ai: false as const,

  modules(): readonly EocModuleName[] {
    return EOC_MODULES;
  },

  Timeline: {
    list(filter?: EngineeringTimelineFilter) {
      return EngineeringTimeline.list(filter);
    },
    count() {
      return EngineeringTimeline.count();
    },
    ready() {
      return EngineeringTimeline.ready;
    },
  },

  Incidents: {
    list() {
      return GuardianRuntime.listIncidents();
    },
    count() {
      return GuardianRuntime.getIncidentCount();
    },
    engineReady() {
      return IncidentDetectionEngine.isReady();
    },
  },

  Runtime: {
    status() {
      return GuardianRuntime.getStatus();
    },
    state() {
      return GuardianRuntime.getState();
    },
    recentEvents() {
      return GuardianRuntime.listRecentEvents();
    },
  },

  Providers: {
    list() {
      return GuardianProviderRegistry.list().length
        ? GuardianProviderRegistry.list()
        : GuardianRegistry.listProviders();
    },
  },

  Health: {
    get() {
      return EngineeringHealthService.getHealth();
    },
  },

  Sessions: {
    list() {
      return EngineeringSessionService.list();
    },
    current() {
      return EngineeringSessionService.current();
    },
  },

  Events: {
    list(filter?: EngineeringTimelineFilter) {
      return EngineeringTimeline.list(filter);
    },
    recent(limit = 50) {
      return EngineeringTimeline.list({ limit });
    },
  },

  Statistics: {
    get() {
      return EngineeringStatisticsService.getStatistics();
    },
  },

  Integrity: {
    get() {
      return EngineeringHealthService.getIntegrity();
    },
  },

  Audit: {
    list(limit?: number) {
      return EngineeringAuditService.list(limit);
    },
  },
} as const;
