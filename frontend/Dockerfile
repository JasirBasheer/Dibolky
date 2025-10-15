FROM node:18 AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

COPY /app/dist /usr/share/nginx/html/dibolky
