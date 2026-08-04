/**
 * Guardian AI - IDiagnosticsProvider contract (GAI-01 / GAI-05 / GAI-06).
 * Expanded for evidence + change/regression/performance support. No auto-heal.
 */

export interface IDiagnosticsProvider {
  readonly id: "diagnostics-provider";
  readonly ready: boolean;
  readonly name: string;
  readonly operational: boolean;
  readonly capabilities: {
    readonly evidenceSupport: true;
    readonly hypothesisSupport: false;
    readonly rootCauseSupport: false;
    readonly changeImpactSupport: true;
    readonly regressionEvidenceSupport: true;
    readonly performanceEvidenceSupport: true;
    readonly predictionEvidenceSupport: true;
    readonly capacityEvidenceSupport: true;
    readonly securityEvidenceSupport: true;
    readonly threatEvidenceSupport: true;
    readonly complianceEvidenceSupport: true;
    readonly engineeringMemorySupport: true;
    readonly engineeringOntologySupport: true;
    readonly knowledgeObjectSupport: true;
    readonly codeExecution: false;
    readonly autoHeal: false;
  };
}