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
RUN npx prisma generate --schema=apps/backend/prisma/schema.prisma
# Build shared packages in dependency order
RUN npm run build --workspace=packages/types && \
    npm run build --workspace=packages/utils
RUN npm run build --workspace=apps/backend

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app ./
EXPOSE 3002
CMD ["npm", "run", "start:prod", "--workspace=apps/backend"]
