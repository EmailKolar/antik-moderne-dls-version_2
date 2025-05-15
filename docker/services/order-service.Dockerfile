# Dockerfile for Order Service
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

RUN apk add --no-cache openssl

CMD ["npm", "start"]
