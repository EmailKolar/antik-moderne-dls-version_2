#!/bin/bash

# Names of your services
services=("user-service" "product-service" "basket-service" "order-service" "email-service")

# Loop over each service and run the migration
for service in "${services[@]}"; do
  echo "Running migrations for $service..."
  docker-compose exec "$service" npx prisma migrate dev --name init || {
    echo " Migration failed for $service"
    exit 1
  }
done

echo "All migrations completed successfully."


# docker-compose exec product-service npx prisma migrate dev --name add-product-deleted-flag
# docker compose exec basket-service npx prisma migrate dev --name add-idempotance