# Plugins

Infrastructure ready at **1.0.0**: Registry, Loader, Descriptor, Manifest, Version, Compatibility, Metadata.

## Official guide (GAI-08C)

**Full Plugin Development Guide:** [`GAI08C_PLUGIN_GUIDE.md`](./GAI08C_PLUGIN_GUIDE.md)

Related ADR: [`adr/ADR-004-plugin-model.md`](./adr/ADR-004-plugin-model.md)

## Status

No business plugins shipped in 1.0.0. Future plugins (Patch Generator, Test Guardian, Deployment Guardian, etc.) land in later GAI sprints and must pass Compatibility before load.

## Rule

Plugins emit Event Bus events; they do not mutate dashboard state or Core engines directly.
