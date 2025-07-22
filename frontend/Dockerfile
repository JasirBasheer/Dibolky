FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx/conf.d/nginx.conf /etc/nginx/conf.d/default.conf
RUN adduser -D reactuser && chown -R reactuser:reactuser /usr/share/nginx/html
USER reactuser
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]