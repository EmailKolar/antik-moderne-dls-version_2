# Dockerfile for Product Service
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .


RUN npm run build

RUN apk add --no-cache openssl

RUN npx prisma generate




CMD ["npm", "start"]
