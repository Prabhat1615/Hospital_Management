# Medplum Production Dockerfile

# ------------------------------------------------------------
# Stage 1 - Install production dependencies
# ------------------------------------------------------------
FROM node:24-bookworm AS build-stage

ENV NODE_ENV=production

WORKDIR /usr/src/medplum

# Contains package.json and package-lock.json
ADD ./medplum-server-metadata.tar.gz ./

RUN npm ci --omit=dev && \
    rm package-lock.json


# ------------------------------------------------------------
# Stage 2 - Runtime
# ------------------------------------------------------------
FROM node:24-bookworm-slim AS runtime-stage

ENV NODE_ENV=production

WORKDIR /usr/src/medplum

# Copy installed dependencies
COPY --from=build-stage /usr/src/medplum/ ./

# Copy compiled server files
ADD ./medplum-server-runtime.tar.gz ./

# Copy Medplum configuration
COPY packages/server/medplum.config.json ./medplum.config.json

# Expose Medplum ports
EXPOSE 5000
EXPOSE 8103

# Start server (without OpenTelemetry loader)
ENTRYPOINT ["node", "packages/server/dist/index.js"]