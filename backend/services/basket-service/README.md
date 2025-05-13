# Guide

npm init -y

Copy dependencies from other service

Create tsconfig

Create folder structure:

xxx-service/
    ├── docker-compose.yml
    ├── package.json
    ├── README.md
    ├── tsconfig.json
    ├── prisma/
    │   ├── schema.prisma
    │   └── migrations/
    │       ├── migration_lock.toml
    │       └── 20250430100723_add_username_and_password/
    │           └── migration.sql
    ├── src/
    │   ├── index.ts
    │   ├── config/
    │   │   ├── database.ts
    │   │   └── rabbitmq.ts
    │   ├── controllers/
    │   │   └── webhook.controller.ts
    │   ├── routes/
    │   │   └── webhook.routes.ts
    │   ├── services/
    │   │   ├── rabbitmq.service.ts
    │   │   └── user.service.ts
    │   └── test/
    │       ├── db.test.ts
    │       └── rabbitmq.test.ts


Create docker compose

Create .env

Create prisma schema

Run prisma schema generation

