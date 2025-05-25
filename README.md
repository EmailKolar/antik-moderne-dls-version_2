# AntikModerne E-Commerce Platform

This project is a full-stack, multi-service e-commerce application built with a microservices architecture. It features a modern React/Chakra UI frontend, multiple backend services (product, basket, order, user, email), and uses Clerk for authentication and MinIO for image storage. All services are orchestrated with Docker Compose for easy local development and deployment.

## Features
- **Product Catalog**: Browse, filter, and view detailed posters/products.
- **Basket/Cart**: Add, update, and remove items with Clerk user integration.
- **Checkout & Orders**: Place orders and receive real-time/polling status updates.
- **Admin Panel**: Manage products (add, edit, delete/tombstone) with Clerk-based admin authentication and image upload to MinIO.
- **Microservices**: Each core domain (product, basket, order, user, email) is a separate service with its own database.
- **Prometheus Monitoring**: Metrics endpoints for observability.

## Running the Project with Docker Compose

### Prerequisites
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed

### 1. Clone the repository
```sh
git clone <your-repo-url>
cd antik-moderne-dls-version_2
```

### 2. Start all services
```sh
docker-compose -f docker/docker-compose.yml up --build
```
This will build and start all backend services, databases, MinIO, RabbitMQ, and the React client. The main services will be available at:
- Client: http://localhost:5173
- Product Service: http://localhost:3002
- Basket Service: http://localhost:3003
- Order Service: http://localhost:3005
- User Service: http://localhost:3001
- Email Service: http://localhost:3004
- MinIO: http://localhost:9000
- RabbitMQ: http://localhost:15672

### 3. Run database migrations
Each service manages its own database and migrations. To run all migrations:

use the provided script (if available):
```sh
sh docker/migrate-all.sh
```

### 4. Seeding Data (Optional)
Some services provide a seed script to populate initial data:
```sh
cd backend/services/product-service
npx prisma db seed
```

## General Architecture
- **Frontend**: React + Chakra UI, Zustand for state, React Query for data fetching, Clerk for auth.
- **Backend**: Node.js/Express microservices, each with its own database (PostgreSQL via Prisma ORM).
- **Messaging**: RabbitMQ for inter-service communication (e.g., order events).
- **Storage**: MinIO for product images.
- **Monitoring**: Prometheus metrics endpoints on each service.

## Authentication
- Clerk is used for user authentication and admin role management.
- Admin-only endpoints are protected by Clerk JWTs and role checks.

## Tombstone Pattern
- Product deletion uses a tombstone (soft delete) pattern: products are marked as deleted, not removed from the database. All queries filter out deleted products.

## Development Notes
- Environment variables for each service are in their respective `.env` files.
- For local development, you may need to restart services after changing environment variables or Prisma schema.

---

For more details, see the README in each service's folder.

Services info


----

User-Service: 

PORT= 3001

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/user_service?schema=public"


------


product-service: 

DATABASE_URL="postgresql://postgres:password@localhost:5433/productdb"

PORT=3002

----


basket-service:

DATABASE_URL="postgresql://postgres:password@localhost:5434/basketdb?schema=public"

PORT=3003

------

Email-service:

DATABASE_URL="postgresql://postgres:password@localhost:5435/emaildb?schema=public"

PORT=3004

-----

Order-service:

DATABASE_URL="postgresql://postgres:password@localhost:5436/orderdb"

PORT=3005

-----



