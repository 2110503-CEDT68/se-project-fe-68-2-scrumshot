# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package manifests and lockfile for reproducible installs
COPY package*.json ./
COPY package-lock.json* ./

# Install dependencies and build
RUN npm ci
COPY . .
RUN npm run build

# Production runner
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Copy package manifests and install only production deps
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/package-lock.json* ./
RUN npm ci --only=production

# Copy built app and static assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose port and run
EXPOSE 3000
CMD ["npm", "start"]
