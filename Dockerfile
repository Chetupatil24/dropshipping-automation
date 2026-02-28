# ---- Dependencies stage ----
FROM node:18-alpine AS deps

RUN apk add --no-cache ca-certificates

WORKDIR /app

# Copy root package.json (has all backend deps)
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production --ignore-scripts

# ---- Final stage ----
FROM node:18-alpine

RUN apk add --no-cache ca-certificates

WORKDIR /app

# Copy installed node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy backend source code only
COPY backend ./backend

# GCP Cloud Run listens on PORT env var (default 8080)
ENV NODE_ENV=production
ENV PORT=8080

# Run as non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 8080

# Health check for Cloud Run readiness probes
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:8080/health || exit 1

CMD ["node", "backend/server.js"]
