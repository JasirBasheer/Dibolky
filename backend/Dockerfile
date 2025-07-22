FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

FROM node:22-alpine
WORKDIR /app
RUN adduser -D nodeuser
COPY --from=builder /app /app
RUN chown -R nodeuser:nodeuser /app
USER nodeuser
ENV NODE_ENV=development
EXPOSE 5050

CMD ["npm", "run", "start"]