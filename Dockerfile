# Dockerfile for Gemini CLI OpenAI Server
# Pure Node.js build — no Cloudflare/wrangler dependency

FROM node:20-slim

# Install security updates and required packages
RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y wget curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create a non-root user for security
RUN groupadd -g 1001 nodejs && \
    useradd -r -u 1001 -g nodejs worker

# Set working directory inside the container
WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json yarn.lock* ./

# Install project dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of your application code
COPY . .

# Set proper ownership
RUN chown -R worker:nodejs /app

# Switch to non-root user for security
USER worker

# Expose the port the server will run on
EXPOSE 8787

# Health check to ensure the service is running
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8787/health || exit 1

# Start the Node.js server directly
CMD ["npx", "tsx", "src/server.ts"]
