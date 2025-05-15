# Dockerfile for Product Service
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .



RUN npm run build

RUN npx prisma generate

RUN apk add --no-cache openssl

CMD ["npm", "start"]
