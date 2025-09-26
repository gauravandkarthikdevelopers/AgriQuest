# Use official Node.js 18 LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install system dependencies for sharp and other native packages
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    vips-dev

# Copy package files
COPY package*.json ./

# Install dependencies (including dev for build)
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Remove dev dependencies after build
RUN npm prune --omit=dev

# Create necessary directories
RUN mkdir -p logs uploads/temp uploads/processed uploads/thumbnails

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S agriquest -u 1001

# Change ownership of app directory
RUN chown -R agriquest:nodejs /app

# Switch to non-root user
USER agriquest

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/ping', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["npm", "start"]
