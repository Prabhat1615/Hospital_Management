#!/bin/sh
set -e

# Map Render's PORT env var to Medplum's MEDPLUM_PORT
# Render assigns a dynamic PORT; Medplum reads MEDPLUM_PORT via its env config loader
if [ -n "$PORT" ]; then
    export MEDPLUM_PORT="$PORT"
fi

# Start Medplum server
# Loads base config from medplum.config.json, then overlays with MEDPLUM_* env vars
exec node packages/server/dist/index.js "file:medplum.config.json,env"
