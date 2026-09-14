# ============================================================================
# CampusFlow Backend Dockerfile
# Production-ready Node.js 20 LTS runtime on Alpine Linux
# ============================================================================

FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Set production environment flag
ENV NODE_ENV=production

# Install production dependencies using package-lock.json for deterministic builds
COPY package*.json ./
RUN npm ci --only=production

# Copy backend application source code
COPY . .

# Expose backend port
EXPOSE 5000

# Start Express.js HTTP server
CMD ["node", "src/server.js"]
