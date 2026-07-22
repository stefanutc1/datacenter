# Multi-stage Dockerfile for Homelab Web Wiki SPA
FROM node:22-alpine AS builder

WORKDIR /app
COPY web/package*.json ./
RUN npm install

COPY web/ ./
RUN npm run build

# Runtime Nginx Container
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
