# Express AuthX

A secure and robust authentication API built with Express.js, TypeScript, and PostgreSQL.

## Features

- **JWT Authentication**: Secure authentication with access and refresh tokens
- **Role-Based Access Control**: Admin and regular user roles
- **Input Validation**: Comprehensive validation using class-validator and DTOs
- **Security**: Helmet, CORS, rate limiting, and other security best practices
- **Database**: PostgreSQL with TypeORM for data persistence
- **Redis**: Session management and token storage
- **Logging**: Structured logging with Winston
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Environment Configuration**: Validated environment variables with Joi

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with TypeORM
- **Cache**: Redis
- **Authentication**: JWT with bcrypt for password hashing
- **Validation**: class-validator and class-transformer
- **Logging**: Winston
- **Security**: Helmet, CORS, express-rate-limit
- **Development**: ESLint, Prettier, ts-node-dev

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- Redis
- Docker (optional, for running databases)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd express-authx
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example environment file and update it with your configuration:

```bash
cp .env.example .env
```

Update the `.env` file with your database and Redis credentials.

### 4. Start the databases (using Docker)

```bash
docker-compose up -d
```

This will start PostgreSQL and Redis containers.

### 5. Run the application

For development:

```bash
npm run dev
```

For production:

```bash
npm run build
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/sign-up` - Register a new user
- `POST /api/auth/sign-in` - Login with email and password
- `POST /api/auth/refresh-tokens` - Refresh access token

### Users (Protected)

- `GET /api/users` - Get all users (requires authentication)
- `GET /api/users/:id` - Get user by ID (requires authentication)
- `POST /api/users` - Create a new user (requires admin role)
- `PUT /api/users/:id` - Update user (requires authentication)
- `DELETE /api/users/:id` - Delete user (requires admin role)

### Health Check

- `GET /health` - Application health status

## Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── dto/            # Data Transfer Objects for validation
├── enums/          # Enumerations
├── errors/         # Custom error classes
├── interfaces/     # TypeScript interfaces
├── middlewares/    # Express middlewares
├── models/         # Database entities
├── routes/         # Route definitions
├── services/       # Business logic
└── utils/          # Utility functions
```

## Development

### Code Quality

Run linting:

```bash
npm run lint
npm run lint:fix
```

Run formatting:

```bash
npm run format
npm run format:check
```

Type checking:

```bash
npm run typecheck
```

### Environment Variables

| Variable                  | Description                 | Default       |
| ------------------------- | --------------------------- | ------------- |
| `NODE_ENV`                | Application environment     | `development` |
| `PORT`                    | Server port                 | `3000`        |
| `DB_HOST`                 | PostgreSQL host             | -             |
| `DB_PORT`                 | PostgreSQL port             | `5432`        |
| `DB_USER`                 | PostgreSQL username         | -             |
| `DB_PASS`                 | PostgreSQL password         | -             |
| `DB_NAME`                 | PostgreSQL database name    | -             |
| `JWT_SECRET`              | JWT signing secret          | -             |
| `JWT_TOKEN_AUDIENCE`      | JWT audience                | -             |
| `JWT_TOKEN_ISSUER`        | JWT issuer                  | -             |
| `JWT_ACCESS_TOKEN_TTL`    | Access token TTL (seconds)  | `3600`        |
| `JWT_REFRESH_TOKEN_TTL`   | Refresh token TTL (seconds) | `86400`       |
| `REDIS_HOST`              | Redis host                  | -             |
| `REDIS_PORT`              | Redis port                  | `6379`        |
| `RATE_LIMIT_WINDOW_MS`    | Rate limit window           | `900000`      |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window     | `100`         |

## Security Features

- **Helmet**: Sets various HTTP headers for security
- **CORS**: Configurable Cross-Origin Resource Sharing
- **Rate Limiting**: Prevents abuse with configurable limits
- **JWT Security**: Secure token generation and validation
- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: Comprehensive validation for all inputs
- **Error Handling**: No sensitive information leakage

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation as needed
4. Run linting and formatting before submitting

## License

This project is licensed under the MIT License.
