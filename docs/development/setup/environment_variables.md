# Environment Variables Documentation

## Overview

The REMS project uses environment variables for configuration across different environments
(development, staging, production). This document details all environment variables, their purposes,
and configuration guidelines.

## Table of Contents

1. [Environment Files Structure](#environment-files-structure)
2. [Development Container Variables](#development-container-variables)
3. [Backend Application Variables](#backend-application-variables)
4. [Security Considerations](#security-considerations)
5. [Environment-Specific Configurations](#environment-specific-configurations)
6. [Quick Setup Guide](#quick-setup-guide)

---

## Environment Files Structure

The project uses multiple `.env` files for different components:

```
rems/
├── .devcontainer/
│   ├── .env.example      # Development container template
│   └── .env              # Actual container configuration (gitignored)
├── backend/
│   ├── .env.example      # Backend application template
│   └── .env              # Actual backend configuration (gitignored)
└── frontend/
    ├── .env.example      # Frontend application template (to be created)
    └── .env              # Actual frontend configuration (gitignored)
```

---

## Development Container Variables

Location: `.devcontainer/.env`

### Database Configuration

| Variable            | Type   | Default     | Description                     | Required |
| ------------------- | ------ | ----------- | ------------------------------- | -------- |
| `POSTGRES_DB`       | string | `rems`      | PostgreSQL database name        | ✅       |
| `POSTGRES_USER`     | string | `rems_user` | PostgreSQL username             | ✅       |
| `POSTGRES_PASSWORD` | string | -           | PostgreSQL password             | ✅       |
| `POSTGRES_PORT`     | number | `5432`      | PostgreSQL internal port        | ✅       |
| `POSTGRES_VERSION`  | string | `15-alpine` | PostgreSQL Docker image version | ✅       |

### Container Configuration

| Variable               | Type   | Default    | Description                             | Required |
| ---------------------- | ------ | ---------- | --------------------------------------- | -------- |
| `COMPOSE_PROJECT_NAME` | string | `rems-dev` | Docker Compose project name             | ✅       |
| `DB_HOST`              | string | `postgres` | Database hostname (Docker service name) | ✅       |
| `DB_SCHEMA`            | string | `rems`     | PostgreSQL schema name                  | ✅       |

### Network Configuration

| Variable           | Type   | Default | Description                        | Required |
| ------------------ | ------ | ------- | ---------------------------------- | -------- |
| `BACKEND_PORT`     | number | `3001`  | Backend API external port          | ✅       |
| `FRONTEND_PORT`    | number | `3000`  | Frontend application external port | ✅       |
| `DB_EXTERNAL_PORT` | number | `5432`  | PostgreSQL external port for tools | ✅       |

### Development Tools

| Variable           | Type    | Default            | Description                | Required |
| ------------------ | ------- | ------------------ | -------------------------- | -------- |
| `ENABLE_PGADMIN`   | boolean | `true`             | Enable pgAdmin container   | ❌       |
| `PGADMIN_PORT`     | number  | `8080`             | pgAdmin web interface port | ❌       |
| `PGADMIN_EMAIL`    | string  | `admin@rems.local` | pgAdmin login email        | ❌       |
| `PGADMIN_PASSWORD` | string  | -                  | pgAdmin login password     | ❌       |

### Volume Configuration

| Variable             | Type   | Default           | Description                      | Required |
| -------------------- | ------ | ----------------- | -------------------------------- | -------- |
| `POSTGRES_DATA_PATH` | string | `./postgres-data` | PostgreSQL data persistence path | ✅       |
| `UPLOAD_PATH`        | string | `./uploads`       | File upload directory path       | ✅       |

---

## Backend Application Variables

Location: `backend/.env`

### Database Connection

| Variable      | Type   | Default     | Description       | Required |
| ------------- | ------ | ----------- | ----------------- | -------- |
| `DB_HOST`     | string | `postgres`  | Database hostname | ✅       |
| `DB_PORT`     | number | `5432`      | Database port     | ✅       |
| `DB_NAME`     | string | `rems`      | Database name     | ✅       |
| `DB_USER`     | string | `rems_user` | Database username | ✅       |
| `DB_PASSWORD` | string | -           | Database password | ✅       |
| `DB_SCHEMA`   | string | `rems`      | Database schema   | ✅       |

### Server Configuration

| Variable      | Type   | Default       | Description                                               | Required |
| ------------- | ------ | ------------- | --------------------------------------------------------- | -------- |
| `NODE_ENV`    | string | `development` | Environment mode (`development`, `staging`, `production`) | ✅       |
| `PORT`        | number | `3001`        | Server listening port                                     | ✅       |
| `API_VERSION` | string | `v1`          | API version identifier                                    | ✅       |
| `API_PREFIX`  | string | `/api`        | API route prefix                                          | ✅       |

### Security Configuration

| Variable          | Type   | Default    | Description                               | Required |
| ----------------- | ------ | ---------- | ----------------------------------------- | -------- |
| `JWT_SECRET`      | string | -          | JWT signing secret (min 32 chars)         | ✅       |
| `JWT_EXPIRE`      | string | `24h`      | JWT token expiration time                 | ✅       |
| `BCRYPT_ROUNDS`   | number | `12`       | Bcrypt hashing rounds (10-15 recommended) | ✅       |
| `SESSION_SECRET`  | string | -          | Express session secret                    | ❌       |
| `SESSION_MAX_AGE` | number | `86400000` | Session max age in milliseconds (24h)     | ❌       |

### CORS Configuration

| Variable      | Type   | Default                 | Description                                         | Required |
| ------------- | ------ | ----------------------- | --------------------------------------------------- | -------- |
| `CORS_ORIGIN` | string | `http://localhost:3000` | Allowed CORS origins (comma-separated for multiple) | ✅       |

### Email Configuration (Optional)

| Variable          | Type    | Default       | Description                  | Required |
| ----------------- | ------- | ------------- | ---------------------------- | -------- |
| `SMTP_HOST`       | string  | -             | SMTP server hostname         | ❌       |
| `SMTP_PORT`       | number  | `587`         | SMTP server port             | ❌       |
| `SMTP_USER`       | string  | -             | SMTP authentication username | ❌       |
| `SMTP_PASS`       | string  | -             | SMTP authentication password | ❌       |
| `SMTP_SECURE`     | boolean | `false`       | Use TLS/SSL for SMTP         | ❌       |
| `SMTP_FROM_NAME`  | string  | `REMS System` | Default sender name          | ❌       |
| `SMTP_FROM_EMAIL` | string  | -             | Default sender email         | ❌       |

### File Upload Configuration

| Variable             | Type   | Default                     | Description                        | Required |
| -------------------- | ------ | --------------------------- | ---------------------------------- | -------- |
| `UPLOAD_DIR`         | string | `uploads`                   | Upload directory path              | ✅       |
| `MAX_FILE_SIZE`      | number | `10485760`                  | Max file size in bytes (10MB)      | ✅       |
| `ALLOWED_FILE_TYPES` | string | `jpg,jpeg,png,pdf,doc,docx` | Comma-separated allowed extensions | ✅       |

### Development & Debugging

| Variable     | Type    | Default | Description                                      | Required |
| ------------ | ------- | ------- | ------------------------------------------------ | -------- |
| `DEBUG_MODE` | boolean | `true`  | Enable debug mode                                | ❌       |
| `LOG_LEVEL`  | string  | `debug` | Logging level (`error`, `warn`, `info`, `debug`) | ❌       |

### Rate Limiting

| Variable                  | Type   | Default | Description                  | Required |
| ------------------------- | ------ | ------- | ---------------------------- | -------- |
| `RATE_LIMIT_WINDOW`       | number | `15`    | Rate limit window in minutes | ❌       |
| `RATE_LIMIT_MAX_REQUESTS` | number | `100`   | Max requests per window      | ❌       |

---

## Security Considerations

### Critical Security Variables

⚠️ **Never commit these to version control:**

1. **Database Passwords**
   - Use strong, unique passwords (min 16 characters)
   - Include uppercase, lowercase, numbers, and special characters
   - Example generator: `openssl rand -base64 32`

2. **JWT Secret**

   ```bash
   # Generate secure JWT secret
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

3. **Session Secret**
   ```bash
   # Generate secure session secret
   openssl rand -base64 64
   ```

### Environment-Specific Security

| Environment     | Recommendations                                                                                      |
| --------------- | ---------------------------------------------------------------------------------------------------- |
| **Development** | - Use `.env.example` values for consistency<br>- Simple passwords acceptable<br>- Debug mode enabled |
| **Staging**     | - Unique passwords<br>- Debug mode disabled<br>- Rate limiting enabled                               |
| **Production**  | - Strong, unique secrets<br>- SSL/TLS required<br>- Strict rate limiting<br>- No debug output        |

---

## Environment-Specific Configurations

### Development Environment

```bash
# .devcontainer/.env
NODE_ENV=development
DEBUG_MODE=true
LOG_LEVEL=debug
BCRYPT_ROUNDS=10  # Lower for faster development
JWT_EXPIRE=7d     # Longer for convenience
```

### Staging Environment

```bash
NODE_ENV=staging
DEBUG_MODE=false
LOG_LEVEL=info
BCRYPT_ROUNDS=12
JWT_EXPIRE=24h
RATE_LIMIT_MAX_REQUESTS=100
```

### Production Environment

```bash
NODE_ENV=production
DEBUG_MODE=false
LOG_LEVEL=error
BCRYPT_ROUNDS=14
JWT_EXPIRE=2h
RATE_LIMIT_MAX_REQUESTS=50
RATE_LIMIT_WINDOW=5
```

---

## Quick Setup Guide

### 1. Initial Setup

```bash
# Copy environment templates
cp .devcontainer/.env.example .devcontainer/.env
cp backend/.env.example backend/.env

# Generate secure secrets
echo "JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")" >> backend/.env
echo "SESSION_SECRET=$(openssl rand -base64 64)" >> backend/.env
```

### 2. Database Configuration

For development with Docker:

```bash
# .devcontainer/.env
POSTGRES_PASSWORD=dev_password_123
DB_PASSWORD=dev_password_123

# backend/.env (must match)
DB_PASSWORD=dev_password_123
```

### 3. Email Configuration (Optional)

For Gmail SMTP:

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
SMTP_SECURE=false
```

For SendGrid:

```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
SMTP_SECURE=false
```

### 4. Validation Script

Create `scripts/validate-env.js`:

```javascript
const required = {
  backend: ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'JWT_SECRET'],
  container: ['POSTGRES_DB', 'POSTGRES_USER', 'POSTGRES_PASSWORD'],
};

// Validation logic here
```

---

## Troubleshooting

### Common Issues

| Issue                       | Solution                                            |
| --------------------------- | --------------------------------------------------- |
| Database connection refused | Check `DB_HOST` matches Docker service name         |
| JWT errors                  | Ensure `JWT_SECRET` is set and consistent           |
| CORS errors                 | Verify `CORS_ORIGIN` matches frontend URL           |
| File upload fails           | Check `UPLOAD_DIR` exists and has write permissions |

### Debug Commands

```bash
# Check environment variables
node -e "console.log(process.env)" | grep DB_

# Test database connection
docker-compose exec postgres psql -U $POSTGRES_USER -d $POSTGRES_DB

# Verify file permissions
ls -la uploads/
```

---

## Additional Resources

- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices#configuration)
- [The Twelve-Factor App - Config](https://12factor.net/config)
- [Docker Environment Variables](https://docs.docker.com/compose/environment-variables/)
- [PostgreSQL Environment Variables](https://www.postgresql.org/docs/current/libpq-envars.html)

---

## Future Enhancements

### Planned Variables (v2.0)

- `REDIS_URL` - Redis connection for caching
- `ELASTICSEARCH_URL` - Search functionality
- `AWS_S3_BUCKET` - Cloud storage for uploads
- `STRIPE_API_KEY` - Payment processing
- `TWILIO_AUTH_TOKEN` - SMS notifications
- `GOOGLE_MAPS_API_KEY` - Property location services

### Configuration Management

Consider implementing:

- AWS Systems Manager Parameter Store
- HashiCorp Vault for secrets
- Kubernetes ConfigMaps and Secrets
- Docker Swarm configs

---

_Last Updated: [23/08/2025]_ _Version: 1.0_
