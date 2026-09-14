# ============================================================================
# CampusFlow Frontend Dockerfile
# Multi-stage build: Node.js 20 Builder -> Nginx Alpine Web Server
# ============================================================================

# --- Stage 1: Build production React application bundle ---
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies using package-lock.json
COPY package*.json ./
RUN npm ci

# Copy frontend source code
COPY . .

# Set API URL build argument; default to /api for nginx internal reverse proxy
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

# Build optimized production bundle
RUN npm run build

# --- Stage 2: Serve production bundle with lightweight Nginx ---
FROM nginx:alpine

# Copy custom Nginx configuration with SPA routing and API reverse proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy production build artifacts from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose standard HTTP port
EXPOSE 80

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
