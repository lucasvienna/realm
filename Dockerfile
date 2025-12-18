# Stage 1: Install dependencies
FROM node:24-alpine AS deps

RUN npm install -g pnpm

WORKDIR /app

# Copy package files for dependency installation
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including devDependencies for build)
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
	pnpm install --frozen-lockfile

# Stage 2: Build the application
FROM node:24-alpine AS build

RUN npm install -g pnpm

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source files
COPY . .

# Build the application
RUN pnpm build

# Prune dev dependencies for production
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
	pnpm prune --prod

# Stage 3: Production runtime
FROM node:24-alpine AS runtime

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
	adduser --system --uid 1001 sveltekit

WORKDIR /app

# Copy built application and production dependencies
COPY --from=build --chown=sveltekit:nodejs /app/build ./build
COPY --from=build --chown=sveltekit:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=sveltekit:nodejs /app/package.json ./

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Switch to non-root user
USER sveltekit

EXPOSE 3000

CMD ["node", "build"]
