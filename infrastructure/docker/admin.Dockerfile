FROM node:24-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json ./
COPY apps/backend/package.json ./apps/backend/
COPY apps/frontend/package.json ./apps/frontend/
COPY apps/admin/package.json ./apps/admin/
COPY packages/types/package.json ./packages/types/
COPY packages/utils/package.json ./packages/utils/
RUN --mount=type=cache,target=/root/.npm npm install --no-audit --no-fund --no-package-lock

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build --workspace=packages/types
RUN npm run build --workspace=packages/utils
# Mount next.js build cache to speed up successive compilation steps
RUN --mount=type=cache,target=/app/apps/admin/.next/cache npm run build --workspace=apps/admin

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app ./
EXPOSE 3001
CMD ["npm", "run", "start", "--workspace=apps/admin"]
