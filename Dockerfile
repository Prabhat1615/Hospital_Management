# Medplum Production Dockerfile
# Multi-stage build: installs production deps, then creates a minimal runtime image

# ------------------------------------------------------------
# Stage 1 - Install production dependencies
# ------------------------------------------------------------
FROM node:22-bookworm AS build-stage

ENV NODE_ENV=production

WORKDIR /usr/src/medplum

# Contains package.json and package-lock.json for all server dependencies
ADD ./medplum-server-metadata.tar.gz ./

RUN npm ci --omit=dev && \
    rm package-lock.json


# ------------------------------------------------------------
# Stage 2 - Runtime
# ------------------------------------------------------------
FROM node:22-bookworm-slim AS runtime-stage

ENV NODE_ENV=production

WORKDIR /usr/src/medplum

# Copy installed production dependencies
COPY --from=build-stage /usr/src/medplum/ ./

# Copy compiled server files and runtime assets
ADD ./medplum-server-runtime.tar.gz ./

# Copy Medplum configuration file
COPY packages/server/medplum.config.json ./medplum.config.json

# Copy entrypoint script that maps Render PORT to MEDPLUM_PORT
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Set default MEDPLUM_PORT (overridden by docker-entrypoint.sh when Render's PORT is set)
ENV MEDPLUM_PORT=8103

# Expose the default Medplum port (Render will provide a dynamic PORT via env)
EXPOSE 8103

# Health check: uses Render's PORT env var (always available in the container environment)
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD node -e "var h=require('http');h.get('http://localhost:'+(process.env.PORT||8103)+'/healthcheck',function(r){process.exit(r.statusCode===200?0:1)}).on('error',function(){process.exit(1)})"

ENTRYPOINT ["docker-entrypoint.sh"]
