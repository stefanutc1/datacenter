# Multi-stage Dockerfile for Homelab Web Suite (Homepage & Wiki)
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies for homepage & web
COPY homepage/package*.json ./homepage/
RUN cd homepage && npm install

COPY web/package*.json ./web/
RUN cd web && npm install

# Copy full application sources
COPY homepage/ ./homepage/
COPY web/ ./web/

# Build unified web assets
WORKDIR /app/web
RUN node build-all.js

# Runtime Nginx Container
FROM nginx:alpine

COPY --from=builder /app/web/dist /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
