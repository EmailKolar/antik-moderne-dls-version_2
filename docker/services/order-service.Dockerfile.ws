FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN apk add --no-cache openssl

CMD ["npx", "ts-node", "src/ws.ts"]