# User Service

A microservice for handling user-related operations with RabbitMQ and PostgreSQL integration.

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- RabbitMQ server
- Docker and Docker Compose
- PostgreSQL (via Docker)

## Setup

1. **Install RabbitMQ**
   - On macOS:
     ```bash
     brew install rabbitmq
     brew services start rabbitmq
     ```
   - On Linux:
     ```bash
     sudo apt-get install rabbitmq-server
     sudo service rabbitmq-server start
     ```
   - Or using Docker:
     ```bash
     docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
     ```
   - or using chocolaty:
      ```
      https://community.chocolatey.org/packages/rabbitmq 
      ```

2. **Setup PostgreSQL with Docker**
   ```bash
   # Create a docker-compose.yml file in your project root
   docker-compose up -d
   ```
   The docker-compose.yml should contain:
   ```yaml
   version: '3.8'
   services:
     postgres:
       image: postgres:15
       environment:
         POSTGRES_USER: postgres
         POSTGRES_PASSWORD: postgres
         POSTGRES_DB: user_service
       ports:
         - "5432:5432"
       volumes:
         - postgres_data:/var/lib/postgresql/data
   volumes:
     postgres_data:
   ```

3. **Verify PostgreSQL Connection**
   ```bash
   # Connect to PostgreSQL container
   docker exec -it user-service-postgres-1 psql -U postgres -d user_service
   
   # Once connected, you can run:
   \dt  # List all tables
   \l   # List all databases
   \q   # Exit
   ```

4. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend/services/user-service
   ```

5. **Install dependencies**
   ```bash
   npm install
   ```

6. **Environment Setup**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Update the `.env` file with your configuration:
     ```
     # RabbitMQ Configuration
     RABBITMQ_URL=amqp://guest:guest@localhost:5672
     
     # PostgreSQL Configuration
     DATABASE_URL=postgresql://postgres:postgres@localhost:5432/user_service
     
     # Service Configuration
     PORT=3001
     ```

## Running the Service

1. **Development Mode**
   ```bash
   npm run dev
   ```
   This will start the service with hot-reload enabled.

2. **Production Mode**
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

- `POST /webhook` - Handle user-related webhooks
  - Body: `{ type: string, data: { username: string, email: string, password: string } }`

## Database Integration

The service uses PostgreSQL for data persistence. You can verify the connection by:

1. **Check Database Connection**
   ```bash
   # From your service directory
   npm run prisma:generate
   npm run prisma:migrate
   ```

2. **View Database Tables**
   ```bash
   docker exec -it user-service-postgres-1 psql -U postgres -d user_service -c "\dt"
   ```

## RabbitMQ Integration

The service uses RabbitMQ for event publishing. Events are published to the following queues:
- `user.created` - When a new user is created
- `user.updated` - When a user is updated
- `user.deleted` - When a user is deleted

You can monitor the RabbitMQ server at:
- Management UI: http://localhost:15672
- Default credentials: guest/guest

## Testing

Run the test suite:
```bash
npm test
```

## Troubleshooting

1. **Database Connection Issues**
   - Ensure PostgreSQL container is running: `docker ps`
   - Check database logs: `docker logs user-service-postgres-1`
   - Verify connection string in `.env`
   - Try connecting manually: `docker exec -it user-service-postgres-1 psql -U postgres`

2. **RabbitMQ Connection Issues**
   - Ensure RabbitMQ server is running
   - Check the RabbitMQ URL in `.env`
   - Verify RabbitMQ management UI is accessible

3. **Service Won't Start**
   - Check if port 3001 is available
   - Verify all environment variables are set
   - Check for any error messages in the console

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Run tests: `npm test`
4. Submit a pull request

## License

[Your License Here]

