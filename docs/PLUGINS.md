# Plugins

Infrastructure ready at **1.0.0**: Registry, Loader, Descriptor, Manifest, Version, Compatibility, Metadata.

## Status

No business plugins shipped in 1.0.0. Future plugins (Patch Generator, Test Guardian, Deployment Guardian, etc.) land in later GAI sprints and must pass Compatibility before load.

## Rule

Plugins emit Event Bus events; they do not mutate dashboard state or Core engines directly.