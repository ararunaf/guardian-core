# Changelog

## 1.0.0 — GAI-08C Guardian Core Enterprise Stabilization

### Stabilized
- Official Semantic Versioning policy (Major / Minor / Patch)
- Enterprise documentation set (architecture, SDK, Public API, Runtime, Providers, Knowledge, Memory, Ontology, Dashboard, Plugins, Compatibility, Certification)
- Adapter Development Guide and Plugin Development Guide
- Architecture Decision Records ADR-001 … ADR-010
- Independent Certification Suite (executable in guardian-core only)

### Notes
- No functional / behavioral changes vs GAI-08B published Core
- Core / SDK / Compatibility / Schema / Plugin / Adapter remain **1.0.0**
- Build marker: `1.0.0+gai08c` · Certification: `GAI-08C`
- Ready for GAI-09 (Software Architecture Intelligence Engine)

## 1.0.0 — GAI-08B Guardian Core Publication

### Added
- Official independent Guardian Core product repository
- Guardian SDK 1.0.0 with Public API
- Plugin infrastructure, Compatibility Layer, Version Manifest
- Knowledge Platform, Engineering Memory, Engineering Ontology
- Dashboard (read-only) and Engineering Timeline

### Notes
- Extracted from SuperContabPro after GAI-08A freeze
- No behavior change vs. the frozen Core
- SuperContab connects exclusively via guardian-supercontab-adapter