# Build stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Production stage
FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
RUN adduser -D nodeuser && chown -R nodeuser:nodeuser /app
USER nodeuser
ENV NODE_ENV=production
EXPOSE 5050
HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=40s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5050/health || exit 1
CMD ["npm", "start"]