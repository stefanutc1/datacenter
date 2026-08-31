# Multi-stage production Dockerfile for Homelab Web Digital Twin
FROM node:22-alpine AS builder

WORKDIR /app/web

# Install dependencies
COPY web/package*.json ./
RUN npm ci || npm install

# Copy application sources
COPY web/ ./

# Build production static bundle
RUN npm run build

# Runtime Nginx Container
FROM nginx:alpine

COPY --from=builder /app/web/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
